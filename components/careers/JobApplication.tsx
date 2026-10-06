"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { InteractiveHoverButton, errorId } from "@/components/ui";
import { cx } from "@/lib/cx";
import { submitJobApplication } from "@/lib/forms";
import { applyRoutes, careersLink, driverSlogans, site, type Job } from "@/lib/site";

// The owner's question order (2026-10-05): the four contact questions, then the job, then the job's own — a Class A
// CDL and, with one, the years for drivers; the years for office and shop. The copy around the questions is draft.
const CLASS_A = ["Yes", "Not yet"] as const;
const HAS_CDL = CLASS_A[0];

const backClass = "font-medium text-paper/60 transition-colors hover:text-paper";

const EASE = [0.22, 1, 0.36, 1] as const;

type Values = {
  job: Job;
  first: string;
  last: string;
  phone: string;
  email: string;
  zip: string;
  classA: string;
  years: string;
};
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type Status = { kind: "idle" | "sending" | "sent" } | { kind: "failed"; message: string };
type Step = "name" | "phone" | "email" | "zip" | "job" | "classA" | "years";

const STEP_FIELDS: Record<Step, FieldName[]> = {
  name: ["first", "last"],
  phone: ["phone"],
  email: ["email"],
  zip: ["zip"],
  job: ["job"],
  classA: ["classA"],
  years: ["years"],
};

/**
 * Pictures that follow the questions (owner, 2026-10-01): the job's own photo unless a question has its own, so the
 * picture changes as you answer — you, how we reach you, your home on the road, your seat, the wheel, then the engine
 * start button once it's sent (the road went with the endorsements question, 2026-10-05). They only show once the job
 * is known, so someone who came in through "Which job?" sees the docks behind the contact questions. Wide images: `position` keeps the subject in the tall panel.
 * - phone, email: AI-generated stand-ins the owner made — never caption or present them as one of our drivers.
 * - sleeper, seat, wheel, sent: PLACEHOLDERS — Volvo Trucks' own marketing images (from the owner's "Driver
 *   application Pictures" folder). They must not go live without Volvo's written OK; swap in our own photos or
 *   stand-ins first (docs/DECISIONS.md).
 */
const STEP_IMAGES: Partial<Record<Job, Partial<Record<Step | "sent", { src: string; position: string }>>>> = {
  driver: {
    phone: { src: "/images/apply-driver-call.jpg", position: "64% center" },
    email: { src: "/images/apply-driver-email.jpg", position: "66% center" },
    zip: { src: "/images/apply-driver-sleeper.jpg", position: "60% center" },
    classA: { src: "/images/apply-driver-seat.jpg", position: "center 40%" },
    years: { src: "/images/apply-driver-wheel.jpg", position: "40% center" },
    sent: { src: "/images/apply-driver-start.jpg", position: "45% center" },
  },
};

/**
 * The picture until a job is picked, where the application asks which (owner, 2026-10-05: "i need something that
 * will mean trucking business", then supplied this one): a yard of loading docks, so it stands for the company and not
 * for one of the three jobs, whose portraits are the answers beside it. Symmetric, so the tall half and the phone band
 * both crop it from the middle. The owner's file; where it came from isn't confirmed, and it is not our yard — never
 * caption it as ours (docs/DECISIONS.md).
 */
const DEFAULT_IMAGE = { src: "/images/apply-docks.jpg", position: "center" };

/**
 * The owner's order (2026-10-05): the contact questions first, whatever the job (so HR can reach anyone who stops
 * partway), then "Which job?" where it isn't known yet (`asked`), then the job's own questions. Drivers: a Class A CDL,
 * and how many years only with one — "Not yet" ends the application there. Office and shop: how many years. Until the
 * CDL question is answered the count allows for the years, so it can only get shorter.
 *
 * "Which job?" opened the application until 2026-10-01 (owner: a job's own Apply now on the careers page shouldn't ask
 * again), was gone until 2026-10-05, and came back as the fifth question when the site's Apply now buttons started
 * opening the application directly. No endorsements question since 2026-10-05 (owner), and no driver's license step
 * since 2026-10-01 (owner): asking for a license number needs a terms of service and privacy page first; HR can take
 * both on the call back.
 */
