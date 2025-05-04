"use client"

import { useState } from "react"
import { FileText, Video, LinkIcon, Download, ExternalLink, BookOpen, FileQuestion } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Resource {
  id: string
  title: string
  description: string
  type: "document" | "video" | "link" | "quiz" | "book"
  url: string
  fileSize?: string
  duration?: string
  isNew: boolean
  category: "lecture" | "reading" | "practice" | "reference"
}

interface ResourcesListProps {
  resources: Resource[]
}

export default function ResourcesList({ resources }: ResourcesListProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredResources =
    activeCategory === "all" ? resources : resources.filter((resource) => resource.category === activeCategory)

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "video":
        return <Video className="h-5 w-5 text-red-500" />
      case "link":
        return <LinkIcon className="h-5 w-5 text-purple-500" />
      case "quiz":
        return <FileQuestion className="h-5 w-5 text-amber-500" />
      case "book":
        return <BookOpen className="h-5 w-5 text-green-500" />
    }
  }

  const getResourceAction = (resource: Resource) => {
    switch (resource.type) {
      case "document":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )
      case "video":
      case "link":
      case "quiz":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </Button>
        )
      case "book":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <BookOpen className="h-4 w-4 mr-2" />
            Read
          </Button>
        )
    }
  }

  return (
    <div>
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="bg-green-50 dark:bg-green-900/20">
          <TabsTrigger value="all" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            All Resources
          </TabsTrigger>
          <TabsTrigger value="lecture" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Lectures
          </TabsTrigger>
          <TabsTrigger value="reading" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Readings
          </TabsTrigger>
          <TabsTrigger value="practice" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Practice
          </TabsTrigger>
          <TabsTrigger value="reference" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Reference
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden border-green-100 dark:border-green-900/50">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                  {getResourceIcon(resource.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-green-700 dark:text-green-400">{resource.title}</h3>
                    {resource.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="capitalize">{resource.type}</span>
                    {resource.fileSize && <span>• {resource.fileSize}</span>}
                    {resource.duration && <span>• {resource.duration}</span>}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{resource.description}</p>
              {getResourceAction(resource)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
