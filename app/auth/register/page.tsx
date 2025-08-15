import { redirect } from "next/navigation"

export default function RegisterRedirect({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const from =
    typeof searchParams?.redirectedFrom === "string"
      ? `?redirectedFrom=${encodeURIComponent(searchParams.redirectedFrom)}`
      : ""

  redirect(`/auth/sign-up${from}`)
}