function stepsFor(values: Values, asked: boolean): Step[] {
  const start: Step[] = asked ? ["name", "phone", "email", "zip", "job"] : ["name", "phone", "email", "zip"];
  if (values.job !== "driver") return [...start, "years"];
  return values.classA === CLASS_A[1] ? [...start, "classA"] : [...start, "classA", "years"];
}

/** Years are asked of office and shop, and of drivers who have the CDL. */
const asksYears = (values: Values) => values.job !== "driver" || values.classA === HAS_CDL;

const empty = (job: Job): Values => ({
  job,
  first: "",
  last: "",
  phone: "",
  email: "",
  zip: "",
  classA: "",
  years: "",
});

function validate(values: Values, picked: boolean): Errors {
  const errors: Errors = {};
  if (!picked) errors.job = "Choose one.";
  if (!values.first.trim()) errors.first = "Enter your first name.";
  if (!values.last.trim()) errors.last = "Enter your last name.";
  if (values.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a phone number with area code.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter an email address.";
  if (!/^\d{5}$/.test(values.zip.trim())) errors.zip = "Enter a 5-digit ZIP code.";
  if (asksYears(values) && !/^\d{1,2}$/.test(values.years.trim())) errors.years = "Enter a number of years — 0 is fine.";
  if (values.job === "driver" && !values.classA) errors.classA = "Choose one.";
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
 * the photo becomes a band across the top. One application for all three jobs. Opened from a job's own Apply now on
 * the careers page (`initialJob`, from the page's URL), it starts on that job: its photo, its title over the progress
 * line, and its own questions after the contact ones. Opened from any other Apply now (no `initialJob`), the contact
 * questions come over a picture of loading docks and the company's name, then "Which job?" — three photo cards — and
 * the photo, the title and the questions follow the pick. Back on the first question returns to the careers page,
 * where the jobs are described. Sends through `submitJobApplication`, a stub until the backend exists.
 */
export function JobApplication({ initialJob }: { initialJob?: Job }) {
  const baseId = useId();
  const id = (field: FieldName) => `${baseId}-${field}`;
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  // No job in the URL: the application asks, and shows the docks (DEFAULT_IMAGE) until there's an answer.
  const asked = initialJob === undefined;
  const [values, setValues] = useState<Values>(() => empty(initialJob ?? "driver"));
  const [picked, setPicked] = useState(!asked);
  const [at, setAt] = useState(0);
  // Fields whose errors are on show — a step's, once Continue was pressed on it.
  const [shown, setShown] = useState<FieldName[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Where the Send application pill sat when it was pressed, so the thank-you screen's tick can start from it.
  const [sentFrom, setSentFrom] = useState<DOMRect | null>(null);
  // The tick has turned into the T of Thanks, so the rest can come in.
  const [ticked, setTicked] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const steps = stepsFor(values, asked);
  const step = steps[at];
  const last = at === steps.length - 1;
  const allErrors = validate(values, picked);
  const errors: Errors = Object.fromEntries(shown.map((field) => [field, allErrors[field]]));
  const driver = values.job === "driver";
  const onJob = step === "job";
  const route = applyRoutes.find((item) => item.job === values.job) ?? applyRoutes[0];
  const stepImages = (picked && STEP_IMAGES[values.job]) || {};
  // The question's own picture while it's on screen, the "sent" one after; the job's photo where there's none.
  const stepImage = status.kind === "sent" ? stepImages.sent : stepImages[step];
  const sent = status.kind === "sent";
  // The thanks shows once the tick has become its T — or at once where nothing animates.
  const thanked = ticked || !sentFrom || Boolean(reduceMotion);

  const set = (field: Exclude<FieldName, "job">, value: string) =>
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

  // A tapped single answer moves straight on, after a beat so the pick shows — unless it ends the questions (a
  // driver's "Not yet"), where Send application is the next press.
  const pickAndGo = (apply: () => void, go = true) => {
    apply();
    if (go) setTimeout(() => setAt((current) => current + 1), 220);
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

  // A new application, from the first question: the thank-you screen's own link, and Apply now pressed on that screen.
  const restart = useCallback(() => {
    setValues(empty(initialJob ?? "driver"));
    setPicked(!asked);
    setShown([]);
    setAt(0);
    setStatus({ kind: "idle" });
    setSentFrom(null);
    setTicked(false);
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [asked, initialJob, lenis]);

  // Once it's sent, a link to this same page — Apply now, in the header, the phone menu or the footer — starts a new
  // application on the first question (owner, 2026-10-05). By itself a link to the page you're on does nothing. Only
  // after sending, so a press mid-way never wipes answers.
  useEffect(() => {
    if (!sent) return;
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.origin !== location.origin || link.pathname !== location.pathname || link.search !== location.search) return;
      restart();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sent, restart]);

  async function send() {
    setSentFrom(panelRef.current?.querySelector("button[type=submit]")?.getBoundingClientRect() ?? null);
    setStatus({ kind: "sending" });
    const result = await submitJobApplication({
      job: values.job,
      firstName: values.first.trim(),
      lastName: values.last.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      zip: values.zip.trim(),
      yearsExperience: asksYears(values) ? Number(values.years.trim()) : undefined,
      driver: driver ? { hasClassA: values.classA === HAS_CDL } : undefined,
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

  const slogan = driverSlogans[0];

  return (
    // Dark all the way down, so the header goes light over it.
    <section data-header-theme="dark" className="grid min-h-svh bg-ink text-paper md:grid-cols-2">
      {/* The picked job's photo — all three stacked, cross-fading. A band on phones; the left half, pinned, from `md`. */}
      <div className="relative h-[36svh] overflow-hidden md:sticky md:top-0 md:h-svh">
        {/* Under them, where the application asks which job: the docks, until one is picked. */}
        {asked && (
          <Image
            src={DEFAULT_IMAGE.src}
            alt=""
            aria-hidden
            fill
            priority
            sizes="(width >= 48rem) 50vw, 100vw"
            className={cx("object-cover transition-opacity duration-700 ease-premium", picked ? "opacity-0" : "opacity-100")}
            style={{ objectPosition: DEFAULT_IMAGE.position }}
          />
        )}
        {applyRoutes.map((item) => (
          <Image
            key={item.job}
            src={item.image.src}
            alt={picked && item.job === values.job ? item.image.alt : ""}
            aria-hidden={!picked || item.job !== values.job}
            fill
            priority={item.job === initialJob}
            sizes="(width >= 48rem) 50vw, 100vw"
            className={cx(
              "object-cover transition-opacity duration-700 ease-premium",
              picked && item.job === values.job && !stepImage ? "opacity-100" : "opacity-0",
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
        {/* The owner's line is a driver's line, so it shows on the driver's own photo only, once that's the job picked,
            and not on the question pictures. */}
        <p
          aria-hidden={!driver || !picked || Boolean(stepImage)}
          className={cx(
            "absolute inset-x-5 bottom-5 max-w-[20ch] text-balance font-display font-semibold text-lg leading-snug tracking-[-0.03em] transition-opacity duration-500 sm:text-2xl md:inset-x-10 md:bottom-10",
            driver && picked && !stepImage ? "opacity-100" : "opacity-0",
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
            // Sending… turns into a tick where the T of Thanks belongs, the tick turns into that T, and the rest of
            // the thanks follows (owner, 2026-10-05). The heading is two pieces so the T can wait for its tick; the
            // label keeps it one phrase for screen readers.
            <div role="status">
              <p className="sr-only">Sent.</p>
              <h2
                aria-label={`Thanks, ${values.first.trim()}.`}
                className="font-display font-semibold text-[2.5rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.25rem]"
              >
                <span aria-hidden className="relative">
                  <span className={cx("transition-opacity duration-150", thanked ? "opacity-100" : "opacity-0")}>T</span>
                  {sentFrom && !reduceMotion && <SentMark from={sentFrom} onDone={() => setTicked(true)} />}
                </span>
                <motion.span
                  aria-hidden
                  initial={thanked ? false : { opacity: 0 }}
                  animate={{ opacity: thanked ? 1 : 0 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                >
                  hanks, {values.first.trim()}.
                </motion.span>
              </h2>
              <motion.p
                initial={thanked ? false : { opacity: 0, y: 18 }}
                animate={thanked ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.55, delay: 0.25, ease: EASE }}
                className="mt-4 text-lg leading-relaxed text-paper/60"
              >
                HR will call you back on {values.phone.trim()}. There&rsquo;s nothing else to do.
              </motion.p>
              {/* For the next person on the same phone or computer, or a second job (owner, 2026-10-05). Quiet, since
                  nothing more is asked of the one who just applied. */}
              <motion.p
                initial={thanked ? false : { opacity: 0 }}
                animate={{ opacity: thanked ? 1 : 0 }}
                transition={{ duration: 0.55, delay: 0.5 }}
                className="mt-9"
              >
                <button
                  type="button"
                  onClick={restart}
                  className="font-medium text-paper/70 underline decoration-paper/30 underline-offset-[6px] transition-colors hover:text-paper hover:decoration-paper"
                >
                  Start a new application
                </button>
              </motion.p>
            </div>
          ) : (
            <>
              {/* The job this is for — set at the sub-heading size (owner, 2026-10-01: it's important), a clear step
                  under the question. Until a job is picked, and while "Which job?" is the question, it names the
                  company instead, so the first screen still says what is being applied for. */}
              <p className="mb-8 sm:mb-10">
                <span className="block text-sm text-paper/70">{picked && !onJob ? "Applying for" : "Applying at"}</span>
                <span className="mt-1 block font-display font-semibold text-[1.5rem] leading-tight tracking-[-0.03em] sm:text-[1.75rem]">
                  {picked && !onJob ? route.title : site.name}
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
                <span>About a minute</span>
              </div>

              <form noValidate onSubmit={handleSubmit} className="mt-10 sm:mt-14">
                <Appear key={step} still={reduceMotion}>
                  {onJob && (
                    <Question legend="Which job?">
                      <div data-choice id={id("job")} className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        {applyRoutes.map((item) => {
                          const on = picked && item.job === values.job;
                          return (
                            <label
                              key={item.job}
                              className={cx(
                                "group relative aspect-3/4 cursor-pointer overflow-hidden rounded-2xl bg-paper/10 outline-offset-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                                on ? "ring-2 ring-paper" : errors.job ? "ring-1 ring-brand" : "ring-1 ring-paper/15",
                              )}
                            >
                              <input
                                type="radio"
                                name={id("job")}
                                value={item.job}
                                checked={on}
                                readOnly
                                // A click, not a change, so tapping the job that's already picked also moves on.
                                onClick={() =>
                                  pickAndGo(() => {
                                    setValues((current) => ({ ...current, job: item.job }));
                                    setPicked(true);
                                  })
                                }
                                aria-describedby={errors.job ? errorId(id("job")) : undefined}
                                className="sr-only"
                              />
                              <Image
                                src={item.image.src}
                                alt=""
                                fill
                                sizes="12rem"
                                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
                                style={item.image.position ? { objectPosition: item.image.position } : undefined}
                              />
                              <span
                                aria-hidden
                                className="absolute inset-0 bg-[linear-gradient(to_top,rgb(12_12_12/.7),rgb(12_12_12/0)_55%)]"
                              />
                              <span className="absolute inset-x-3 bottom-3 text-sm font-medium leading-tight tracking-[-0.01em] sm:inset-x-4 sm:bottom-3.5 sm:text-base">
                                {item.role}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.job && <ErrorText id={errorId(id("job"))}>{errors.job}</ErrorText>}
                    </Question>
                  )}

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
                      hint={driver && picked ? "Your ZIP code, so we know which lanes get you home." : "Your ZIP code."}
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
                        options={CLASS_A}
                        selected={[values.classA]}
                        error={errors.classA}
                        onToggle={(value) => pickAndGo(() => set("classA", value), value === HAS_CDL)}
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

                </Appear>

                <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <InteractiveHoverButton
                    type="submit"
                    text={status.kind === "sending" ? "Sending…" : last ? "Send application" : "Continue"}
                    size="lg"
                    variant="solid"
                    disabled={status.kind === "sending"}
                    // Wide enough for "Send application" to clear the pill's dot, which sits a fifth of the way in
                    // (at 14rem the dot touched the S), and the same on every step so Back never shifts.
                    className="w-full border-transparent sm:w-[17rem]"
                  />
                  {/* Back from the first question goes to the careers page, where the three jobs are described. */}
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

// The T of "Thanks" in the headline face (Archivo semibold at 115% width), in thousandths of an em: measured from the
// glyph on a canvas at 112.5% and 125% width and read off at 115%. Re-measure if the headline face, weight or width
// changes. `x` is the middle of its ink from the letter's left edge, `y` the middle of its cap height from the top of
// the letter's inline box.
const T_GLYPH = { x: 368, y: 534, width: 686.5, height: 687.5, bar: 127, stem: 144.5 };
/** The mark's box once it sits on the T: the 56px pill's height at the heading's 52px, so it scales on phones. */
const MARK = 1080;
const MID = MARK / 2;
/** How many times that size the circle is while it shows the tick, in the middle of the screen (168px on a laptop). */
const BIG = 3;
// The tick's two strokes and what each becomes: the short one rises to be the T's bar, the long one stands up as its
// stem.
const TICK = { short: "M365 553L478 665", long: "M478 665L715 427", width: 56 };
const LETTER = {
  bar: `M${MID - T_GLYPH.width / 2} ${MID - T_GLYPH.height / 2 + T_GLYPH.bar / 2}L${MID + T_GLYPH.width / 2} ${MID - T_GLYPH.height / 2 + T_GLYPH.bar / 2}`,
  stem: `M${MID} ${MID + T_GLYPH.height / 2}L${MID} ${MID - T_GLYPH.height / 2}`,
};

/**
 * The thank-you screen's tick, which becomes the T of "Thanks" (owner, 2026-10-05). It lives inside the heading, on the
 * T's own spot and sized in the heading's ems, and is moved and scaled from there. Four beats:
 * 0. the Send application pill, where that sat (`from`) and still saying Sending…, becomes a large circle in the middle
 *    of the thank-you block (owner, same day: a bigger tick, "in to the center");
 * 1. the tick draws in the circle and holds;
 * 2. the circle shrinks away as the mark travels to the T's place, the tick's two strokes swinging and thickening into
 *    the T on the way;
 * 3. the drawn T hands over to the real letter (`onDone`), and the rest of the heading follows.
 * The strokes are white set to "difference", so they read as ink on the white circle and as white on the panel once
 * the circle has gone, with no colour change to time.
 */
function SentMark({ from, onDone }: { from: DOMRect; onDone: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [beat, setBeat] = useState<0 | 1 | 2 | 3>(0);

  // The two ends of the second move: the big circle in the middle, and the mark's own box on the T.
  const stops = useRef<{ big: Keyframe; own: Keyframe } | null>(null);
  const first = useRef<Animation | null>(null);
  const easing = `cubic-bezier(${EASE.join(",")})`;

  // Before the first paint: measure where the mark belongs and where the middle is, then play the pill into the big
  // circle. Plain web animations, which leave no styles behind when cancelled, so measuring again (React runs effects
  // twice in development) still finds the mark's true place.
  useLayoutEffect(() => {
    const mark = ref.current;
    const block = mark?.closest("[role=status]");
    if (!mark || !block) return;
    const own = mark.getBoundingClientRect();
    const around = block.getBoundingClientRect();
    const size = own.width * BIG;
    const left = around.left + around.width / 2 - size / 2;
    const top = around.top + around.height / 2 - size / 2;
    stops.current = {
      big: { opacity: 1, width: `${size}px`, height: `${size}px`, transform: `translate(${left - own.left}px, ${top - own.top}px)` },
      own: { opacity: 1, width: `${own.width}px`, height: `${own.height}px`, transform: "translate(0, 0)" },
    };
    const play = mark.animate(
      [
        {
          opacity: 1,
          width: `${from.width}px`,
          height: `${from.height}px`,
          transform: `translate(${from.left - own.left}px, ${from.top - own.top}px)`,
        },
        stops.current.big,
      ],
      { duration: 600, easing, fill: "both" },
    );
    first.current = play;
    play.finished.then(() => setBeat(1)).catch(() => {});
    return () => play.cancel();
    // Once, when the screen arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The tick is held a moment once drawn; then the mark travels to the T while its strokes become the letter (the same
  // half second and curve as their swing below), and the T is handed over once formed.
  useEffect(() => {
    if (beat === 0 || beat === 3) return;
    if (beat === 2 && ref.current && stops.current) {
      ref.current.animate([stops.current.big, stops.current.own], { duration: 500, easing, fill: "both" });
      first.current?.cancel();
    }
    const id = window.setTimeout(
      () => {
        setBeat(beat === 1 ? 2 : 3);
        if (beat === 2) onDone();
      },
      beat === 1 ? 700 : 520,
    );
    return () => window.clearTimeout(id);
    // `onDone` only sets a flag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  const lettered = beat >= 2;
  const stroke = {
    fill: "none",
    stroke: "#fff",
    strokeLinecap: lettered ? ("butt" as const) : ("round" as const),
  };
  const swing = { duration: 0.5, ease: EASE };

  return (
    <span
      ref={ref}
      // Hidden for the frame before the animation takes over, so it never flashes in its final place first.
      style={{
        opacity: 0,
        left: `${(T_GLYPH.x - MID) / 1000}em`,
        top: `${(T_GLYPH.y - MID) / 1000}em`,
        width: `${MARK / 1000}em`,
        height: `${MARK / 1000}em`,
      }}
      className="absolute isolate block"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-paper"
        animate={{ scale: lettered ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeIn" }}
      />
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ fontVariationSettings: "normal" }}
        className="absolute inset-0 grid place-items-center whitespace-nowrap font-sans text-base font-semibold tracking-normal text-ink"
      >
        Sending…
      </motion.span>
      <motion.svg
        viewBox={`0 0 ${MARK} ${MARK}`}
        className="absolute inset-0 size-full overflow-visible mix-blend-difference"
        animate={{ opacity: beat === 3 ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <motion.path
          {...stroke}
          initial={{ d: TICK.short, strokeWidth: TICK.width, pathLength: 0, opacity: 0 }}
          animate={
            lettered
              ? { d: LETTER.bar, strokeWidth: T_GLYPH.bar, pathLength: 1, opacity: 1 }
              : { pathLength: beat ? 1 : 0, opacity: beat ? 1 : 0 }
          }
          transition={lettered ? swing : { pathLength: { duration: 0.12, ease: "easeOut" }, opacity: { duration: 0.01 } }}
        />
        <motion.path
          {...stroke}
          initial={{ d: TICK.long, strokeWidth: TICK.width, pathLength: 0, opacity: 0 }}
          animate={
            lettered
              ? { d: LETTER.stem, strokeWidth: T_GLYPH.stem, pathLength: 1, opacity: 1 }
              : { pathLength: beat ? 1 : 0, opacity: beat ? 1 : 0 }
          }
          transition={
            lettered
              ? swing
              : { pathLength: { duration: 0.23, delay: 0.12, ease: "easeOut" }, opacity: { duration: 0.01, delay: 0.12 } }
          }
        />
      </motion.svg>
    </span>
  );
}

/** Each step rises in as it arrives; reduced-motion visitors just get the new step. */
function Appear({ still, children }: { still: boolean | null; children: ReactNode }) {
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** One question, set large as the step's heading. */
function Question({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-balance font-display font-semibold text-[2.25rem] leading-[1.04] tracking-[-0.03em] sm:text-[3rem]">
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

/** Tap answers as full-width rows with their number key; radio buttons underneath. */
function Options({
  name,
  options,
  selected,
  error,
  onToggle,
}: {
  name: string;
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
                type="radio"
                name={name}
                value={option}
                checked={on}
                // A click, not a change, so tapping the one already picked still moves on.
                readOnly
                onClick={() => onToggle(option)}
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
