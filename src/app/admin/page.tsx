import { redirect } from "next/navigation";

/**
 * /admin  →  always redirect to /admin/login
 * The actual dashboard lives at /admin/dashboard (protected by client-side auth check).
 */
export default function AdminIndexPage() {
  redirect("/admin/login");
}
