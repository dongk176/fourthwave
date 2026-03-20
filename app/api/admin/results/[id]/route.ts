import { cookies } from "next/headers";
import {
  deleteResultById,
  getResultStorageKeysById,
  updateResultMeta,
} from "../../../../../lib/results-store";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../../../../lib/admin-auth";
import { isDatabaseConfigured } from "../../../../../lib/db";
import { deleteS3ObjectByKey, isS3Configured } from "../../../../../lib/s3-storage";

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
      title?: string;
      artist?: string;
      description?: string;
    };

    const title = (payload.title || "").trim();
    const artist = (payload.artist || "").trim();
    const description = (payload.description || "").trim();

    if (!title) {
      return Response.json({ message: "Title is required." }, { status: 400 });
    }

    const updated = await updateResultMeta({
      id,
      title,
      artist: artist || "FourthWave Artist",
      description,
    });

    if (!updated) {
      return Response.json({ message: "Result not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/admin/results/[id]]", error);
    return Response.json(
      { message: "Failed to update result." },
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
    const keys = await getResultStorageKeysById(id);
    const deleted = await deleteResultById(id);

    if (!deleted) {
      return Response.json({ message: "Result not found." }, { status: 404 });
    }

    if (isS3Configured() && keys) {
      try {
        await Promise.all([
          deleteS3ObjectByKey(keys.mediaKey),
          deleteS3ObjectByKey(keys.thumbnailKey),
        ]);
      } catch (cleanupError) {
        console.error("[DELETE /api/admin/results/[id]] cleanup", cleanupError);
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/results/[id]]", error);
    return Response.json(
      { message: "Failed to delete result." },
      { status: 500 },
    );
  }
}
