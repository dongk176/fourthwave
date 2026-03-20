import ZoomCallPicker from "./zoom-call-picker";
import ProgramInterestPicker from "./program-interest-picker";

type ProgramValue = "intensive-audition-program" | "songwriter-bootcamp" | "others";

interface ServiceApplyPageProps {
  searchParams?: Promise<{ program?: string }>;
}

function normalizeProgram(value: string | null): ProgramValue {
  if (value === "songwriter-bootcamp") return "songwriter-bootcamp";
  if (value === "others") return "others";
  return "intensive-audition-program";
}

export default async function ServiceApplyPage({ searchParams }: ServiceApplyPageProps) {
  const params = (await searchParams) ?? {};
  const selectedProgram = normalizeProgram(params.program ?? null);
  const returnTo = `/service/apply?program=${selectedProgram}`;

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,rgba(159,180,204,0.12)_0%,rgba(36,42,49,0.84)_42%,rgba(27,31,37,0.92)_100%)] px-6 pb-16 pt-24 md:px-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-4xl font-bold uppercase md:mb-8 md:text-6xl">Program Application</h1>

        <form
          action="/api/inquiries"
          method="post"
          className="space-y-8 md:border md:border-primary/20 md:bg-background-dark/50 md:p-10"
        >
          <input type="hidden" name="source" value="service-apply" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <div>
            <p className="text-xl font-bold mb-4 uppercase">Name</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="block text-sm font-semibold mb-2">
                  First Name <span className="text-primary">(required)</span>
                </span>
                <input
                  required
                  name="firstName"
                  type="text"
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold mb-2">
                  Last Name <span className="text-primary">(required)</span>
                </span>
                <input
                  required
                  name="lastName"
                  type="text"
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 focus:outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <span className="block text-sm font-semibold mb-2">
                Age <span className="text-primary">(required)</span>
              </span>
              <input
                required
                min={1}
                name="age"
                type="number"
                className="w-full bg-transparent border border-primary/30 px-4 py-3 focus:outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold mb-2">
                Email <span className="text-primary">(required)</span>
              </span>
              <input
                required
                name="email"
                type="email"
                className="w-full bg-transparent border border-primary/30 px-4 py-3 focus:outline-none focus:border-primary"
              />
            </label>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="subscribeUpdates"
              className="h-4 w-4 accent-primary"
            />
            <span>Sign up for news and updates</span>
          </label>

          <label className="block">
            <ProgramInterestPicker defaultValue={selectedProgram} />
          </label>

          <ZoomCallPicker />

          <label className="block">
            <span className="block text-sm font-semibold mb-2">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full bg-transparent border border-primary/30 px-4 py-3 focus:outline-none focus:border-primary"
            />
          </label>

          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-background-dark font-bold py-4 px-12 rounded hover:shadow-[0_0_20px_rgba(160,176,192,0.3)] transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
