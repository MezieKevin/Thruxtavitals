import { redirect } from "next/navigation";

/** Former order hub; product listing now lives at `/shop`. */
export default function OrderIndexRedirect() {
  redirect("/shop");
}
