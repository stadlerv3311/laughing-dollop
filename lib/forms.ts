import type { StateCode } from "./us-states";

/** One end of the load: its ZIP and the state that ZIP is in (`lib/zip.ts`). */
export type QuoteStop = { zip: string; state: StateCode };

/**
 * What the Get a Quote form sends — the shape to agree with the backend teammate. ZIPs only since 2026-10-01 (owner):
 * no city, weight, freight or company. Phone or email: at least one is there.
 */
export type QuoteRequest = {
  pickup: QuoteStop;
  delivery: QuoteStop;
  /** When it's ready to be picked up, `YYYY-MM-DD`. */
  pickupDate: string;
  contact: { name: string; phone?: string; email?: string };
};

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * Stub until the backend teammate's quote endpoint exists (DECISIONS.md → Team split; the form backend is still Open).
 * In development it logs the request and succeeds, so the thank-you screen can be built and checked.
 * In production it fails with a clear message rather than pretending a request was sent.
 */
export async function submitQuote(request: QuoteRequest): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (process.env.NODE_ENV !== "production") {
    console.info("[quote stub] would send:", request);
    return { ok: true };
  }
  return { ok: false, message: "Online quotes aren’t switched on yet. Please try again soon." };
}

/** What the job application sends (DECISIONS.md → Applications). Driver-only answers sit under `driver`. */
export type JobApplication = {
  job: "driver" | "office" | "shop";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zip: string;
  /**
   * Whole years of experience — driving Class A for drivers, that kind of work for office and shop; 0 is allowed.
   * Left out for a driver without a Class A CDL, who isn't asked (owner, 2026-10-05).
   */
  yearsExperience?: number;
  driver?: {
    hasClassA: boolean;
    // No license state or number since 2026-10-01 (owner): asking for them needs a terms of service and privacy page
    // first. No endorsements since 2026-10-05 (owner). HR takes them on the call back.
  };
};

/** Stub until the backend teammate's application endpoint exists — same behaviour as `submitQuote`. */
export async function submitJobApplication(application: JobApplication): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (process.env.NODE_ENV !== "production") {
    console.info("[application stub] would send:", application);
    return { ok: true };
  }
  return { ok: false, message: "Online applications aren’t switched on yet. Please try again soon." };
}
