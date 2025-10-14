'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useBrowsersQuery } from "../hooks/useBrowsersQuery";
import { useBrowsersMutation } from "../hooks/useBrowsersMutation";
import { useBrowsersFilter } from "@/app/store/filterStore";
import { BrowsersFilter } from "./BrowsersFilter";

export const BrowsersList = () => {
  const { browsersFilters } = useBrowsersFilter();
  const { data: posts, isLoading, isError } = useBrowsersQuery({browsersFilters});
  const { create, update, remove } = useBrowsersMutation();

  return (
    <div className="w-full">
      <BrowsersFilter />
      {
        !isLoading && posts.length === 0 && (
          <div>
            No Item Found.
          </div>
        )
      }
      {isLoading ? <div>Loading...</div> : posts?.map((p) => (
        <div key={p.id} className="mb-2">
          <Card>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>Id: {p.id}, UserId: {p.userId}</CardDescription>
              <CardAction>
                <Button variant="default" color="primary" size="sm"
                  onClick={() => {
                    update.mutate({
                      id: p.id,
                      data: {
                        title: 'Updated -'+p.title,
                        body: p.body,
                        userId: 21,
                      }
                    })
                  }}
                  >Enable Emergacy</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{p.body}</p>
            </CardContent>
            <CardFooter>
              <p>Status : Active</p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}