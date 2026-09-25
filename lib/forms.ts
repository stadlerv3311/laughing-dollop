import type { StateCode } from "./us-states";

/** One end of the load: a state (picked on the map or in the dropdown) plus a city or ZIP. */
export type QuoteStop = { state: StateCode; place: string };

/** What the Get a Quote form sends — the shape to agree with the backend teammate. */
export type QuoteRequest = {
  pickup: QuoteStop;
  delivery: QuoteStop;
  weightLbs: number;
  /** What's being shipped. Equipment is always a dry van (DECISIONS.md → Freight types). */
  freight: string;
  contact: { name: string; company?: string; email: string; phone: string };
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

/** What the Drive for us application sends (DECISIONS.md → Applications: eight short questions, then HR calls). */
export type DriverApplication = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zip: string;
  hasClassA: boolean;
  /** Whole years driving Class A; 0 is allowed. */
  yearsClassA: number;
  /**
   * Sensitive: a driver's license number. The backend must send it over HTTPS only, store it encrypted and limit who
   * can read it — it's the one field on the site that identifies a person to the state.
   */
  license: { state: string; number: string };
  /** Any of "Hazmat", "Tanker", "Doubles"; empty means None. */
  endorsements: string[];
};

/** Stub until the backend teammate's application endpoint exists — same behaviour as `submitQuote`. */
export async function submitDriverApplication(application: DriverApplication): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (process.env.NODE_ENV !== "production") {
    console.info("[application stub] would send:", application);
    return { ok: true };
  }
  return { ok: false, message: "Online applications aren’t switched on yet. Please try again soon." };
}
