import { NextResponse } from "next/server";
import { createInquiry } from "../../../lib/inquiries-store";

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim();
}

function readOptionalString(formData: FormData, key: string): string | undefined {
  const value = readString(formData, key);
  return value ? value : undefined;
}

function normalizeSource(value: string): string {
  if (value === "service-apply") return "service-apply";
  if (value === "contact") return "contact";
  return "home";
}

function parseAge(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return undefined;
  if (parsed < 1 || parsed > 120) return undefined;
  return parsed;
}

function getSafeReturnTo(value: string, fallback: string): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

function buildRedirectUrl(
  request: Request,
  returnTo: string,
  query: Record<string, string>,
): URL {
  const url = new URL(returnTo, request.url);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const source = normalizeSource(readString(formData, "source"));
    const firstName = readString(formData, "firstName");
    const lastName = readString(formData, "lastName");
    const email = readString(formData, "email");
    const message = readString(formData, "message");
    const age = parseAge(readString(formData, "age"));
    const subscribeUpdates = formData.get("subscribeUpdates") !== null;
    const programInterest = readOptionalString(formData, "programInterest");
    const zoomCallKst = readOptionalString(formData, "zoomCallKst");
    const fallback =
      source === "service-apply"
        ? "/service/apply"
        : source === "contact"
          ? "/contact"
          : "/#contact";
    const returnTo = getSafeReturnTo(readString(formData, "returnTo"), fallback);

    if (!firstName || !lastName || !email || !message) {
      const redirectUrl = buildRedirectUrl(request, returnTo, {
        inquiryError: "Please fill all required fields.",
      });
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    await createInquiry({
      source,
      firstName,
      lastName,
      email,
      message,
      age,
      subscribeUpdates,
      programInterest,
      zoomCallKst,
    });

    const redirectUrl = buildRedirectUrl(request, returnTo, { submitted: "1" });

    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    console.error("[POST /api/inquiries]", error);
    let returnTo = "/";
    try {
      const cloned = request.clone();
      const formData = await cloned.formData();
      const source = normalizeSource(readString(formData, "source"));
      const fallback =
        source === "service-apply"
          ? "/service/apply"
          : source === "contact"
            ? "/contact"
            : "/#contact";
      returnTo = getSafeReturnTo(readString(formData, "returnTo"), fallback);
    } catch {
      // noop
    }
    const redirectUrl = buildRedirectUrl(request, returnTo, {
      inquiryError: "Submission failed. Please try again.",
    });
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
