"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function SchoolHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">School Settings</h1>
        <p className="text-sm text-gray-500">Manage your school configuration and academic settings</p>
      </div>
      <Button className="bg-[#B4D5C3] hover:bg-[#B4D5C3]/90 text-[#11321FCC]">
        Save Changes
        <Save className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

