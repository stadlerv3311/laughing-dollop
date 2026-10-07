"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { InteractiveHoverButton } from "@/components/ui";
import { cx } from "@/lib/cx";
import { submitQuote, type QuoteRequest } from "@/lib/forms";
import { quoteLink } from "@/lib/site";
import { usStates, type StateCode } from "@/lib/us-states";
import { cityForZip, stateForZip } from "@/lib/zip";

type Values = { pickup: string; delivery: string; date: string; name: string; contact: string };
const FIELDS = ["pickup", "delivery", "date", "name", "contact"] as const;
type FieldName = (typeof FIELDS)[number];
type Errors = Partial<Record<FieldName, string>>;

const emptyValues: Values = { pickup: "", delivery: "", date: "", name: "", contact: "" };
const OUTSIDE = "We run in the lower 48 only";
const stateName = (code: StateCode) => usStates.find((state) => state.code === code)?.name ?? code;

/** The lower-48 state a ZIP lights up, or null. */
function zipState(zip: string): StateCode | null {
  const state = stateForZip(zip);
  return state && state !== "outside" ? state : null;
}

/**
 * "City, ST" for the ZIP in a field, once it's all there and in the list (lib/zip.ts → cityForZip); null until then.
 * The list's file is asked for from the first digit, so the city is usually there with the fifth.
 */
function useZipCity(zip: string) {
  const [found, setFound] = useState<{ zip: string; city: string | null } | null>(null);
  useEffect(() => {
    if (!zip) return;
    let live = true;
    cityForZip(zip).then((city) => {
      if (live) setFound({ zip, city });
    });
    return () => {
      live = false;
    };
  }, [zip]);
  return found?.zip === zip ? found.city : null;
}

/** Today in the visitor's own time zone, as `YYYY-MM-DD`. */
function today() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** Which kind of contact was typed: an email, a US phone (10 digits, or 11 starting with 1), or neither. */
function contactKind(text: string): "email" | "phone" | null {
  const value = text.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))) return "phone";
  return null;
}

function zipError(zip: string, which: string) {
  if (!zip) return `Enter the ${which} ZIP`;
  if (zip.length < 5) return "Enter all 5 digits";
  const state = stateForZip(zip);
  if (state === "outside") return OUTSIDE;
  if (!state) return "Check the ZIP";
  return undefined;
}

function validate(values: Values): Errors {
  const errors: Errors = { pickup: zipError(values.pickup, "pickup"), delivery: zipError(values.delivery, "delivery") };
  if (!values.date) errors.date = "Pick a pickup date";
  else if (values.date < today()) errors.date = "Pick today or later";
  if (!values.name.trim()) errors.name = "Enter your name";
  if (!values.contact.trim()) errors.contact = "Enter a phone or email";
  else if (!contactKind(values.contact)) errors.contact = "Enter a 10-digit phone or an email";
  return errors;
}

function toRequest(values: Values): QuoteRequest {
  const kind = contactKind(values.contact);
  return {
    pickup: { zip: values.pickup, state: zipState(values.pickup)! },
    delivery: { zip: values.delivery, state: zipState(values.delivery)! },
    pickupDate: values.date,
    contact: {
      name: values.name.trim(),
      phone: kind === "phone" ? values.contact.trim() : undefined,
      email: kind === "email" ? values.contact.trim() : undefined,
    },
  };
}

/** "Wed, Oct 7" for the receipt. Parsed as a local date, so it never slips a day. */
function longDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

type Phase = "closed" | "opening" | "open" | "closing";
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; text: string } | { kind: "failed"; message: string };

type QuoteBarProps = {
  /** The states the two ZIPs are in, as they're typed, for the map. */
  /** The two states the ZIPs light, and each one's "City, ST" for its pin when the ZIP is in the list. */
  onStates: (pickup: StateCode | null, delivery: StateCode | null, pickupCity: string | null, deliveryCity: string | null) => void;
  /** The quote went through: the map plays the ride. */
  onSent: () => void;
  /** Goes up by one when a Get a quote link elsewhere on the site brings the visitor here: the form opens. */
  openRequest: number;
  /** The button has been pressed and the card is open (or opening or closing): the map stops its demo quotes. */
  onOpenChange?: (open: boolean) => void;
};

