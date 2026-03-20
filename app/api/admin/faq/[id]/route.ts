import { cookies } from "next/headers";
import { deleteFaqItemById, updateFaqItem } from "../../../../../lib/faqs-store";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../../../../lib/admin-auth";
import { isDatabaseConfigured } from "../../../../../lib/db";

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authError = await verifyAdmin();
    if (authError) return authError;

    const { id } = await context.params;
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

    const updated = await updateFaqItem({
      id,
      question,
      answer,
      sortOrder,
    });
    if (!updated) {
      return Response.json({ message: "FAQ item not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/admin/faq/[id]]", error);
    return Response.json(
      { message: "Failed to update faq item." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authError = await verifyAdmin();
    if (authError) return authError;

    const { id } = await context.params;
    const deleted = await deleteFaqItemById(id);
    if (!deleted) {
      return Response.json({ message: "FAQ item not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/faq/[id]]", error);
    return Response.json(
      { message: "Failed to delete faq item." },
      { status: 500 },
    );
  }
}
