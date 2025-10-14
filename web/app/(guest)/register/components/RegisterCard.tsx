import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function RegisterCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register new account</CardTitle>
        <CardDescription>
          We will send email confirmation to your email address.
        </CardDescription>
        <CardAction>
          <Link href="/login" ><Button variant="link">Login</Button></Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Confirm Password</Label>
              <Input id="password" type="confirm_password" placeholder="Enter password again" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Register
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
