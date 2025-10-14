import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BrowsersLayout({
    children
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {children}
    </section>
  )
}