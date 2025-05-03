"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function UploadSection() {
    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files)
            setFiles([...files, ...newFiles])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            setFiles([...files, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    const uploadFiles = () => {
        setUploading(true)

        // Simulate upload progress
        let currentProgress = 0
        const interval = setInterval(() => {
            currentProgress += 5
            setProgress(currentProgress)

            if (currentProgress >= 100) {
                clearInterval(interval)
                setTimeout(() => {
                    setUploading(false)
                    setFiles([])
                    setProgress(0)
                }, 500)
            }
        }, 200)
    }

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Upload Documents</h2>

            <Card
                className={`border-2 ${isDragging ? "border-primary border-dashed bg-primary/5" : "border-dashed"
                    } transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 rounded-full bg-primary/10 p-4"
                    >
                        <Upload className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="mb-2 text-lg font-medium">Drag & drop your documents here</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Support for PDF, DOCX, TXT, and more. Max file size: 50MB
                    </p>
                    <label htmlFor="file-upload">
                        <Button as="span" className="cursor-pointer">
                            Browse Files
                        </Button>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.doc,.txt,.ppt,.pptx"
                        />
                    </label>
                </CardContent>
            </Card>

            {files.length > 0 && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                >
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {uploading ? (
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2 w-full" />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Uploading... {progress}%</span>
                                <span>
                                    {files.length} file{files.length > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={uploadFiles} className="w-full">
                            Upload {files.length} file{files.length > 1 ? "s" : ""}
                        </Button>
                    )}
                </motion.div>
            )}
        </section>
    )
}

