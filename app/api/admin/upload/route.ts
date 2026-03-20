import path from "path";
import { cookies } from "next/headers";
import {
  addResult,
  type ResultType,
} from "../../../../lib/results-store";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../../../lib/admin-auth";
import { isDatabaseConfigured } from "../../../../lib/db";
import {
  buildResultMediaKey,
  buildResultThumbnailKey,
  deleteS3ObjectByKey,
  isS3Configured,
  uploadBufferToS3,
} from "../../../../lib/s3-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EXTENSIONS: Record<ResultType, string[]> = {
  audio: [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"],
  video: [".mp4", ".mov", ".webm", ".m4v"],
};

const ALLOWED_THUMB_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_MEDIA_FILE_BYTES = 1024 * 1024 * 350; // 350MB
const MAX_THUMBNAIL_BYTES = 1024 * 1024 * 15; // 15MB

function getSafeExtension(fileName: string): string {
  return path.extname(fileName || "").toLowerCase();
}

function inferResultType(file: File): ResultType | null {
  const mime = file.type.toLowerCase();
  const ext = getSafeExtension(file.name);

  if (mime.startsWith("audio/") || ALLOWED_EXTENSIONS.audio.includes(ext)) {
    return "audio";
  }
  if (mime.startsWith("video/") || ALLOWED_EXTENSIONS.video.includes(ext)) {
    return "video";
  }
  return null;
}

export async function POST(request: Request) {
  let uploadedMediaKey: string | undefined;
  let uploadedThumbnailKey: string | undefined;
  try {
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

    const formData = await request.formData();
    const title = (formData.get("title")?.toString() || "").trim();
    const artist = (formData.get("artist")?.toString() || "").trim();
    const description = (formData.get("description")?.toString() || "").trim();
    const requestedType = (formData.get("type")?.toString() || "").trim();
    const mediaFile = formData.get("mediaFile");
    const thumbnailFile = formData.get("thumbnailFile");

    if (!title) {
      return Response.json({ message: "Title is required." }, { status: 400 });
    }

    if (!(mediaFile instanceof File) || mediaFile.size === 0) {
      return Response.json(
        { message: "Media file is required." },
        { status: 400 },
      );
    }

    if (mediaFile.size > MAX_MEDIA_FILE_BYTES) {
      return Response.json(
        {
          message: `Media file is too large. Max ${Math.floor(
            MAX_MEDIA_FILE_BYTES / (1024 * 1024),
          )}MB.`,
        },
        { status: 400 },
      );
    }

    const inferredType = inferResultType(mediaFile);
    const type: ResultType | null =
      requestedType === "audio" || requestedType === "video"
        ? requestedType
        : inferredType;

    if (!type) {
      return Response.json(
        { message: "Unsupported media type." },
        { status: 400 },
      );
    }

    const mediaExt = getSafeExtension(mediaFile.name);
    if (!ALLOWED_EXTENSIONS[type].includes(mediaExt)) {
      return Response.json(
        {
          message: `Unsupported ${type} file format. Allowed: ${ALLOWED_EXTENSIONS[
            type
          ].join(", ")}`,
        },
        { status: 400 },
      );
    }

    let mediaData: Buffer | undefined = Buffer.from(await mediaFile.arrayBuffer());
    const mediaMime = mediaFile.type || "application/octet-stream";

    let thumbnailData: Buffer | undefined;
    let thumbnailMime: string | undefined;
    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      if (thumbnailFile.size > MAX_THUMBNAIL_BYTES) {
        return Response.json(
          {
            message: `Thumbnail is too large. Max ${Math.floor(
              MAX_THUMBNAIL_BYTES / (1024 * 1024),
            )}MB.`,
          },
          { status: 400 },
        );
      }

      const thumbExt = getSafeExtension(thumbnailFile.name);
      if (!ALLOWED_THUMB_EXTENSIONS.includes(thumbExt)) {
        return Response.json(
          {
            message: `Unsupported thumbnail format. Allowed: ${ALLOWED_THUMB_EXTENSIONS.join(
              ", ",
            )}`,
          },
          { status: 400 },
        );
      }
      thumbnailData = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailMime = thumbnailFile.type || "image/jpeg";
    }

    let mediaKey: string | undefined;
    let thumbnailKey: string | undefined;
    if (isS3Configured()) {
      mediaKey = buildResultMediaKey(mediaFile.name);
      await uploadBufferToS3({
        key: mediaKey,
        body: mediaData,
        contentType: mediaMime,
      });
      uploadedMediaKey = mediaKey;
      mediaData = undefined;

      if (thumbnailData) {
        thumbnailKey = buildResultThumbnailKey(
          thumbnailFile instanceof File ? thumbnailFile.name : "thumbnail.jpg",
        );
        await uploadBufferToS3({
          key: thumbnailKey,
          body: thumbnailData,
          contentType: thumbnailMime || "image/jpeg",
        });
        uploadedThumbnailKey = thumbnailKey;
        thumbnailData = undefined;
      }
    }

    const item = {
      title,
      artist: artist || "FourthWave Artist",
      description,
      type,
      mediaKey,
      mediaData,
      mediaMime,
      thumbnailKey,
      thumbnailData,
      thumbnailMime,
    };

    const created = await addResult(item);
    return Response.json({ id: created.id }, { status: 201 });
  } catch (error) {
    try {
      await deleteS3ObjectByKey(uploadedMediaKey);
      await deleteS3ObjectByKey(uploadedThumbnailKey);
    } catch (cleanupError) {
      console.error("[POST /api/admin/upload] cleanup error", cleanupError);
    }
    console.error("[POST /api/admin/upload]", error);
    return Response.json(
      { message: "Failed to upload media." },
      { status: 500 },
    );
  }
}
