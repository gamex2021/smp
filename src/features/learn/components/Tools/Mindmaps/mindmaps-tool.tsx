"use client"

import { useState } from "react"
import { Settings, Sparkles, Download, Share2, MoreHorizontal, Plus, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface MindmapsToolProps {
    workspaceId?: string
}

export default function MindmapsTool({ workspaceId }: MindmapsToolProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [zoom, setZoom] = useState(100)

    const mindmaps = [
        {
            id: "1",
            title: "Cell Biology Overview",
            nodes: 24,
            connections: 35,
            createdAt: "2023-08-01T15:20:00Z",
            lastEdited: "2023-08-02T10:30:00Z",
            thumbnail: "/placeholder.svg?height=200&width=400",
        },
        {
            id: "2",
            title: "DNA Replication Process",
            nodes: 18,
            connections: 25,
            createdAt: "2023-07-29T10:15:00Z",
            lastEdited: "2023-07-29T10:15:00Z",
            thumbnail: "/placeholder.svg?height=200&width=400",
        },
    ]

    const handleGenerate = () => {
        setIsGenerating(true)
        let currentProgress = 0
        const interval = setInterval(() => {
            currentProgress += 5
            setProgress(currentProgress)
            if (currentProgress >= 100) {
                clearInterval(interval)
                setIsGenerating(false)
                setProgress(0)
            }
        }, 200)
    }

    const handleZoomIn = () => {
        setZoom(Math.min(zoom + 10, 200))
    }

    const handleZoomOut = () => {
        setZoom(Math.max(zoom - 10, 50))
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Generate Mind Map</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Mind Map Settings</DialogTitle>
                                    <DialogDescription>Customize your mind map generation preferences</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Layout Style</label>
                                        <Select defaultValue="radial">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="radial">Radial</SelectItem>
                                                <SelectItem value="hierarchical">Hierarchical</SelectItem>
                                                <SelectItem value="force">Force-Directed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Color Scheme</label>
                                        <Select defaultValue="default">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default</SelectItem>
                                                <SelectItem value="monochrome">Monochrome</SelectItem>
                                                <SelectItem value="rainbow">Rainbow</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Detail Level</label>
                                        <Select defaultValue="medium">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Basic Concepts</SelectItem>
                                                <SelectItem value="medium">Detailed</SelectItem>
                                                <SelectItem value="high">Very Detailed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium">Select Document</label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a document" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="doc1">Cell Biology Chapter 1.pdf</SelectItem>
                                        <SelectItem value="doc2">DNA Replication.docx</SelectItem>
                                        <SelectItem value="doc3">Genetics Notes.pdf</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Mind Map Title</label>
                                <Input placeholder="Enter a title for your mind map" />
                            </div>
                        </div>

                        {isGenerating ? (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-center text-muted-foreground">Generating mind map... {progress}%</p>
                            </div>
                        ) : (
                            <Button className="w-full" onClick={handleGenerate}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Mind Map
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Mind Maps</h2>
                    <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Empty Mind Map
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {mindmaps.map((mindmap) => (
                        <Card key={mindmap.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>{mindmap.title}</CardTitle>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                            <span>{mindmap.nodes} nodes</span>
                                            <span>•</span>
                                            <span>{mindmap.connections} connections</span>
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
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download as Image
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Delete Mind Map</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                    <img
                                        src={mindmap.thumbnail || "/placeholder.svg"}
                                        alt={mindmap.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2 flex gap-1">
                                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                                            <ZoomOut className="h-4 w-4" />
                                        </Button>
                                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Last edited {new Date(mindmap.lastEdited).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

