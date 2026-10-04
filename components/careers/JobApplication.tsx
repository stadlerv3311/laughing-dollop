"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { InteractiveHoverButton, errorId } from "@/components/ui";
import { cx } from "@/lib/cx";
import { submitJobApplication } from "@/lib/forms";
import { applyRoutes, careersLink, driverSlogans, type Job } from "@/lib/site";

// The owner's eight driver questions (2026-09-25). Office and shop share the contact questions and one on
// experience — a draft until the owner says what else to ask them. The copy around the questions is draft too.
const CLASS_A = ["Yes", "Not yet"] as const;
const ENDORSEMENTS = ["Hazmat", "Tanker", "Doubles"] as const;
const NONE = "None";

const backClass = "font-medium text-paper/60 transition-colors hover:text-paper";

type Values = {
  job: Job;
  first: string;
  last: string;
  phone: string;
  email: string;
  zip: string;
  classA: string;
  years: string;
  endorsements: string[];
};
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type Status = { kind: "idle" | "sending" | "sent" } | { kind: "failed"; message: string };
type Step = "name" | "phone" | "email" | "zip" | "classA" | "years" | "endorsements";

const STEP_FIELDS: Record<Step, FieldName[]> = {
  name: ["first", "last"],
  phone: ["phone"],
  email: ["email"],
  zip: ["zip"],
  classA: ["classA"],
  years: ["years"],
  endorsements: ["endorsements"],
};

/**
 * Pictures that follow the questions (owner, 2026-10-01): the job's own photo unless a question has its own, so the
 * picture changes as you answer — you, how we reach you, your home on the road, your seat, the wheel, the road, then
 * the engine start button once it's sent. Wide images: `position` keeps the subject in the tall panel.
 * - phone, email: AI-generated stand-ins the owner made — never caption or present them as one of our drivers.
 * - sleeper, seat, wheel, road, sent: PLACEHOLDERS — Volvo Trucks' own marketing images (from the owner's "Driver
 *   application Pictures" folder). They must not go live without Volvo's written OK; swap in our own photos or
 *   stand-ins first (docs/DECISIONS.md). The road picture is only 700px wide, so it's soft.
 */
const STEP_IMAGES: Partial<Record<Job, Partial<Record<Step | "sent", { src: string; position: string }>>>> = {
  driver: {
    phone: { src: "/images/apply-driver-call.jpg", position: "64% center" },
    email: { src: "/images/apply-driver-email.jpg", position: "66% center" },
    zip: { src: "/images/apply-driver-sleeper.jpg", position: "60% center" },
    classA: { src: "/images/apply-driver-seat.jpg", position: "center 40%" },
    years: { src: "/images/apply-driver-wheel.jpg", position: "40% center" },
    endorsements: { src: "/images/apply-driver-road.jpg", position: "35% center" },
    sent: { src: "/images/apply-driver-start.jpg", position: "45% center" },
  },
};

/**
 * The contact questions first (so HR can reach anyone who stops partway), then the job's own. No "Which job?" since
 * 2026-10-01 (owner): every way in comes from a job's own Apply now on the careers page, so the job is already known.
 * No driver's license step either since the same day (owner): asking for a license number needs a terms of service
 * and privacy page first; HR can take it on the call back.
 */
function stepsFor(job: Job): Step[] {
  const start: Step[] = ["name", "phone", "email", "zip"];
  return job === "driver" ? [...start, "classA", "years", "endorsements"] : [...start, "years"];
}

const empty = (job: Job): Values => ({
  job,
  first: "",
  last: "",
  phone: "",
  email: "",
  zip: "",
  classA: "",
  years: "",
  endorsements: [],
});

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.first.trim()) errors.first = "Enter your first name.";
  if (!values.last.trim()) errors.last = "Enter your last name.";
  if (values.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a phone number with area code.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter an email address.";
  if (!/^\d{5}$/.test(values.zip.trim())) errors.zip = "Enter a 5-digit ZIP code.";
  if (!/^\d{1,2}$/.test(values.years.trim())) errors.years = "Enter a number of years — 0 is fine.";
  if (values.job === "driver") {
    if (!values.classA) errors.classA = "Choose one.";
    if (values.endorsements.length === 0) errors.endorsements = "Choose any that apply, or None.";
  }
  return errors;
}