/**
 * Ship with us's quote (rebuilt 2026-10-02, owner, from the full-screen mock-ups). It starts as one big Get a quote
 * button; pressing it opens the button into the form — Pickup ZIP, Delivery ZIP, Pickup date, Name, Phone or email —
 * and the form sends from here. It's the site's only quote form: every Get a quote button opens it (lib/site.ts). Sent, the card narrows into a receipt that repeats the
 * trip back ("Thanks, Maria. 95610 (California) to 75201 (Texas), pickup Wed, Oct 7. We'll get back to you by phone
 * with a quote."), and Get another quote brings the form back with the trip cleared and the name and contact kept.
 *
 * The card is cloud, a step down from white (owner: pure white glared on the black). One row from 1400px wide; two
 * below that (the trip, then the person); stacked on phones. A ZIP's state shows next to its label, except in the one
 * row, where the map names it. Checked when Get a quote is pressed — except a ZIP in
 * Alaska or Hawaii, flagged as soon as it's typed — with the message in place of the cell's label and an orange ring.
 *
 * Escape closes it back into the button (owner, 2026-10-02); a click never does, inside the card or out (owner: a
 * stray click shouldn't fold away a half-typed quote). What was typed stays for next time, and the map lets go of the states until it opens again; a sent quote's
 * receipt goes, with the trip cleared as Get another quote does. Not while a quote is sending.
 *
 * Phone or email is one field (owner: "phone or email"); it's sent as `phone` or `email` (`lib/forms.ts`), whichever
 * it looks like. Sending goes through `submitQuote`, the stand-in until the backend teammate's endpoint exists.
 *
 * Until 2026-10-02 this was a three-field bar (Pickup, Delivery, Pickup date) that opened the quote page (`/quote`, now gone) with them filled in.
 */
