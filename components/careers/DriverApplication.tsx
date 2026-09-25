"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Field, InteractiveHoverButton, controlClass, errorId, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { submitDriverApplication } from "@/lib/forms";
import { applyLink, applyRoutes, driverSlogans } from "@/lib/site";
import { usStates } from "@/lib/us-states";

// The owner's eight questions (2026-09-25). Wording of the page around them is still draft.
const CLASS_A = ["Yes", "Not yet"] as const;
const ENDORSEMENTS = ["Hazmat", "Tanker", "Doubles"] as const;
const NONE = "None";

// A license can come from any state; the quote map's list is the lower 48 and DC, so Alaska and Hawaii are added.
const LICENSE_STATES = [...usStates, { code: "AK", name: "Alaska" }, { code: "HI", name: "Hawaii" }]
  .map(({ code, name }) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

type Values = {
  first: string;
  last: string;
  phone: string;
  email: string;
  zip: string;
  classA: string;
  years: string;
  licenseState: string;
  licenseNumber: string;
  endorsements: string[];
};
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type Status = { kind: "idle" | "sending" | "sent" } | { kind: "failed"; message: string };

const empty: Values = {
  first: "",
  last: "",
  phone: "",
  email: "",
  zip: "",
  classA: "",
  years: "",
  licenseState: "",
  licenseNumber: "",
  endorsements: [],
};

/** The fields on each phone step, in order. The whole list is also the desktop form's order. */
const STEPS: FieldName[][] = [
  ["first", "last"],
  ["phone"],
  ["email"],
  ["zip"],
  ["classA"],
  ["years"],
  ["licenseState", "licenseNumber"],
  ["endorsements"],
];
const FIELDS = STEPS.flat();

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.first.trim()) errors.first = "Enter your first name.";
  if (!values.last.trim()) errors.last = "Enter your last name.";
  if (values.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a phone number with area code.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter an email address.";
  if (!/^\d{5}$/.test(values.zip.trim())) errors.zip = "Enter a 5-digit ZIP code.";
  if (!values.classA) errors.classA = "Choose one.";
  if (!/^\d{1,2}$/.test(values.years.trim())) errors.years = "Enter a number of years — 0 is fine.";
  if (!values.licenseState) errors.licenseState = "Choose the state.";
  if (!/^[A-Za-z0-9-]{4,20}$/.test(values.licenseNumber.replace(/\s/g, ""))) errors.licenseNumber = "Enter the license number.";
  if (values.endorsements.length === 0) errors.endorsements = "Choose any that apply, or None.";
  return errors;
}

// Matches Tailwind's `md`, where the page switches from the phone stepper to the side-by-side form (owner,
// 2026-09-25: the half-and-half layout should show on tablets and narrow laptop windows too, not only from `lg`).
const isWide = () => window.matchMedia("(min-width: 48rem)").matches;

/** Puts the cursor on a field; for a set of tap answers, on its chosen (or first) answer. */
function focusField(fieldId: string) {
  const el = document.getElementById(fieldId);
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) el.focus();
  else el?.querySelector<HTMLInputElement>("input:checked, input")?.focus();
}

/**
 * Drive for us (2026-09-25, owner chose it from a mock-up after a Mobbin pass: Lightship and Serus for the wide
 * layout, Dropbox Dash and Hers for the phone). One form, two ways through it:
 *
 * - From `md`, the page is split in half: the driver portrait stays put on the left with the owner's line on it,
 *   and all eight questions sit on one form on the right, sent with one button.
 * - Below `md`, the portrait opens the page with the heading and an Apply now button, then shrinks to a strip while
 *   the questions come one at a time under a thin progress line. Tapping a single answer moves on by itself.
 *
 * It's one `<form>` either way: on phones CSS hides every question but the current one, so the fields, their ids
 * and the checks are shared. Sends through `submitDriverApplication`, a stub until the backend exists.
 */
