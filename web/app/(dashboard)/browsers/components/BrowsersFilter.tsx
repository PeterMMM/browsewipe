import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectSeparator } from "@radix-ui/react-select"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useBrowsersFilter } from "@/app/store/filterStore"

export const BrowsersFilter = () => {
  const { browsersFilters, setBrowsersFilters, resetBrowsersFilter } = useBrowsersFilter();
  const [key, setKey] = useState(+new Date())
  const [localSearchTerm, setLocalSearchTerm] = useState(browsersFilters?.searchTerm ?? '');
  const [localFilterUserId, setLocalFilterUserId] = useState(browsersFilters?.userId ?? '');

  const clearFilters = (e) => {
    e.stopPropagation()
    resetBrowsersFilter()
    setKey(+new Date())

    // Clear local state
    setLocalSearchTerm('');
    setLocalFilterUserId('');
  }

  const submitFilter = () => {
    setBrowsersFilters({ 
      searchTerm: localSearchTerm,
      userId: localFilterUserId,
    });
  }

  return (
    <div className="w-full my-2 px-1 flex flex-column flex-wrap gap-2 text-center items-center">
      <h6 className="text-gray-500">Filter:</h6>
      <Select key={key} value={localFilterUserId} 
        onValueChange={(newUserId: string) => setLocalFilterUserId(newUserId)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Filter User" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">User 1</SelectItem>
          <SelectItem value="2">User 2</SelectItem>
          <SelectItem value="3">User 3</SelectItem>
          <SelectSeparator />
            <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setBrowsersFilters({
                  userId: ''
                })
                setKey(+new Date())
                setLocalFilterUserId('');
              }}
            >
            Clear
          </Button>
        </SelectContent>
      </Select>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input type="searchTerm" placeholder="Enter title search"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <Button
          className="px-2"
          variant="outline"
          size="sm"
          onClick={submitFilter}
        >
          Filter
        </Button>
        <Button
          className="px-2"
          variant="secondary"
          size="sm"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}