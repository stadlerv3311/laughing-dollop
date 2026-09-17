"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Button, Field, controlClass, errorId } from "@/components/ui";
import { cx } from "@/lib/cx";
import { submitQuote, type QuoteRequest } from "@/lib/forms";
import { usStates, type StateCode } from "@/lib/us-states";
import { stateForZip } from "@/lib/zip";
import { StateMap } from "./StateMap";

type Stop = { state: StateCode | ""; place: string };
type StopKey = "pickup" | "delivery";

type Values = {
  pickup: Stop;
  delivery: Stop;
  weight: string;
  freight: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};

/** Validated fields, in the order they appear — the first one with an error gets focus on submit. */
const FIELDS = [
  "pickupState",
  "pickupPlace",
  "deliveryState",
  "deliveryPlace",
  "weight",
  "freight",
  "name",
  "email",
  "phone",
] as const;
type FieldName = (typeof FIELDS)[number] | "company";
type Errors = Partial<Record<FieldName, string>>;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

const emptyStop: Stop = { state: "", place: "" };
const emptyValues: Values = {
  pickup: emptyStop,
  delivery: emptyStop,
  weight: "",
  freight: "",
  name: "",
  company: "",
  email: "",
  phone: "",
};

const stateName = (code: StateCode | "") => usStates.find((state) => state.code === code)?.name;
const OUTSIDE_MESSAGE = "That ZIP is in Alaska or Hawaii — we only run the lower 48.";

/** Change a stop's state. A ZIP typed for a different state no longer fits, so it's cleared; a city name stays. */
function withState(stop: Stop, state: StateCode | ""): Stop {
  const zipState = stateForZip(stop.place);
  return { state, place: zipState === null || zipState === state ? stop.place : "" };
}

/** Map clicks: a picked state clears (delivery first); otherwise fill pickup, then delivery, then replace delivery. */
function pickOnMap(values: Values, code: StateCode): Values {
  if (code === values.delivery.state) return { ...values, delivery: withState(values.delivery, "") };
  if (code === values.pickup.state) return { ...values, pickup: withState(values.pickup, "") };
  if (!values.pickup.state) return { ...values, pickup: withState(values.pickup, code) };
  return { ...values, delivery: withState(values.delivery, code) };
}

