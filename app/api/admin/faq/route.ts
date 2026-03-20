import { cookies } from "next/headers";
import { createFaqItem } from "../../../../lib/faqs-store";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../../../lib/admin-auth";
import { isDatabaseConfigured } from "../../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifyAdmin() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { message: "Database is not configured." },
      { status: 503 },
    );
  }

  if (!isAdminAuthConfigured()) {
    return Response.json(
      { message: "Admin auth is not configured." },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSessionToken(sessionToken)) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const authError = await verifyAdmin();
    if (authError) return authError;

    const payload = (await request.json()) as {
      question?: string;
      answer?: string;
      sortOrder?: number;
    };

    const question = (payload.question || "").trim();
    const answer = (payload.answer || "").trim();
    const sortOrder =
      typeof payload.sortOrder === "number" ? payload.sortOrder : 0;

    if (!question) {
      return Response.json(
        { message: "Question is required." },
        { status: 400 },
      );
    }
    if (!answer) {
      return Response.json({ message: "Answer is required." }, { status: 400 });
    }

    const created = await createFaqItem({
      question,
      answer,
      sortOrder,
    });

    return Response.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/faq]", error);
    return Response.json(
      { message: "Failed to create faq item." },
      { status: 500 },
    );
  }
}
