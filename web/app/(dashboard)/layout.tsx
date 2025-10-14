import "@/app/globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Browsewipe",
  description: "Safe your digital foodprint.",
};

export default function DashboardLayout({ children }) {
  return (
    <div>
      <div className="w-full bg-[#1300E1] text-white rounded-full pl-4 flex gap-2 items-center min-h-10">
        <h4 className="flex-1 text-center"><Link href="/">Browsewipe</Link></h4>
        <div className="py-2 bg-white rounded-e-full">
          <Button variant="link" className="text-[#1300E1]"><Link href="#">Profile</Link></Button>
          {/* <Button variant="link" className="text-[#1300E1]"><Link href="/logout">Logout</Link></Button> */}
          <Button variant="link" className="text-[#1300E1]"><Link href="/login">Login</Link></Button>
        </div>
      </div>
      <main>
        {children}
      </main>
    </div>
  );
}