function parseWeight(text: string) {
  return Number(text.replace(/[,\s]/g, "").replace(/lbs?$/i, ""));
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  for (const key of ["pickup", "delivery"] as const) {
    const label = key === "pickup" ? "pickup" : "delivery";
    if (!values[key].state) errors[`${key}State`] = `Choose the ${label} state — here or on the map.`;
    if (stateForZip(values[key].place) === "outside") errors[`${key}Place`] = OUTSIDE_MESSAGE;
    else if (!values[key].place.trim()) errors[`${key}Place`] = `Add the ${label} city or ZIP.`;
  }
  if (!(parseWeight(values.weight) > 0)) errors.weight = "Enter the weight in pounds.";
  if (!values.freight.trim()) errors.freight = "Tell us what you're shipping.";
  if (!values.name.trim()) errors.name = "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter an email we can reply to.";
  if (values.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a phone number with area code.";
  return errors;
}

function toRequest(values: Values): QuoteRequest {
  return {
    pickup: { state: values.pickup.state as StateCode, place: values.pickup.place.trim() },
    delivery: { state: values.delivery.state as StateCode, place: values.delivery.place.trim() },
    weightLbs: parseWeight(values.weight),
    freight: values.freight.trim(),
    contact: {
      name: values.name.trim(),
      company: values.company.trim() || undefined,
      email: values.email.trim(),
      phone: values.phone.trim(),
    },
  };
}

/**
 * Get a Quote: the form on the left, the state map on the right, kept in sync — clicking a state fills the dropdown,
 * choosing a state or typing a ZIP lights up the map. Validates in the browser, then hands off to `submitQuote`.
 */
export function QuoteForm({ className }: { className?: string }) {
  const baseId = useId();
  const id = (field: FieldName) => `${baseId}-${field}`;

  const [values, setValues] = useState<Values>(emptyValues);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const allErrors = validate(values);
  // Required-field errors wait for the first submit; an Alaska/Hawaii ZIP is flagged as soon as it's typed.
  const errors: Errors = showErrors
    ? allErrors
    : {
        pickupPlace: allErrors.pickupPlace === OUTSIDE_MESSAGE ? OUTSIDE_MESSAGE : undefined,
        deliveryPlace: allErrors.deliveryPlace === OUTSIDE_MESSAGE ? OUTSIDE_MESSAGE : undefined,
      };

  function setField(field: "weight" | "freight" | "name" | "company" | "email" | "phone", value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function setStopState(key: StopKey, state: StateCode | "") {
    setValues((current) => ({ ...current, [key]: withState(current[key], state) }));
  }

  function setStopPlace(key: StopKey, place: string) {
    setValues((current) => {
      const zipState = stateForZip(place);
      const state = zipState && zipState !== "outside" ? zipState : current[key].state;
      return { ...current, [key]: { state, place } };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowErrors(true);

    const firstInvalid = FIELDS.find((field) => allErrors[field]);
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const result = await submitQuote(toRequest(values));
    setStatus(result.ok ? { kind: "sent" } : { kind: "failed", message: result.message });
  }

  function startOver() {
    setValues(emptyValues);
    setShowErrors(false);
    setStatus({ kind: "idle" });
  }

  const pickup = values.pickup.state || null;
  const delivery = values.delivery.state || null;

  return (
    <div className={cx("grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14", className)}>
      {status.kind === "sent" ? (
        <div className="rounded-[2rem] bg-ink p-8 text-paper sm:p-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-paper/70">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            Request received
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Thanks, {values.name.trim().split(/\s+/)[0]}.
          </h2>
          <p className="mt-4 text-lg text-paper/75">
            We&apos;ve got your quote request for {values.pickup.place}, {stateName(values.pickup.state)} to{" "}
            {values.delivery.place}, {stateName(values.delivery.state)}. We&apos;ll get back to you by phone or email.
          </p>
          <button
            type="button"
            onClick={startOver}
            className="mt-8 font-semibold underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-paper"
          >
            Request another quote
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-10">
          <StopFields
            legend="Pickup"
            dotClass="bg-ink"
            stop={values.pickup}
            stateId={id("pickupState")}
            placeId={id("pickupPlace")}
            stateError={errors.pickupState}
            placeError={errors.pickupPlace}
            onState={(state) => setStopState("pickup", state)}
            onPlace={(place) => setStopPlace("pickup", place)}
          />
          <StopFields
            legend="Delivery"
            dotClass="bg-brand"
            stop={values.delivery}
            stateId={id("deliveryState")}
            placeId={id("deliveryPlace")}
            stateError={errors.deliveryState}
            placeError={errors.deliveryPlace}
            onState={(state) => setStopState("delivery", state)}
            onPlace={(place) => setStopPlace("delivery", place)}
          />

          <Group legend="The load">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
              <Field id={id("weight")} label="Weight" error={errors.weight}>
                <div className="relative">
                  <input
                    {...controlProps(id("weight"), errors.weight)}
                    inputMode="numeric"
                    placeholder="e.g. 38,000"
                    value={values.weight}
                    onChange={(event) => setField("weight", event.target.value)}
                    className={cx(controlClass, "pr-12")}
                  />
                  <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/60">
                    lbs
                  </span>
                </div>
              </Field>
              <Field id={id("freight")} label="What are you shipping?" error={errors.freight}>
                <input
                  {...controlProps(id("freight"), errors.freight)}
                  placeholder="e.g. Palletized canned goods"
                  value={values.freight}
                  onChange={(event) => setField("freight", event.target.value)}
                  className={controlClass}
                />
              </Field>
            </div>
          </Group>

          <Group legend="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={id("name")} label="Name" error={errors.name}>
                <input
                  {...controlProps(id("name"), errors.name)}
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) => setField("name", event.target.value)}
                  className={controlClass}
                />
              </Field>
              <Field id={id("company")} label="Company" optional>
                <input
                  id={id("company")}
                  autoComplete="organization"
                  value={values.company}
                  onChange={(event) => setField("company", event.target.value)}
                  className={controlClass}
                />
              </Field>
              <Field id={id("email")} label="Email" error={errors.email}>
                <input
                  {...controlProps(id("email"), errors.email)}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => setField("email", event.target.value)}
                  className={controlClass}
                />
              </Field>
              <Field id={id("phone")} label="Phone" error={errors.phone}>
                <input
                  {...controlProps(id("phone"), errors.phone)}
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  className={controlClass}
                />
              </Field>
            </div>
          </Group>

          <div className="flex flex-col items-start gap-4">
            {status.kind === "failed" && (
              <p role="alert" className="text-base font-medium">
                {status.message}
              </p>
            )}
            <Button type="submit" size="lg" disabled={status.kind === "sending"} className="disabled:opacity-60">
              {status.kind === "sending" ? "Sending…" : "Request a quote"}
            </Button>
          </div>
        </form>
      )}

      <div className="order-first lg:order-none lg:sticky lg:mt-[50px] lg:top-[162px]">
        <StateMap
          pickup={pickup}
          delivery={delivery}
          onPick={(code) => status.kind !== "sent" && setValues((current) => pickOnMap(current, code))}
        />
        <RouteSummary
          pickup={pickup}
          delivery={delivery}
          locked={status.kind === "sent"}
          onSwap={() => setValues((current) => ({ ...current, pickup: current.delivery, delivery: current.pickup }))}
          onClear={() => setValues((current) => ({ ...current, pickup: emptyStop, delivery: emptyStop }))}
        />
      </div>
    </div>
  );
}

function controlProps(id: string, error: string | undefined) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId(id) : undefined,
  };
}

