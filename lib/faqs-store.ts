import { prisma } from "./db";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface CreateFaqInput {
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface UpdateFaqInput {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

function normalizeSortOrder(value: number | undefined): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value as number));
}

async function reindexFaqSortOrders() {
  const rows = await prisma.faqItem.findMany({
    select: {
      id: true,
      sortOrder: true,
      createdAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const updates: ReturnType<typeof prisma.faqItem.update>[] = [];
  rows.forEach((row, index) => {
    if (row.sortOrder === index) return;
    updates.push(
      prisma.faqItem.update({
        where: { id: row.id },
        data: { sortOrder: index },
      }),
    );
  });

  if (updates.length > 0) {
    await prisma.$transaction(updates);
  }
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const rows = await prisma.faqItem.findMany({
    select: {
      id: true,
      question: true,
      answer: true,
      sortOrder: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sortOrder,
  }));
}

export async function createFaqItem(input: CreateFaqInput): Promise<{ id: string }> {
  const created = await prisma.faqItem.create({
    data: {
      question: input.question,
      answer: input.answer,
      sortOrder: normalizeSortOrder(input.sortOrder),
    },
    select: { id: true },
  });

  await reindexFaqSortOrders();
  return { id: created.id };
}

export async function updateFaqItem(input: UpdateFaqInput): Promise<boolean> {
  const updated = await prisma.faqItem.updateMany({
    where: { id: input.id },
    data: {
      question: input.question,
      answer: input.answer,
      sortOrder: normalizeSortOrder(input.sortOrder),
    },
  });

  if (updated.count > 0) {
    await reindexFaqSortOrders();
  }

  return updated.count > 0;
}

export async function deleteFaqItemById(id: string): Promise<boolean> {
  const deleted = await prisma.faqItem.deleteMany({
    where: { id },
  });

  if (deleted.count > 0) {
    await reindexFaqSortOrders();
  }

  return deleted.count > 0;
}
