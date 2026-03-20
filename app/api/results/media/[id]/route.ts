import { getResultMediaById } from "../../../../../lib/results-store";
import { getSignedS3ObjectUrl, isS3Configured } from "../../../../../lib/s3-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildResponse(
  data: Buffer,
  mime: string,
  rangeHeader: string | null,
): Response {
  const size = data.length;

  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": size.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const [startRaw, endRaw] = rangeHeader.replace("bytes=", "").split("-");
  const start = Number.parseInt(startRaw, 10);
  const end = endRaw ? Number.parseInt(endRaw, 10) : size - 1;

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return new Response(null, {
      status: 416,
      headers: {
        "Content-Range": `bytes */${size}`,
      },
    });
  }

  const boundedEnd = Math.min(end, size - 1);
  const chunk = data.subarray(start, boundedEnd + 1);

  return new Response(new Uint8Array(chunk), {
    status: 206,
    headers: {
      "Content-Type": mime,
      "Content-Length": chunk.length.toString(),
      "Content-Range": `bytes ${start}-${boundedEnd}/${size}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const media = await getResultMediaById(id);
    if (!media) {
      return Response.json({ message: "Media not found." }, { status: 404 });
    }

    if ("key" in media && isS3Configured()) {
      const signedUrl = await getSignedS3ObjectUrl(media.key, 60 * 60);
      return Response.redirect(signedUrl, 307);
    }
    if (!("data" in media)) {
      return Response.json({ message: "Media not found." }, { status: 404 });
    }

    const rangeHeader = request.headers.get("range");
    return buildResponse(media.data, media.mime, rangeHeader);
  } catch (error) {
    console.error("[GET /api/results/media/[id]]", error);
    return Response.json({ message: "Failed to load media." }, { status: 500 });
  }
}
