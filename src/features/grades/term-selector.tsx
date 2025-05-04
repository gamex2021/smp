"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Term {
  id: string
  name: string
  year: string
}

interface TermSelectorProps {
  terms: Term[]
}

export default function TermSelector({ terms }: TermSelectorProps) {
  const [selectedTerm, setSelectedTerm] = useState(terms[0]?.id ?? "")

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Term:</span>
      <Select value={selectedTerm} onValueChange={setSelectedTerm}>
        <SelectTrigger className="w-[200px] border-green-200 focus:ring-green-500 dark:border-green-800">
          <SelectValue placeholder="Select term" />
        </SelectTrigger>
        <SelectContent>
          {terms.map((term) => (
            <SelectItem key={term.id} value={term.id}>
              {term.name} - {term.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
