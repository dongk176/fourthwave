import { prisma } from "./db";

export interface InquiryItem {
  id: string;
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  age?: number;
  subscribeUpdates: boolean;
  programInterest?: string;
  zoomCallKst?: string;
  createdAt: string;
}

export interface CreateInquiryInput {
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  age?: number;
  subscribeUpdates?: boolean;
  programInterest?: string;
  zoomCallKst?: string;
}

export async function createInquiry(input: CreateInquiryInput): Promise<{ id: string }> {
  const created = await prisma.inquiry.create({
    data: {
      source: input.source,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      message: input.message,
      age: input.age,
      subscribeUpdates: input.subscribeUpdates ?? false,
      programInterest: input.programInterest,
      zoomCallKst: input.zoomCallKst,
    },
    select: {
      id: true,
    },
  });

  return { id: created.id };
}

export async function getInquiries(): Promise<InquiryItem[]> {
  const rows = await prisma.inquiry.findMany({
    select: {
      id: true,
      source: true,
      firstName: true,
      lastName: true,
      email: true,
      message: true,
      age: true,
      subscribeUpdates: true,
      programInterest: true,
      zoomCallKst: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    source: row.source,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    message: row.message,
    age: row.age ?? undefined,
    subscribeUpdates: row.subscribeUpdates,
    programInterest: row.programInterest ?? undefined,
    zoomCallKst: row.zoomCallKst ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }));
}
