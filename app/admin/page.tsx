import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminConsole from "./admin-console";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "../../lib/admin-auth";
import { isDatabaseConfigured } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isDatabaseConfigured()) {
    return (
      <main className="min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">
          Database Not Configured
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Set <code>DATABASE_URL</code> first.
        </p>
      </main>
    );
  }

  if (!isAdminAuthConfigured()) {
    return (
      <main className="min-h-screen px-6 md:px-12 py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">
          Admin Auth Not Configured
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code>{" "}
          in your environment variables first.
        </p>
      </main>
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin/login");
  }

  return <AdminConsole />;
}
