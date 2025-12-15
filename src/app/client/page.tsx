import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export default async function PortalPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { data: shipments } = await supabase
    .from("shipments")
    .select("id, waybill, status, created_at")
    .order("created_at", { ascending: false })

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back{user?.email ? `, ${user.email}` : ""}
      </h1>

      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b font-semibold">
          Your Shipments
        </div>

        {shipments && shipments.length > 0 ? (
          <ul className="divide-y">
            {shipments.map((s) => (
              <li key={s.id} className="p-4 flex justify-between">
                <div>
                  <p className="font-medium">{s.waybill}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-sm font-semibold">
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-gray-500">
            You don’t have any shipments yet.
          </p>
        )}
      </div>
    </main>
  )
}
