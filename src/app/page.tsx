import { redirect } from "next/navigation";

// Root page redirects to default locale (fr)
export default function RootPage() {
  redirect("/");
}
