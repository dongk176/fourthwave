import { prisma } from "./db";
import { getSignedS3ObjectUrl, isS3Configured } from "./s3-storage";

export type ResultType = "audio" | "video";

export interface ResultItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  type: ResultType;
  mediaUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface AddResultInput {
  title: string;
  artist: string;
  description: string;
  type: ResultType;
  mediaKey?: string;
  mediaData?: Buffer;
  mediaMime: string;
  thumbnailKey?: string;
  thumbnailData?: Buffer;
  thumbnailMime?: string;
}

export interface UpdateResultMetaInput {
  id: string;
  title: string;
  artist: string;
  description: string;
}

function normalizeType(value: string): ResultType {
  return value === "video" ? "video" : "audio";
}

export async function getResults(): Promise<ResultItem[]> {
  const rows = await prisma.resultAsset.findMany({
    select: {
      id: true,
      title: true,
      artist: true,
      description: true,
      type: true,
      mediaKey: true,
      thumbnailKey: true,
      thumbnailData: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const items = await Promise.all(
    rows.map(async (row) => {
      let mediaUrl = `/api/results/media/${row.id}`;
      if (row.mediaKey && isS3Configured()) {
        try {
          mediaUrl = await getSignedS3ObjectUrl(row.mediaKey, 60 * 60 * 4);
        } catch {
          mediaUrl = `/api/results/media/${row.id}`;
        }
      }

      let thumbnailUrl: string | undefined;
      if (row.thumbnailKey && isS3Configured()) {
        try {
          thumbnailUrl = await getSignedS3ObjectUrl(row.thumbnailKey, 60 * 60 * 4);
        } catch {
          thumbnailUrl = row.thumbnailData
            ? `/api/results/thumbnail/${row.id}`
            : undefined;
        }
      } else {
        thumbnailUrl = row.thumbnailData
          ? `/api/results/thumbnail/${row.id}`
          : undefined;
      }

      return {
        id: row.id,
        title: row.title,
        artist: row.artist,
        description: row.description,
        type: normalizeType(row.type),
        mediaUrl,
        thumbnailUrl,
        createdAt: row.createdAt.toISOString(),
      };
    }),
  );

  return items;
}

export async function addResult(input: AddResultInput): Promise<{ id: string }> {
  if (!input.mediaKey && !input.mediaData) {
    throw new Error("Either mediaKey or mediaData is required.");
  }

  const created = await prisma.resultAsset.create({
    data: {
      title: input.title,
      artist: input.artist,
      description: input.description,
      type: input.type,
      mediaKey: input.mediaKey,
      mediaData: input.mediaData,
      mediaMime: input.mediaMime,
      thumbnailKey: input.thumbnailKey,
      thumbnailData: input.thumbnailData,
      thumbnailMime: input.thumbnailMime,
    },
    select: { id: true },
  });

  return { id: created.id };
}

export async function updateResultMeta(
  input: UpdateResultMetaInput,
): Promise<boolean> {
  const updated = await prisma.resultAsset.updateMany({
    where: { id: input.id },
    data: {
      title: input.title,
      artist: input.artist,
      description: input.description,
    },
  });

  return updated.count > 0;
}

export async function deleteResultById(id: string): Promise<boolean> {
  const deleted = await prisma.resultAsset.deleteMany({
    where: { id },
  });

  return deleted.count > 0;
}

export async function getResultStorageKeysById(id: string): Promise<{
  mediaKey: string | null;
  thumbnailKey: string | null;
} | null> {
  const row = await prisma.resultAsset.findUnique({
    where: { id },
    select: {
      mediaKey: true,
      thumbnailKey: true,
    },
  });

  if (!row) return null;
  return {
    mediaKey: row.mediaKey,
    thumbnailKey: row.thumbnailKey,
  };
}

export async function getResultMediaById(id: string): Promise<
  | {
      key: string;
      mime: string;
    }
  | {
      data: Buffer;
      mime: string;
    }
  | null
> {
  const row = await prisma.resultAsset.findUnique({
    where: { id },
    select: {
      mediaKey: true,
      mediaData: true,
      mediaMime: true,
    },
  });

  if (!row) return null;

  if (row.mediaKey) {
    return {
      key: row.mediaKey,
      mime: row.mediaMime || "application/octet-stream",
    };
  }

  if (!row.mediaData) return null;

  return {
    data: Buffer.from(row.mediaData),
    mime: row.mediaMime || "application/octet-stream",
  };
}

export async function getResultThumbnailById(id: string): Promise<
  | {
      key: string;
      mime: string;
    }
  | {
      data: Buffer;
      mime: string;
    }
  | null
> {
  const row = await prisma.resultAsset.findUnique({
    where: { id },
    select: {
      thumbnailKey: true,
      thumbnailData: true,
      thumbnailMime: true,
    },
  });

  if (!row) return null;

  if (row.thumbnailKey) {
    return {
      key: row.thumbnailKey,
      mime: row.thumbnailMime || "image/jpeg",
    };
  }

  if (!row.thumbnailData) return null;

  return {
    data: Buffer.from(row.thumbnailData),
    mime: row.thumbnailMime || "image/jpeg",
  };
}