function Group({ legend, dotClass, children }: { legend: string; dotClass?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em]">
        {dotClass && <span aria-hidden className={cx("size-3 rounded-full ring-2 ring-paper", dotClass)} />}
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

type StopFieldsProps = {
  legend: string;
  dotClass: string;
  stop: Stop;
  stateId: string;
  placeId: string;
  stateError?: string;
  placeError?: string;
  onState: (state: StateCode | "") => void;
  onPlace: (place: string) => void;
};

function StopFields({ legend, dotClass, stop, stateId, placeId, stateError, placeError, onState, onPlace }: StopFieldsProps) {
  return (
    <Group legend={legend} dotClass={dotClass}>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
        <Field id={stateId} label="State" error={stateError}>
          <div className="relative">
            <select
              {...controlProps(stateId, stateError)}
              value={stop.state}
              onChange={(event) => onState(event.target.value as StateCode | "")}
              className={cx(controlClass, "appearance-none pr-10", !stop.state && "text-ink/60")}
            >
              <option value="">Choose a state</option>
              {usStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/60"
            >
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Field>
        <Field id={placeId} label="City or ZIP" error={placeError}>
          <input
            {...controlProps(placeId, placeError)}
            autoComplete="off"
            placeholder={legend === "Pickup" ? "e.g. Sacramento or 95610" : "e.g. Dallas or 75201"}
            value={stop.place}
            onChange={(event) => onPlace(event.target.value)}
            className={controlClass}
          />
        </Field>
      </div>
    </Group>
  );
}

type RouteSummaryProps = {
  pickup: StateCode | null;
  delivery: StateCode | null;
  locked: boolean;
  onSwap: () => void;
  onClear: () => void;
};

/** Line under the map: what's picked so far (or what to click next), plus Swap and Clear. */
function RouteSummary({ pickup, delivery, locked, onSwap, onClear }: RouteSummaryProps) {
  const prompt = !pickup ? "Click a state to set the pickup." : !delivery ? "Now click the delivery state." : null;
  const smallButton =
    "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ring-ink/20 transition-shadow hover:ring-ink/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <div className="mt-4 flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:mt-6">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:text-base">
        {pickup && <StopLabel label="Pickup" dotClass="bg-ink" name={stateName(pickup)} />}
        {pickup && delivery && <span aria-hidden className="text-ink/60">→</span>}
        {delivery && <StopLabel label="Delivery" dotClass="bg-brand" name={stateName(delivery)} />}
        {prompt && <span className="text-ink/70">{prompt}</span>}
      </p>
      {!locked && (pickup || delivery) && (
        <div className="flex gap-2">
          <button type="button" onClick={onSwap} className={smallButton}>
            Swap
          </button>
          <button type="button" onClick={onClear} className={smallButton}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

function StopLabel({ label, dotClass, name }: { label: string; dotClass: string; name?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={cx("size-2.5 rounded-full", dotClass)} />
      <span className="text-ink/70">{label}</span>
      <span className="font-semibold">{name}</span>
    </span>
  );
}