export function DriverApplication() {
  const baseId = useId();
  const id = (field: FieldName) => `${baseId}-${field}`;
  const lenis = useLenis();

  const [values, setValues] = useState<Values>(empty);
  // -1 is the phone's opening screen, before the first question.
  const [step, setStep] = useState(-1);
  // Fields whose errors are on show: a phone step's once Continue was pressed, everything after a wide send.
  const [shown, setShown] = useState<FieldName[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  const allErrors = validate(values);
  const errors: Errors = Object.fromEntries(shown.map((field) => [field, allErrors[field]]));
  const last = STEPS.length - 1;

  const set = (field: Exclude<FieldName, "endorsements">, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  // Each new phone step starts at the top of the page, with the cursor in its first box if it has one.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    if (isWide()) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    if (step >= 0) {
      const box = formRef.current?.querySelector<HTMLElement>(
        `[data-step="${step}"] input:not([type=radio]):not([type=checkbox]), [data-step="${step}"] select`,
      );
      box?.focus({ preventScroll: true });
    }
    // Only when the step changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function send() {
    setStatus({ kind: "sending" });
    const result = await submitDriverApplication({
      firstName: values.first.trim(),
      lastName: values.last.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      zip: values.zip.trim(),
      hasClassA: values.classA === "Yes",
      yearsClassA: Number(values.years.trim()),
      license: { state: values.licenseState, number: values.licenseNumber.replace(/\s/g, "").toUpperCase() },
      endorsements: values.endorsements.filter((endorsement) => endorsement !== NONE),
    });
    setStatus(result.ok ? { kind: "sent" } : { kind: "failed", message: result.message });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Phone: the button is Continue until the last step, and checks only the fields on screen.
    if (!isWide() && step < last) {
      const here = STEPS[step];
      setShown((current) => [...new Set([...current, ...here])]);
      const firstInvalid = here.find((field) => allErrors[field]);
      if (firstInvalid) {
        focusField(id(firstInvalid));
        return;
      }
      setStep(step + 1);
      return;
    }

    setShown(FIELDS);
    const firstInvalid = FIELDS.find((field) => allErrors[field]);
    if (firstInvalid) {
      setStep(STEPS.findIndex((fields) => fields.includes(firstInvalid)));
      focusField(id(firstInvalid));
      return;
    }
    void send();
  }

  // A tapped single answer on a phone moves straight on; on the wide layout it just marks the choice.
  function choose(value: string) {
    set("classA", value);
    if (!isWide() && step < last) setTimeout(() => setStep((current) => current + 1), 180);
  }

  // Check all that apply; None clears the others, and any endorsement clears None.
  function toggleEndorsement(value: string) {
    setValues((current) => {
      const on = current.endorsements.includes(value);
      let next = on ? current.endorsements.filter((item) => item !== value) : [...current.endorsements, value];
      if (!on) next = value === NONE ? [NONE] : next.filter((item) => item !== NONE);
      return { ...current, endorsements: next };
    });
  }

  const sent = status.kind === "sent";
  const onPhoneStep = step >= 0 && !sent;
  const driver = applyRoutes[0].image;
  const slogan = driverSlogans[0];

  return (
    <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
      {/*
        The portrait. From `md` it's sticky and fills the screen's height; on phones it opens tall and shrinks to a
        strip once the questions start, and the line on it fades out so the strip is just the picture.
      */}
      <div
        className={cx(
          "relative overflow-hidden rounded-3xl bg-ink/10 transition-[height] duration-500 ease-premium md:sticky md:top-28 md:h-[calc(100svh-9rem)] md:min-h-[32rem]",
          onPhoneStep ? "h-36 sm:h-48" : "h-[46svh] min-h-72",
        )}
      >
        <Image
          src={driver.src}
          alt={driver.alt}
          fill
          priority
          sizes="(width >= 48rem) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: driver.position }}
        />
        <div
          aria-hidden
          className={cx(
            "absolute inset-0 bg-[linear-gradient(to_top,rgb(12_12_12/.6),rgb(12_12_12/0)_45%)] transition-opacity duration-500",
            onPhoneStep && "max-md:opacity-0",
          )}
        />
        <p
          className={cx(
            "absolute inset-x-6 bottom-6 text-balance text-xl font-medium leading-snug tracking-[-0.02em] text-paper transition-opacity duration-500 sm:text-2xl lg:inset-x-8 lg:bottom-8",
            onPhoneStep && "max-md:opacity-0",
          )}
        >
          {slogan.lead} <span className="text-paper/60">{slogan.tail}</span>
        </p>
      </div>

      <div className="md:pt-10">
        {sent ? (
          <div role="status" className="max-md:pt-4">
            <span aria-hidden className="grid size-14 place-items-center rounded-full bg-ink text-xl text-paper">
              ✓
            </span>
            <h2 className="mt-7 text-[2.25rem] font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Thanks, {values.first.trim()}.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">
              HR will call you back on {values.phone.trim()}. There&rsquo;s nothing else to do.
            </p>
          </div>
        ) : (
          <>
            {/* The heading: always on the wide layout, only on the opening screen on phones. */}
            <div className={cx(onPhoneStep && "max-md:hidden")}>
              <p className={cx(labelClass, "text-ink/70")}>Drive for us</p>
              <h1 className="mt-4 max-w-[14ch] text-balance text-[2.5rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-[clamp(2.25rem,4.5vw,3.75rem)]">
                A few questions, then we call you.
              </h1>
              <p className="mt-5 max-w-[32rem] text-pretty text-lg leading-relaxed text-ink/70">
                Class A, dry van and the bonus tracker in your app. No résumé, no uploads. Then HR calls you back.
              </p>
              <InteractiveHoverButton
                text={applyLink.label}
                size="lg"
                variant="ink"
                className="mt-8 w-full sm:w-56 md:hidden"
                onClick={() => setStep(0)}
              />
            </div>

            {/* Phone only: where you are in the eight. */}
            {onPhoneStep && (
              <div className="md:hidden">
                <div className="h-[3px] overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full bg-ink transition-[width] duration-500 ease-premium"
                    style={{ width: `${(step / STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="mt-2.5 flex justify-between text-sm text-ink/70 tabular-nums">
                  <span>
                    Question {step + 1} of {STEPS.length}
                  </span>
                  <span>About two minutes</span>
                </div>
              </div>
            )}

            <form
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
              className={cx("mt-10 flex flex-col gap-8 md:mt-12", !onPhoneStep && "max-md:hidden")}
            >
              <Question step={0} current={step} legend="What’s your name?">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-3 md:max-lg:grid-cols-1">
                  <Field id={id("first")} label="First name" error={errors.first}>
                    <input
                      {...controlProps(id("first"), errors.first)}
                      autoComplete="given-name"
                      value={values.first}
                      onChange={(event) => set("first", event.target.value)}
                      className={controlClass}
                    />
                  </Field>
                  <Field id={id("last")} label="Last name" error={errors.last}>
                    <input
                      {...controlProps(id("last"), errors.last)}
                      autoComplete="family-name"
                      value={values.last}
                      onChange={(event) => set("last", event.target.value)}
                      className={controlClass}
                    />
                  </Field>
                </div>
              </Question>

              <Question step={1} current={step} legend="What number should HR call?">
                <Field id={id("phone")} label="Phone" error={errors.phone}>
                  <input
                    {...controlProps(id("phone"), errors.phone)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(event) => set("phone", event.target.value)}
                    className={controlClass}
                  />
                </Field>
              </Question>

              <Question step={2} current={step} legend="And your email?">
                <Field id={id("email")} label="Email" error={errors.email}>
                  <input
                    {...controlProps(id("email"), errors.email)}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => set("email", event.target.value)}
                    className={controlClass}
                  />
                </Field>
              </Question>

              <Question step={3} current={step} legend="Where do you live?" hint="Your ZIP code, so we know which lanes get you home.">
                <Field id={id("zip")} label="ZIP code" error={errors.zip} className="max-w-48">
                  <input
                    {...controlProps(id("zip"), errors.zip)}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={values.zip}
                    onChange={(event) => set("zip", event.target.value)}
                    className={controlClass}
                  />
                </Field>
              </Question>

              <Question step={4} current={step} legend="Do you have a Class A CDL?">
                <Choices
                  name={id("classA")}
                  type="radio"
                  options={CLASS_A}
                  selected={[values.classA]}
                  error={errors.classA}
                  onToggle={choose}
                />
              </Question>

              <Question step={5} current={step} legend="How many years have you driven Class A?">
                <Field id={id("years")} label="Years" error={errors.years} className="max-w-32">
                  <input
                    {...controlProps(id("years"), errors.years)}
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="0"
                    value={values.years}
                    onChange={(event) => set("years", event.target.value)}
                    className={controlClass}
                  />
                </Field>
              </Question>

              <Question step={6} current={step} legend="Your driver’s license" hint="The state that issued it, and its number.">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                  <Field id={id("licenseState")} label="State" error={errors.licenseState}>
                    <select
                      {...controlProps(id("licenseState"), errors.licenseState)}
                      value={values.licenseState}
                      onChange={(event) => set("licenseState", event.target.value)}
                      className={cx(controlClass, "appearance-none", !values.licenseState && "text-ink/45")}
                    >
                      <option value="" disabled>
                        State
                      </option>
                      {LICENSE_STATES.map((state) => (
                        <option key={state.code} value={state.code} className="text-ink">
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id={id("licenseNumber")} label="License number" error={errors.licenseNumber}>
                    <input
                      {...controlProps(id("licenseNumber"), errors.licenseNumber)}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      value={values.licenseNumber}
                      onChange={(event) => set("licenseNumber", event.target.value)}
                      className={controlClass}
                    />
                  </Field>
                </div>
              </Question>

              <Question step={7} current={step} legend="Any endorsements?" hint="Check all that apply.">
                <Choices
                  name={id("endorsements")}
                  type="checkbox"
                  options={[...ENDORSEMENTS, NONE]}
                  selected={values.endorsements}
                  error={errors.endorsements}
                  onToggle={toggleEndorsement}
                />
              </Question>

              <div className="flex flex-col items-start gap-4 md:border-t md:border-ink/10 md:pt-8">
                {status.kind === "failed" && (
                  <p role="alert" className="text-base font-medium">
                    {status.message}
                  </p>
                )}
                <div className="flex w-full items-center gap-5">
                  {/* Wide: one send. Phone: Continue until the last question, then the same send. */}
                  <InteractiveHoverButton
                    type="submit"
                    text={status.kind === "sending" ? "Sending…" : step < last ? "Continue" : "Send application"}
                    size="lg"
                    variant="ink"
                    disabled={status.kind === "sending"}
                    className="w-full sm:w-56 md:hidden"
                  />
                  <InteractiveHoverButton
                    type="submit"
                    text={status.kind === "sending" ? "Sending…" : "Send application"}
                    size="lg"
                    variant="ink"
                    disabled={status.kind === "sending"}
                    className="w-56 max-md:hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="shrink-0 py-2 font-medium text-ink/70 transition-colors hover:text-ink md:hidden"
                  >
                    Back
                  </button>
                </div>
                <p className={cx("text-sm text-ink/60", step < last && "max-md:hidden")}>
                  We only use this to get in touch about the job.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * One question. On phones only the current step shows, with its question set large as the screen's heading; on
 * the wide layout every question shows, each with a smaller heading.
 */
function Question({
  step,
  current,
  legend,
  hint,
  children,
}: {
  step: number;
  current: number;
  legend: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset data-step={step} className={cx(step !== current && "max-md:hidden")}>
      <legend className="text-balance text-[1.75rem] font-medium leading-[1.12] tracking-[-0.035em] md:text-lg md:leading-snug md:tracking-[-0.01em]">
        {legend}
      </legend>
      {hint && <p className="mt-2 text-ink/70 md:text-sm">{hint}</p>}
      <div className="mt-6 md:mt-4">{children}</div>
    </fieldset>
  );
}

/**
 * Tap answers: real radio buttons or checkboxes under pill labels, so they work by keyboard and screen reader too.
 */
function Choices({
  name,
  type,
  options,
  selected,
  error,
  onToggle,
}: {
  name: string;
  type: "radio" | "checkbox";
  options: readonly string[];
  selected: string[];
  error?: string;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2" id={name}>
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <label
              key={option}
              className={cx(
                "inline-flex h-12 cursor-pointer items-center rounded-full px-5 text-[15px] font-medium ring-1 ring-inset transition-[background-color,color,box-shadow] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                on ? "bg-ink text-paper ring-ink" : "bg-paper ring-ink/15 hover:ring-ink/35",
                error && !on && "ring-2 ring-brand",
              )}
            >
              <input
                type={type}
                name={name}
                value={option}
                checked={on}
                onChange={() => onToggle(option)}
                aria-describedby={error ? errorId(name) : undefined}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId(name)} className="mt-3 flex items-start gap-2 text-sm font-medium">
          <span
            aria-hidden
            className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold leading-none text-paper"
          >
            !
          </span>
          {error}
        </p>
      )}
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
