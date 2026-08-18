import { redirect } from "next/navigation";

export default function OsIndexRedirect() {
  redirect("/os/dashboard");
}
