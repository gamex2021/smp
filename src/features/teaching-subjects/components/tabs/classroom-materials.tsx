"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Download,
  Search,
  Calendar,
  Eye,
  MoreHorizontal,
  File,
  ImageIcon,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useClassroom } from "../../providers/classroom-provider";
import { type Id } from "~/_generated/dataModel";

interface ClassroomMaterialsProps {
  subjectTeacherId: Id<"subjectTeachers">;
}

export function ClassroomMaterials({
  subjectTeacherId,
}: ClassroomMaterialsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { openMaterialModal } = useClassroom();

  // Mock data - replace with actual material queries
  const materials = [
    {
      id: "1",
      title: "Chapter 5 - Algebra Basics",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      downloads: 24,
      description: "Introduction to algebraic concepts and basic operations",
    },
    {
      id: "2",
      title: "Practice Problems Set 1",
      type: "docx",
      size: "1.2 MB",
      uploadDate: "2024-01-12",
      downloads: 18,
      description: "Practice problems for Chapter 5",
    },
    {
      id: "3",
      title: "Video Lecture - Quadratic Equations",
      type: "mp4",
      size: "45.6 MB",
      uploadDate: "2024-01-10",
      downloads: 32,
      description: "Comprehensive video explanation of quadratic equations",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "docx":
        return <FileText className="h-5 w-5" />;
      case "mp4":
        return <Video className="h-5 w-5" />;
      case "jpg":
      case "png":
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-700";
      case "docx":
        return "bg-blue-100 text-blue-700";
      case "mp4":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Materials</h2>
          <p className="text-muted-foreground">
            Share resources and materials with your students
          </p>
        </div>
        <Button onClick={openMaterialModal}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Material
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${getFileTypeColor(material.type)}`}
                  >
                    {getFileIcon(material.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{material.title}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {material.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {material.size}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {material.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(material.uploadDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {material.downloads} downloads
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No materials found</h3>
            <p className="mb-4 text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Start by uploading your first material."}
            </p>
            <Button onClick={openMaterialModal}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
