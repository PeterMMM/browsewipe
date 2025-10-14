import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <h2>Browsewipe Web</h2>
      <p>
        Fugiat aliquip duis veniam velit est velit laboris veniam.
        Aute quis aliquip irure adipisicing culpa ut nisi ex officia esse ullamco mollit est aliqua. Nostrud fugiat nulla reprehenderit laboris amet laborum dolore non laboris dolor ea commodo ullamco dolore. Deserunt commodo dolor reprehenderit est eu cillum ad. Enim excepteur duis ipsum exercitation incididunt aliquip quis elit aliquip culpa duis sit. Irure proident exercitation ea ex excepteur veniam mollit reprehenderit. Aliqua magna aliquip aliqua fugiat ad minim nostrud consectetur irure eiusmod nisi eiusmod qui qui.
      </p>
      <Link href="/browsers" className="text-blue-400">
        <Button variant="outline">Browsers List</Button>
      </Link>
    </div>
  );
}
