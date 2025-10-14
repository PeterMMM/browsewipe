import { LoginCard } from "./components/LoginCard"

export default function Page() {
  return (
    <div className="mx-0 md:mx-auto max-w-100">
      <div className="flex flex-col gap-6 items-center">
        <LoginCard />
      </div>
    </div>
  )
}