/** Underlined, borderless text box on ink — the question is the label, so the box itself stays quiet. */
const lineClass =
  "w-full rounded-none border-0 border-b border-paper/30 bg-transparent pb-3 pt-2 text-[1.625rem] tracking-[-0.02em] text-paper outline-none transition-colors duration-200 placeholder:text-paper/30 hover:border-paper/50 focus:border-paper aria-[invalid=true]:border-brand sm:text-[2rem]";

/**
 * The job application (2026-09-25). The owner chose the "dark split" from a second mock-up after a Mobbin pass
 * (Open, incident.io): the first build, a white page with every question on one form beside a rounded photo,
 * looked fine but not premium; a full-screen photo version was liked but judged too flashy for drivers.
 *
 * Half the screen is the picked job's photo, bled to the edges; the other half is ink, with one question at a time
 * set large under a thin progress line — on every screen size, so phones and desktops get the same flow. Tap
 * answers move on by themselves, Enter moves on from a typed answer, and the number keys pick an answer. On phones
 * the photo becomes a band across the top. One application for all three jobs, opened on the job whose Apply now
 * brought you here (the page's URL says which): its photo, its title over the progress line, and its own questions —
 * the "Which job?" step that opened it came out on 2026-10-01 (owner), since the job was always picked already. To
 * apply for another job, Back on the first question returns to the careers page. Sends through
 * `submitJobApplication`, a stub until the backend exists.
 */
