"use client"

import { useState } from "react"
import { Settings, Sparkles, Download, Copy, MoreHorizontal, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NotesToolProps {
    workspaceId?: string
}

export default function NotesTool({ workspaceId }: NotesToolProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [activeTab, setActiveTab] = useState("all")
    const [isEditMode, setIsEditMode] = useState(false)

    const notes = [
        {
            id: "1",
            title: "Cell Biology Key Concepts",
            content: `# Cell Biology Fundamentals

## Cell Structure
- Cell membrane: Selectively permeable barrier
- Cytoplasm: Gel-like substance containing organelles
- Nucleus: Contains genetic material

## Organelles
1. Mitochondria
   - "Powerhouse of the cell"
   - Produces ATP through cellular respiration

2. Endoplasmic Reticulum
   - Rough ER: Protein synthesis
   - Smooth ER: Lipid synthesis

3. Golgi Apparatus
   - Modifies, packages, and distributes proteins
   - Creates lysosomes

## Cell Functions
* Energy production
* Protein synthesis
* Waste management
* Cell division`,
            type: "notes",
            createdAt: "2023-08-01T15:20:00Z",
            lastEdited: "2023-08-02T10:30:00Z",
        },
        {
            id: "2",
            title: "DNA Replication Process",
            content: "Note content here...",
            type: "summary",
            createdAt: "2023-07-29T10:15:00Z",
            lastEdited: "2023-07-29T10:15:00Z",
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

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Generate Notes</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Notes Settings</DialogTitle>
                                    <DialogDescription>Customize how your study notes are generated</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Note Format</label>
                                        <Select defaultValue="markdown">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="markdown">Markdown</SelectItem>
                                                <SelectItem value="outline">Outline</SelectItem>
                                                <SelectItem value="cornell">Cornell Method</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Organization Style</label>
                                        <Select defaultValue="hierarchical">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hierarchical">Hierarchical</SelectItem>
                                                <SelectItem value="sequential">Sequential</SelectItem>
                                                <SelectItem value="concept-map">Concept Map</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Include Elements</label>
                                        <Select defaultValue="all">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Elements</SelectItem>
                                                <SelectItem value="key-concepts">Key Concepts Only</SelectItem>
                                                <SelectItem value="examples">With Examples</SelectItem>
                                                <SelectItem value="definitions">Definitions Only</SelectItem>
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
                                <label className="text-sm font-medium">Note Title</label>
                                <Input placeholder="Enter a title for your notes" />
                            </div>
                        </div>

                        {isGenerating ? (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-center text-muted-foreground">Generating notes... {progress}%</p>
                            </div>
                        ) : (
                            <Button className="w-full" onClick={handleGenerate}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Notes
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Notes</h2>
                    <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Manual Notes
                    </Button>
                </div>

                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Notes</TabsTrigger>
                        <TabsTrigger value="generated">AI Generated</TabsTrigger>
                        <TabsTrigger value="manual">Manual Notes</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 space-y-4">
                        {notes.map((note) => (
                            <Card key={note.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle>{note.title}</CardTitle>
                                            <div className="flex gap-2 text-sm text-muted-foreground">
                                                <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>Last edited {new Date(note.lastEdited).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit Notes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy to Clipboard
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Delete Notes</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isEditMode ? (
                                        <div className="space-y-4">
                                            <Textarea defaultValue={note.content} className="min-h-[300px] font-mono" />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => setIsEditMode(false)}>Save Changes</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose max-w-none dark:prose-invert">
                                            <pre className="text-sm whitespace-pre-wrap font-sans">{note.content}</pre>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

