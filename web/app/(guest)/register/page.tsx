import { RegisterCard } from "./components/RegisterCard";

export default function Page() {
  return (
    <div className="mx-0 md:mx-auto max-w-100">
      <div className="flex flex-col gap-6 items-center">
        <RegisterCard />
      </div>
    </div>
  )
}