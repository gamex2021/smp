"use client"

import { useState } from "react"
import { Download, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function DownloadReportButton() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const handleDownload = (format: string) => {
    setIsDownloading(true)

    // Simulate download
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadComplete(true)

      setTimeout(() => {
        setDownloadComplete(false)
      }, 2000)
    }, 1500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : downloadComplete ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Downloaded
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload("pdf")}>Download as PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("excel")}>Download as Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("csv")}>Download as CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
