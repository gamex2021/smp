"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { RotateCw, Printer, Search, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DocumentViewerProps {
    document: {
        id: string
        title: string
        content: string
        pages: number
        annotations: Array<{
            id: string
            text: string
            page: number
            position: { x: number; y: number }
            color: string
        }>
    }
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [zoom, setZoom] = useState(100)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const handleZoomIn = () => {
        setZoom(Math.min(zoom + 10, 200))
    }

    const handleZoomOut = () => {
        setZoom(Math.max(zoom - 10, 50))
    }

    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = Number.parseInt(e.target.value)
        if (!isNaN(page) && page >= 1 && page <= document.pages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="border-b p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-20 text-center text-sm">{zoom}%</div>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-r-none"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage <= 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center border-y px-2 h-9">
                            <Input
                                type="number"
                                min={1}
                                max={document.pages}
                                value={currentPage}
                                onChange={handlePageChange}
                                className="w-12 h-7 text-center border-0 p-0"
                            />
                            <span className="text-muted-foreground text-sm">/ {document.pages}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-l-none"
                            onClick={() => setCurrentPage(Math.min(document.pages, currentPage + 1))}
                            disabled={currentPage >= document.pages}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Printer className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isSearchOpen && (
                <motion.div
                    className="border-b p-2 flex items-center gap-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                >
                    <Input placeholder="Search in document..." className="w-full" />
                    <Button size="sm">Find</Button>
                </motion.div>
            )}

            <div className="flex-1 overflow-auto bg-muted/30 p-8 flex justify-center">
                <div
                    className="bg-white shadow-lg rounded-md overflow-hidden"
                    style={{
                        width: `${(8.5 * zoom) / 100}in`,
                        height: `${(11 * zoom) / 100}in`,
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: "top center",
                    }}
                >
                    <div className="p-8 h-full">
                        <h2 className="text-2xl font-bold mb-4">{document.title}</h2>
                        <p className="text-muted-foreground mb-4">
                            Page {currentPage} of {document.pages}
                        </p>

                        <div className="prose max-w-none">
                            <p>{document.content}</p>

                            {/* Placeholder content */}
                            <h3>Section {currentPage}.1</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies,
                                nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                            </p>

                            <h3>Section {currentPage}.2</h3>
                            <p>
                                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                                tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
                            </p>

                            {/* Display annotations for current page */}
                            {document.annotations
                                .filter((annotation) => annotation.page === currentPage)
                                .map((annotation) => (
                                    <div
                                        key={annotation.id}
                                        className="absolute p-2 rounded-md"
                                        style={{
                                            left: `${annotation.position.x}px`,
                                            top: `${annotation.position.y}px`,
                                            backgroundColor: `${annotation.color}20`,
                                            borderLeft: `3px solid ${annotation.color}`,
                                        }}
                                    >
                                        <p className="text-sm">{annotation.text}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

