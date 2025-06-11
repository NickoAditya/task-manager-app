"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTask } from "@/contexts/task-context"

export function SearchBar() {
  const { searchTerm, setSearchTerm } = useTask()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="Cari tugas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-64"
      />
    </div>
  )
}
