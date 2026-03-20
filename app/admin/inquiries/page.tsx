import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../../lib/admin-auth";
import { isDatabaseConfigured } from "../../../lib/db";
import { getInquiries } from "../../../lib/inquiries-store";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function sourceLabel(value: string): string {
  if (value === "service-apply") return "Service Apply";
  if (value === "contact") return "Contact Page";
  return "Home Contact";
}

export default async function AdminInquiriesPage() {
  if (!isDatabaseConfigured()) {
    return (
      <main className="min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">Database Not Configured</h1>
      </main>
    );
  }

  if (!isAdminAuthConfigured()) {
    return (
      <main className="min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">Admin Auth Not Configured</h1>
      </main>
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin/login");
  }

  const items = await getInquiries();

  return (
    <main className="min-h-screen px-6 md:px-12 py-16">
      <section className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold uppercase">Inquiries</h1>
            <p className="text-slate-300 mt-4">{items.length} total submissions</p>
          </div>
          <Link
            href="/admin"
            className="border border-primary/30 px-5 py-3 text-sm uppercase tracking-widest text-primary font-bold hover:bg-primary hover:text-background-dark transition-colors"
          >
            Back to Admin
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="border border-primary/20 bg-background-elevated p-8">
            <p className="text-slate-400">No inquiries yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="border border-primary/20 bg-background-elevated p-6 md:p-7"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-primary">
                    {sourceLabel(item.source)}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-slate-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <p className="text-sm">
                    <span className="text-slate-400">Name:</span> {item.firstName} {item.lastName}
                  </p>
                  <p className="text-sm">
                    <span className="text-slate-400">Email:</span> {item.email}
                  </p>
                  {typeof item.age === "number" ? (
                    <p className="text-sm">
                      <span className="text-slate-400">Age:</span> {item.age}
                    </p>
                  ) : null}
                  {item.programInterest ? (
                    <p className="text-sm">
                      <span className="text-slate-400">Program:</span> {item.programInterest}
                    </p>
                  ) : null}
                  {item.zoomCallKst ? (
                    <p className="text-sm">
                      <span className="text-slate-400">Zoom Call (KST):</span> {item.zoomCallKst}
                    </p>
                  ) : null}
                  <p className="text-sm">
                    <span className="text-slate-400">News/Updates:</span>{" "}
                    {item.subscribeUpdates ? "Yes" : "No"}
                  </p>
                </div>

                <div className="border-t border-primary/15 pt-4">
                  <p className="text-sm text-slate-400 mb-2 uppercase tracking-widest">Message</p>
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