export function QuoteBar({ onStates, onSent, openRequest, onOpenChange }: QuoteBarProps) {
  const baseId = useId();
  const id = (field: FieldName) => `${baseId}-${field}`;
  const still = useReducedMotion() ?? false;

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const againRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  // Set when the card closes with the cursor inside it, so the cursor goes to the button instead of the page.
  const refocus = useRef(false);
  const [phase, setPhase] = useState<Phase>("closed");
  const [height, setHeight] = useState<number>();
  const [formWidth, setFormWidth] = useState<number>();
  // Bumped each time the form appears, so its cells arrive in turn again.
  const [entrance, setEntrance] = useState(0);

  const [values, setValues] = useState<Values>(emptyValues);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const pickup = zipState(values.pickup);
  const delivery = zipState(values.delivery);
  // Closed, the map lets go of the states; they light again when it opens.
  const shown = phase !== "closed";
  const pickupCity = useZipCity(values.pickup);
  const deliveryCity = useZipCity(values.delivery);
  useEffect(
    () => onStates(shown ? pickup : null, shown ? delivery : null, pickupCity, deliveryCity),
    [shown, pickup, delivery, pickupCity, deliveryCity, onStates],
  );
  useEffect(() => onOpenChange?.(shown), [shown, onOpenChange]);

  // While it's closed or opening, the form is laid out at its open width (so it never reflows as the card grows).
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || phase === "open") return;
    const measure = () => setFormWidth(wrap.clientWidth - 16);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [phase]);

  function open() {
    const form = formRef.current;
    if (!form || phase !== "closed") return;
    setHeight(form.offsetHeight + 16);
    setEntrance((n) => n + 1);
    setPhase(still ? "open" : "opening");
  }

  // Sent here by a Get a quote link: open the form, or, if it's already open, put the cursor back in Pickup.
  useEffect(() => {
    if (!openRequest) return;
    if (phase === "closed") open();
    else if (phase === "open" && status.kind !== "sent") document.getElementById(id("pickup"))?.focus({ preventScroll: true });
    // Only a new request acts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRequest]);

  // Back into the button. The card's height is held where it is for a frame, so it can shrink from there.
  function close() {
    const card = cardRef.current;
    if (!card || phase !== "open" || status.kind === "sending") return;
    refocus.current = card.contains(document.activeElement);
    if (status.kind !== "idle") {
      if (status.kind === "sent") setValues((current) => ({ ...emptyValues, name: current.name, contact: current.contact }));
      setStatus({ kind: "idle" });
    }
    setShowErrors(false);
    setHeight(card.offsetHeight);
    setPhase(still ? "closed" : "closing");
  }

  // The held height is on screen (reading it makes the browser take it in), so letting go of it now animates.
  useLayoutEffect(() => {
    if (phase !== "closing") return;
    void cardRef.current?.offsetHeight;
    setHeight(undefined);
    setPhase("closed");
  }, [phase]);

  useEffect(() => {
    if (phase !== "closed" || !refocus.current) return;
    refocus.current = false;
    launchRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // Escape only.
  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // In case the card's transition never reports its end (a tab in the background, say).
  useEffect(() => {
    if (phase !== "opening") return;
    const timer = setTimeout(() => setPhase("open"), 900);
    return () => clearTimeout(timer);
  }, [phase]);

  // Opened: the card lets go of its fixed height, and the cursor goes to Pickup.
  useEffect(() => {
    if (phase !== "open") return;
    setHeight(undefined);
    setFormWidth(undefined);
    document.getElementById(id("pickup"))?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const allErrors = validate(values);
  const errors: Errors = showErrors
    ? allErrors
    : {
        pickup: allErrors.pickup === OUTSIDE ? OUTSIDE : undefined,
        delivery: allErrors.delivery === OUTSIDE ? OUTSIDE : undefined,
      };

  function setField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    setShowErrors(true);
    const first = FIELDS.find((field) => allErrors[field]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const result = await submitQuote(toRequest(values));
    if (!result.ok) {
      setStatus({ kind: "failed", message: result.message });
      return;
    }
    const by = contactKind(values.contact) === "email" ? "email" : "phone";
    setStatus({
      kind: "sent",
      text:
        `Thanks, ${values.name.trim().split(/\s+/)[0]}. ${values.pickup} (${pickupCity ?? stateName(pickup!)}) to ${values.delivery} ` +
        `(${deliveryCity ?? stateName(delivery!)}), pickup ${longDate(values.date)}. We’ll get back to you by ${by} with a quote.`,
    });
    onSent();
  }

  useEffect(() => {
    if (status.kind === "sent") againRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [status.kind]);

  // Another quote: the trip clears (and with it the map), the name and contact stay.
  function another() {
    setValues((current) => ({ ...emptyValues, name: current.name, contact: current.contact }));
    setShowErrors(false);
    setStatus({ kind: "idle" });
    setEntrance((n) => n + 1);
    requestAnimationFrame(() => document.getElementById(id("pickup"))?.focus({ preventScroll: true }));
  }

  const sent = status.kind === "sent";
  const closed = phase === "closed";
  /** The cells arrive in turn each time the form appears. */
  const animate = entrance > 0 && !still;
  const enter = animate ? "animate-ship-cell-in" : undefined;
  const delay = (index: number): CSSProperties | undefined => (animate ? { animationDelay: `${0.18 + index * 0.03}s` } : undefined);

  return (
    <div ref={wrapRef} className="flex w-full max-w-[75rem] flex-col items-center">
      <div
        ref={cardRef}
        data-phase={phase}
        className={cx(
          "relative w-full bg-cloud text-left text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]",
          !still && "transition-[max-width,height,padding,border-radius] duration-700 ease-premium",
          closed
            // The closed pill: 240 × 56px from `md`, 52px tall on phones (owner, 2026-10-05: "a bit smaller" twice —
            // it was 400 × 80 and 68px, then 288 × 64 and 56px).
            ? "h-13 max-w-full overflow-hidden rounded-full p-0 md:h-14 md:max-w-[15rem]"
            : cx("rounded-[1.75rem] p-2 md:rounded-[2rem] min-[87.5rem]:rounded-[2.25rem]", sent ? "md:max-w-[46rem]" : "max-w-[75rem]"),
          (phase === "opening" || phase === "closing") && "overflow-hidden",
        )}
        style={{ height }}
        onTransitionEnd={(event) => {
          if (event.target === cardRef.current && event.propertyName === "max-width" && phase === "opening") setPhase("open");
        }}
      >
        <button
          ref={launchRef}
          type="button"
          onClick={open}
          aria-expanded={!closed}
          aria-controls={`${baseId}-form`}
          tabIndex={closed ? 0 : -1}
          className={cx(
            "group/launch absolute inset-0 z-10 flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-cloud text-base font-semibold tracking-[-0.01em] text-ink md:text-[1.0625rem]",
            "outline-none duration-200",
            // Shown at once when the card closes (so the cursor can land on it), faded out when it opens.
            closed ? "transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]",
          )}
        >
          {/* The site's button move, at this size: the dot grows until it fills the button, and the label turns white. */}
          <span
            aria-hidden
            className="absolute top-1/2 left-[calc(50%-4.375rem)] size-2 -translate-y-1/2 rounded-full bg-ink transition-transform duration-500 ease-premium group-hover/launch:scale-[100] group-focus-visible/launch:scale-[100] motion-reduce:transition-none"
          />
          <span className="relative pl-5 transition-colors duration-300 group-hover/launch:text-paper group-focus-visible/launch:text-paper">
            {quoteLink.label}
          </span>
          {/* An orange line round the pill while it's hovered or focused (owner, 2026-10-06: the pill fills black on
              the black band, "lets add it an company orange outline. so it is more evident"). It's a box of its own
              inside the edge and over the fill: the growing dot covers an outline, and the card clips anything
              outside it, which is what hid the focus ring before. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-brand opacity-0 transition-opacity duration-300 group-hover/launch:opacity-100 group-focus-visible/launch:opacity-100 motion-reduce:transition-none"
          />
        </button>

        <form
          ref={formRef}
          id={`${baseId}-form`}
          noValidate
          aria-label="Get a quote"
          inert={closed || sent}
          onSubmit={handleSubmit}
          className={cx(
            "grid grid-cols-1 items-center md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1fr)] md:gap-y-1",
            "min-[87.5rem]:grid-cols-[minmax(0,.95fr)_auto_minmax(0,.95fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_minmax(0,1.45fr)_auto] min-[87.5rem]:gap-y-0",
            phase !== "open" && "absolute top-2 left-1/2 -translate-x-1/2",
            closed && "invisible opacity-0",
            // Sent: the receipt takes the card, the form steps out of the way.
            sent && "invisible absolute inset-x-2 top-2 opacity-0",
          )}
          style={phase !== "open" ? { width: formWidth } : undefined}
        >
          <Cell id={id("pickup")} label="Pickup" state={pickup} place={pickupCity} error={errors.pickup} icon="start" className={enter} style={delay(0)} key={`pickup-${entrance}`}>
            <input
              id={id("pickup")}
              name="pickup"
              value={values.pickup}
              onChange={(event) => setField("pickup", event.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="ZIP"
              aria-invalid={Boolean(errors.pickup)}
              aria-describedby={errors.pickup ? `${id("pickup")}-error` : undefined}
              className={inputClass}
            />
          </Cell>
          <span aria-hidden key={`badge-${entrance}`} style={delay(1)} className={cx("relative z-10 flex h-0 items-center justify-end pr-4 md:h-auto md:justify-center md:pr-0", enter)}>
            <span className="grid size-9 place-items-center rounded-full bg-cloud ring-1 ring-ink/12">
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-5 rotate-90 md:rotate-0">
                <path d="M2 6h15M13 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
          <Cell id={id("delivery")} label="Delivery" state={delivery} place={deliveryCity} error={errors.delivery} icon="end" className={enter} style={delay(2)} key={`delivery-${entrance}`}>
            <input
              id={id("delivery")}
              name="delivery"
              value={values.delivery}
              onChange={(event) => setField("delivery", event.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="ZIP"
              aria-invalid={Boolean(errors.delivery)}
              aria-describedby={errors.delivery ? `${id("delivery")}-error` : undefined}
              className={inputClass}
            />
          </Cell>
          <Cell id={id("date")} label="Pickup date" error={errors.date} icon="date" className={enter} style={delay(3)} key={`date-${entrance}`}>
            <input
              id={id("date")}
              name="date"
              type="date"
              min={today()}
              value={values.date}
              onChange={(event) => setField("date", event.target.value)}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? `${id("date")}-error` : undefined}
              className={cx(inputClass, !values.date && "text-ink/50")}
            />
          </Cell>
          <Cell id={id("name")} label="Name" error={errors.name} icon="person" style={delay(4)} key={`name-${entrance}`} className={cx("md:col-start-1 min-[87.5rem]:col-start-auto", enter)}>
            <input
              id={id("name")}
              name="name"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${id("name")}-error` : undefined}
              className={inputClass}
            />
          </Cell>
          <Cell
            id={id("contact")}
            label="Phone or email"
            error={errors.contact}
            icon="phone"
            style={delay(5)}
            key={`contact-${entrance}`}
            className={cx("md:col-span-2 min-[87.5rem]:col-span-1", enter)}
          >
            <input
              id={id("contact")}
              name="contact"
              value={values.contact}
              onChange={(event) => setField("contact", event.target.value)}
              placeholder="So we can reach you"
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? `${id("contact")}-error` : undefined}
              className={inputClass}
            />
          </Cell>
          <span key={`go-${entrance}`} style={delay(6)} className={cx("mt-1.5 md:mt-0 min-[87.5rem]:ml-1.5", enter)}>
            <InteractiveHoverButton
              type="submit"
              text={status.kind === "sending" ? "Sending" : quoteLink.label}
              aria-busy={status.kind === "sending"}
              size="lg"
              variant="ink"
              className="w-full min-[87.5rem]:w-52"
            />
          </span>
        </form>

        {/* The receipt, in the card the form leaves. */}
        <div
          role="status"
          className={cx(
            "flex flex-wrap items-center gap-5 p-4 md:flex-nowrap md:py-3 md:pr-3 md:pl-5",
            !still && "transition-[opacity,transform] duration-500 ease-premium",
            sent ? "opacity-100 delay-300" : "pointer-events-none invisible absolute inset-2 translate-y-2 opacity-0",
          )}
        >
          {sent && (
            <>
              <Tick still={still} />
              <div className="min-w-0 flex-1">
                <p className="text-xl font-semibold tracking-[-0.02em]">Quote request received</p>
                <p className="mt-1 text-[15px] leading-snug text-ink/70">{status.text}</p>
              </div>
              <div ref={againRef} className="w-full md:w-auto">
                <InteractiveHoverButton
                  type="button"
                  onClick={another}
                  text="Get another quote"
                  size="lgFit"
                  variant="ghostDark"
                  className="w-full md:w-auto"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {status.kind === "failed" && (
        <p role="alert" className="mt-4 text-paper/80">
          {status.message}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "mt-0.5 w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-ink/50 sm:text-[17px]";

/** One field: its mark, its name (or what to fix), the state a ZIP is in, and the input. The whole cell is the target. */
function Cell({
  id,
  label,
  state,
  place,
  error,
  icon,
  className,
  style,
  children,
}: {
  id: string;
  label: string;
  state?: StateCode | null;
  /** "City, ST" for the ZIP, shown in the state's place when the ZIP is in the list. */
  place?: string | null;
  error?: string;
  icon: "start" | "end" | "date" | "person" | "phone";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      style={style}
      className={cx(
        "flex min-w-0 cursor-text items-center gap-3 rounded-2xl px-4 py-3 transition-[background-color,box-shadow] duration-200 hover:bg-ink/[0.03] focus-within:bg-ink/[0.05] md:rounded-full md:px-5",
        error && "shadow-[inset_0_0_0_2px_var(--color-brand)]",
        className,
      )}
    >
      <FieldIcon icon={icon} />
      <span className="flex min-w-0 flex-1 flex-col">
        {error ? (
          <span id={`${id}-error`} className="text-sm font-medium">
            {error}
          </span>
        ) : (
          <span className="flex items-baseline gap-2 text-sm font-medium whitespace-nowrap">
            {label}
            {state && (
              <span className="truncate font-normal text-ink/70 min-[87.5rem]:hidden">{place ?? usStates.find((s) => s.code === state)?.name}</span>
            )}
          </span>
        )}
        {children}
      </span>
    </label>
  );
}

/** Each field's mark: a hollow dot where the load starts, a solid one where it ends (the map's pins), and the rest. */
function FieldIcon({ icon }: { icon: "start" | "end" | "date" | "person" | "phone" }) {
  const props = { "aria-hidden": true, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, className: "size-5 shrink-0" };
  if (icon === "start" || icon === "end")
    return (
      <svg {...props}>
        <circle cx="10" cy="10" r="5.25" fill={icon === "end" ? "currentColor" : "none"} />
      </svg>
    );
  if (icon === "date")
    return (
      <svg {...props}>
        <rect x="3" y="4.5" width="14" height="12" rx="2.5" />
        <path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" strokeLinecap="round" />
      </svg>
    );
  if (icon === "person")
    return (
      <svg {...props}>
        <circle cx="10" cy="7" r="3.2" />
        <path d="M3.8 16.5c.9-3 3.3-4.6 6.2-4.6s5.3 1.6 6.2 4.6" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg {...props}>
      <path
        d="M5.2 3.5h2.4l1.2 3.2-1.6 1.1a8.4 8.4 0 0 0 5 5l1.1-1.6 3.2 1.2v2.4c0 .8-.7 1.5-1.5 1.4A12.8 12.8 0 0 1 3.8 5c-.1-.8.6-1.5 1.4-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The receipt's tick: a ring, then the check, drawing themselves in. */
function Tick({ still }: { still: boolean }) {
  const [drawn, setDrawn] = useState(still);
  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), 450);
    return () => clearTimeout(timer);
  }, []);
  const draw = "transition-[stroke-dashoffset] ease-premium";
  return (
    <svg aria-hidden viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-11 shrink-0">
      <circle cx="22" cy="22" r="20" pathLength={1} strokeDasharray="1 1" className={cx(draw, "duration-600")} style={{ strokeDashoffset: drawn ? 0 : 1 }} />
      <path d="M14 22.5l5.5 5.5L30.5 17" pathLength={1} strokeDasharray="1 1" className={cx(draw, "delay-500 duration-350")} style={{ strokeDashoffset: drawn ? 0 : 1 }} />
    </svg>
  );
}
