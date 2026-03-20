import { getResultThumbnailById } from "../../../../../lib/results-store";
import { getSignedS3ObjectUrl, isS3Configured } from "../../../../../lib/s3-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const thumbnail = await getResultThumbnailById(id);
    if (!thumbnail) {
      return Response.json({ message: "Thumbnail not found." }, { status: 404 });
    }

    if ("key" in thumbnail && isS3Configured()) {
      const signedUrl = await getSignedS3ObjectUrl(thumbnail.key, 60 * 60);
      return Response.redirect(signedUrl, 307);
    }
    if (!("data" in thumbnail)) {
      return Response.json({ message: "Thumbnail not found." }, { status: 404 });
    }

    return new Response(new Uint8Array(thumbnail.data), {
      status: 200,
      headers: {
        "Content-Type": thumbnail.mime,
        "Content-Length": thumbnail.data.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[GET /api/results/thumbnail/[id]]", error);
    return Response.json(
      { message: "Failed to load thumbnail." },
      { status: 500 },
    );
  }
}
