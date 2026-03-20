import { getFaqItems } from "../../../lib/faqs-store";
import { isDatabaseConfigured } from "../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return Response.json(
        { message: "Database is not configured.", items: [] },
        { status: 503 },
      );
    }

    const items = await getFaqItems();
    return Response.json({ items });
  } catch (error) {
    console.error("[GET /api/faq]", error);
    return Response.json(
      { message: "Failed to load faq." },
      { status: 500 },
    );
  }
}
