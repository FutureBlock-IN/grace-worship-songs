import { redirect } from "next/navigation";

export default function AdminCeremoniesPage() {
  redirect("/admin-worship-panel?tab=ceremonies");
}
