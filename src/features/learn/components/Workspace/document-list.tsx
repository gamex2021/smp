"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FileText, Search, Filter, MoreHorizontal, Plus, Download, Trash, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "convex/react"
import { Progress } from "@/components/ui/progress"
import { type Id } from "~/_generated/dataModel"
import { api } from "~/_generated/api"
import { toast } from "sonner"
import { uploadDocument } from "@/app/[domain]/actions/upload-document"

export default function DocumentList({ workspaceId }: { workspaceId: Id<"workspace"> }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedTab, setSelectedTab] = useState("all")
    // Get documents
    const documents = useQuery(api.queries.workspace.getDocmentList, {
        workspaceId
    })

    const filteredDocuments = documents?.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTab =
            selectedTab === "all" ||
            (selectedTab === "pdf" && doc.type === "pdf") ||
            (selectedTab === "docx" &&
                doc.type === "docx") ||
            (selectedTab === "pptx" &&
                doc.type === "pptx") ||
            (selectedTab === "xlsx" && doc.type === "xlsx")

        return matchesSearch && matchesTab
    })

    const handleFileDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) {
            setSelectedFile(file)
        }
    }, [])

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }, [])

    const handleUpload = async () => {
        if (!selectedFile) return

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]

        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error("Only PDF, DOCX, PPTX, and XLSX files are allowed.")
            return
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            toast.error("Maximum file size is 50MB.")
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("workspaceId", workspaceId)

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return prev + 10
                })
            }, 3000)

            const result = await uploadDocument(formData)

            clearInterval(progressInterval)
            setUploadProgress(100)

            if (result?.success) {
                toast.success("Document uploaded successfully")
                setIsUploadDialogOpen(false)
                setSelectedFile(null)
            } else {
                throw new Error(result?.error)
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error(error instanceof Error ? error.message : "There was an error uploading your document.")
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    function formatFileSize(bytes: number) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle>Documents</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search documents..."
                                className="pl-8 w-[200px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Upload
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Document</DialogTitle>
                                    <DialogDescription>Upload a document to add to this workspace</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    {!selectedFile ? (
                                        <div
                                            className="border-2 border-dashed rounded-lg p-6 text-center"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleFileDrop}
                                        >
                                            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                                            <p className="mb-2 text-sm font-medium">Drag & drop your file here</p>
                                            <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, PPTX, and XLSX</p>
                                            <Input
                                                type="file"
                                                accept=".pdf,.docx,.pptx,.xlsx"
                                                className="hidden"
                                                id="file-upload"
                                                onChange={handleFileSelect}
                                            />
                                            <Button size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                                                Browse Files
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 rounded-lg border">
                                                <FileText className="h-8 w-8 text-primary" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {isUploading ? (
                                                <div className="space-y-2">
                                                    <Progress value={uploadProgress} className="w-full" />
                                                    <p className="text-sm text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
                                                </div>
                                            ) : (
                                                <Button className="w-full" onClick={handleUpload}>
                                                    Upload Document
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    <div className="text-sm text-muted-foreground">
                                        <p>Maximum file size: 50MB</p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pdf">PDF</TabsTrigger>
                        <TabsTrigger value="docx">Word</TabsTrigger>
                        <TabsTrigger value="pptx">PowerPoint</TabsTrigger>
                        <TabsTrigger value="xlsx">Excel</TabsTrigger>
                    </TabsList>

                    {filteredDocuments?.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No documents found matching your search.</p>
                        </div>
                    ) : (
                        <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
                            {filteredDocuments?.map((doc) => (
                                <motion.div key={doc._id} variants={item}>
                                    <Link href={`/learn/document/${doc._id}`}>
                                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative h-12 w-16 overflow-hidden rounded">
                                                    <Image
                                                        src={doc.thumbnail ?? "/images/placeholder.svg?height=48&width=64"}
                                                        alt={doc.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{doc.title}</h4>
                                                    <div className="flex items-center text-xs text-muted-foreground space-x-3">
                                                        <span className="uppercase">{doc.type}</span>
                                                        <span>•</span>
                                                        <span>{doc.size}</span>
                                                        <span>•</span>
                                                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Rename</DropdownMenuItem>
                                                        <DropdownMenuItem>Move to Another Workspace</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </Tabs>
            </CardContent>
        </Card>
    )
}