export function JobApplication({ initialJob }: { initialJob: Job }) {
  const baseId = useId();
  const id = (field: FieldName) => `${baseId}-${field}`;
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  const [values, setValues] = useState<Values>(() => empty(initialJob));
  const [at, setAt] = useState(0);
  // Fields whose errors are on show — a step's, once Continue was pressed on it.
  const [shown, setShown] = useState<FieldName[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const panelRef = useRef<HTMLDivElement>(null);

  const steps = stepsFor(values.job);
  const step = steps[at];
  const last = at === steps.length - 1;
  const allErrors = validate(values);
  const errors: Errors = Object.fromEntries(shown.map((field) => [field, allErrors[field]]));
  const driver = values.job === "driver";
  const route = applyRoutes.find((item) => item.job === values.job) ?? applyRoutes[0];
  const stepImages = STEP_IMAGES[values.job] ?? {};
  // The question's own picture while it's on screen, the "sent" one after; the job's photo where there's none.
  const stepImage = status.kind === "sent" ? stepImages.sent : stepImages[step];
  const sent = status.kind === "sent";

  const set = (field: Exclude<FieldName, "endorsements" | "job">, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  // Each new step: back to the top on phones (the question sits under the photo band), and the cursor in its
  // first box if it has one.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    if (!window.matchMedia("(min-width: 48rem)").matches) lenis?.scrollTo(0, { immediate: true, force: true });
    panelRef.current
      ?.querySelector<HTMLElement>("input:not([type=radio]):not([type=checkbox]), select")
      ?.focus({ preventScroll: true });
    // Only when the step changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at, sent]);

  // A tapped single answer moves straight on, after a beat so the pick shows.
  const pickAndGo = (apply: () => void) => {
    apply();
    setTimeout(() => setAt((current) => current + 1), 220);
  };

  // Number keys pick answers on the steps that have them (not while typing).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (target instanceof Element && target.closest("input, select, textarea")) return;
      const n = Number(event.key);
      if (!n) return;
      panelRef.current?.querySelectorAll<HTMLInputElement>("[data-choice] input")[n - 1]?.click();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send() {
    setStatus({ kind: "sending" });
    const result = await submitJobApplication({
      job: values.job,
      firstName: values.first.trim(),
      lastName: values.last.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      zip: values.zip.trim(),
      yearsExperience: Number(values.years.trim()),
      driver: driver
        ? {
            hasClassA: values.classA === "Yes",
            endorsements: values.endorsements.filter((endorsement) => endorsement !== NONE),
          }
        : undefined,
    });
    setStatus(result.ok ? { kind: "sent" } : { kind: "failed", message: result.message });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const here = STEP_FIELDS[step];
    setShown((current) => [...new Set([...current, ...here])]);
    const firstInvalid = here.find((field) => allErrors[field]);
    if (firstInvalid) {
      const el = document.getElementById(id(firstInvalid));
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement ? el : el?.querySelector("input"))?.focus();
      return;
    }
    if (last) void send();
    else setAt(at + 1);
  }

  function toggleEndorsement(value: string) {
    setValues((current) => {
      const on = current.endorsements.includes(value);
      let list = on ? current.endorsements.filter((item) => item !== value) : [...current.endorsements, value];
      if (!on) list = value === NONE ? [NONE] : list.filter((item) => item !== NONE);
      return { ...current, endorsements: list };
    });
  }

  const slogan = driverSlogans[0];

  return (
    // Dark all the way down, so the header goes light over it.
    <section data-header-theme="dark" className="grid min-h-svh bg-ink text-paper md:grid-cols-2">
      {/* The picked job's photo — all three stacked, cross-fading. A band on phones; the left half, pinned, from `md`. */}
      <div className="relative h-[36svh] overflow-hidden md:sticky md:top-0 md:h-svh">
        {applyRoutes.map((item) => (
          <Image
            key={item.job}
            src={item.image.src}
            alt={item.job === values.job ? item.image.alt : ""}
            aria-hidden={item.job !== values.job}
            fill
            priority={item.job === initialJob}
            sizes="(width >= 48rem) 50vw, 100vw"
            className={cx(
              "object-cover transition-opacity duration-700 ease-premium",
              item.job === values.job && !stepImage ? "opacity-100" : "opacity-0",
            )}
            style={item.image.position ? { objectPosition: item.image.position } : undefined}
          />
        ))}
        {/* The job's question pictures, over its photo, each showing while its question is on screen. */}
        {Object.entries(stepImages).map(([key, image]) => (
          <Image
            key={key}
            src={image.src}
            alt=""
            aria-hidden
            fill
            sizes="(width >= 48rem) 50vw, 100vw"
            className={cx(
              "object-cover transition-opacity duration-700 ease-premium",
              stepImage === image ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition: image.position }}
          />
        ))}
        {/* A little shade under the header, and a rise from the bottom under the owner's line. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(12_12_12/.45),rgb(12_12_12/0)_28%),linear-gradient(to_top,rgb(12_12_12/.55),rgb(12_12_12/0)_42%)]"
        />
        {/* The owner's line is a driver's line, so it shows on the driver's own photo only, not the question pictures. */}
        <p
          aria-hidden={!driver || Boolean(stepImage)}
          className={cx(
            "absolute inset-x-5 bottom-5 max-w-[20ch] text-balance text-lg font-medium leading-snug tracking-[-0.02em] transition-opacity duration-500 sm:text-2xl md:inset-x-10 md:bottom-10",
            driver && !stepImage ? "opacity-100" : "opacity-0",
          )}
        >
          {slogan.lead} <span className="text-paper/60">{slogan.tail}</span>
        </p>
      </div>

      <div
        ref={panelRef}
        className="flex flex-col justify-center px-5 pb-20 pt-10 sm:px-8 md:px-[clamp(2rem,5vw,5.5rem)] md:py-32"
      >
        <h1 className="sr-only">Apply for a job at ITrucking Solutions</h1>
        <div className="w-full max-w-[34rem]">
          {sent ? (
            <Appear key="sent" still={reduceMotion}>
              <div role="status">
                <p className="text-sm text-paper/60">Sent</p>
                <h2 className="mt-5 text-[2.5rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[3.25rem]">
                  Thanks, {values.first.trim()}.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-paper/60">
                  HR will call you back on {values.phone.trim()}. There&rsquo;s nothing else to do.
                </p>
              </div>
            </Appear>
          ) : (
            <>
              {/* The job this is for, since nothing asks any more — set at the sub-heading size (owner, 2026-10-01: it's
                  important), a clear step under the question. */}
              <p className="mb-8 sm:mb-10">
                <span className="block text-sm text-paper/70">Applying for</span>
                <span className="mt-1 block text-[1.5rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.75rem]">
                  {route.title}
                </span>
              </p>
              {/* Where you are. */}
              <div className="h-0.5 overflow-hidden rounded-full bg-paper/15">
                <div
                  className="h-full bg-paper transition-[width] duration-700 ease-premium"
                  style={{ width: `${(at / steps.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-sm tabular-nums text-paper/60">
                <span>
                  {at + 1} / {steps.length}
                </span>
                <span>{driver ? "About two minutes" : "About a minute"}</span>
              </div>

              <form noValidate onSubmit={handleSubmit} className="mt-10 sm:mt-14">
                <Appear key={step} still={reduceMotion}>
                  {step === "name" && (
                    <Question legend="What’s your name?">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Line id={id("first")} label="First name" error={errors.first}>
                          <input
                            {...lineProps(id("first"), errors.first)}
                            placeholder="First name"
                            autoComplete="given-name"
                            value={values.first}
                            onChange={(event) => set("first", event.target.value)}
                          />
                        </Line>
                        <Line id={id("last")} label="Last name" error={errors.last}>
                          <input
                            {...lineProps(id("last"), errors.last)}
                            placeholder="Last name"
                            autoComplete="family-name"
                            value={values.last}
                            onChange={(event) => set("last", event.target.value)}
                          />
                        </Line>
                      </div>
                    </Question>
                  )}

                  {step === "phone" && (
                    <Question legend="What number should HR call?">
                      <Line id={id("phone")} label="Phone" error={errors.phone}>
                        <input
                          {...lineProps(id("phone"), errors.phone)}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="(555) 555-0123"
                          value={values.phone}
                          onChange={(event) => set("phone", event.target.value)}
                        />
                      </Line>
                    </Question>
                  )}

                  {step === "email" && (
                    <Question legend="And your email?">
                      <Line id={id("email")} label="Email" error={errors.email}>
                        <input
                          {...lineProps(id("email"), errors.email)}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="you@email.com"
                          value={values.email}
                          onChange={(event) => set("email", event.target.value)}
                        />
                      </Line>
                    </Question>
                  )}

                  {step === "zip" && (
                    <Question
                      legend="Where do you live?"
                      hint={driver ? "Your ZIP code, so we know which lanes get you home." : "Your ZIP code."}
                    >
                      <Line id={id("zip")} label="ZIP code" error={errors.zip} className="max-w-56">
                        <input
                          {...lineProps(id("zip"), errors.zip)}
                          inputMode="numeric"
                          autoComplete="postal-code"
                          maxLength={5}
                          placeholder="95610"
                          value={values.zip}
                          onChange={(event) => set("zip", event.target.value)}
                        />
                      </Line>
                    </Question>
                  )}

                  {step === "classA" && (
                    <Question legend="Do you have a Class A CDL?">
                      <Options
                        name={id("classA")}
                        type="radio"
                        options={CLASS_A}
                        selected={[values.classA]}
                        error={errors.classA}
                        onToggle={(value) => pickAndGo(() => set("classA", value))}
                      />
                    </Question>
                  )}

                  {step === "years" && (
                    <Question
                      legend={driver ? "How many years have you driven Class A?" : "How many years have you done this kind of work?"}
                      hint="0 is fine."
                    >
                      <Line id={id("years")} label="Years" error={errors.years} className="max-w-40">
                        <input
                          {...lineProps(id("years"), errors.years)}
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="0"
                          value={values.years}
                          onChange={(event) => set("years", event.target.value)}
                        />
                      </Line>
                    </Question>
                  )}

                  {step === "endorsements" && (
                    <Question legend="Any endorsements?" hint="Check all that apply.">
                      <Options
                        name={id("endorsements")}
                        type="checkbox"
                        options={[...ENDORSEMENTS, NONE]}
                        selected={values.endorsements}
                        error={errors.endorsements}
                        onToggle={toggleEndorsement}
                      />
                    </Question>
                  )}
                </Appear>

                <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <InteractiveHoverButton
                    type="submit"
                    text={status.kind === "sending" ? "Sending…" : last ? "Send application" : "Continue"}
                    size="lg"
                    variant="solid"
                    disabled={status.kind === "sending"}
                    className="w-full border-transparent sm:w-56"
                  />
                  {/* Back from the first question goes back to the careers page, where Apply now came from. */}
                  {at > 0 ? (
                    <button type="button" onClick={() => setAt(at - 1)} className={backClass}>
                      Back
                    </button>
                  ) : (
                    <Link href={careersLink.href} className={backClass}>
                      Back
                    </Link>
                  )}
                  <span aria-hidden className="text-sm text-paper/40 max-md:hidden">
                    or press Enter ↵
                  </span>
                </div>
                {status.kind === "failed" && (
                  <p role="alert" className="mt-5 font-medium">
                    {status.message}
                  </p>
                )}
                {last && <p className="mt-5 text-sm text-paper/50">We only use this to get in touch about the job.</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/** Each step rises in as it arrives; reduced-motion visitors just get the new step. */
function Appear({ still, children }: { still: boolean | null; children: ReactNode }) {
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** One question, set large as the step's heading. */
function Question({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-balance text-[2.25rem] font-medium leading-[1.04] tracking-[-0.045em] sm:text-[3rem]">
        {legend}
      </legend>
      {hint && <p className="mt-3 text-lg text-paper/60">{hint}</p>}
      <div className="mt-9">{children}</div>
    </fieldset>
  );
}

/** A labelled underline box. The label is for screen readers; the placeholder and the question say it on screen. */
function Line({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
      {error && <ErrorText id={errorId(id)}>{error}</ErrorText>}
    </div>
  );
}

function lineProps(id: string, error: string | undefined) {
  return {
    id,
    className: lineClass,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId(id) : undefined,
  };
}

/** Tap answers as full-width rows with their number key; radio buttons or checkboxes underneath. */
function Options({
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
      <div data-choice id={name} className="grid gap-2.5">
        {options.map((option, i) => {
          const on = selected.includes(option);
          return (
            <label
              key={option}
              className={cx(
                "flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4 text-lg font-medium tracking-[-0.01em] ring-1 ring-inset transition-[background-color,color,box-shadow] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                on ? "bg-paper text-ink ring-paper" : "ring-paper/20 hover:ring-paper/60",
                error && !on && "ring-brand",
              )}
            >
              <input
                type={type}
                name={name}
                value={option}
                checked={on}
                // Single answers listen for a click, so tapping the one already picked still moves on.
                readOnly={type === "radio"}
                onClick={type === "radio" ? () => onToggle(option) : undefined}
                onChange={type === "checkbox" ? () => onToggle(option) : undefined}
                aria-describedby={error ? errorId(name) : undefined}
                className="sr-only"
              />
              {option}
              <kbd
                aria-hidden
                className={cx(
                  "rounded-md px-1.5 font-sans text-xs ring-1 max-md:hidden",
                  on ? "text-ink/50 ring-ink/20" : "text-paper/40 ring-paper/20",
                )}
              >
                {i + 1}
              </kbd>
            </label>
          );
        })}
      </div>
      {error && <ErrorText id={errorId(name)}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-3 flex items-start gap-2 text-sm font-medium">
      <span
        aria-hidden
        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold leading-none text-paper"
      >
        !
      </span>
      {children}
    </p>
  );
}
