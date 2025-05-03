"use client"

import { useState } from "react"
import {
    Upload,
    Settings,
    Sparkles,
    Download,
    Copy,
    MoreHorizontal,
    Search,
    BookOpen,
    Tag,
    RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { readStreamableValue } from 'ai/rsc';
import { type Id } from "~/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { extractTopics, generateSummary } from "@/app/[domain]/actions/generate-summary"
import ReactMarkdown from "react-markdown"


interface SummariesToolProps {
    workspaceId?: Id<"workspace">
}

export default function SummariesTool({ workspaceId }: SummariesToolProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [summaryMode, setSummaryMode] = useState<"full" | "topic">("full")
    const [topicInput, setTopicInput] = useState("")
    const [selectedDocument, setSelectedDocument] = useState<Id<"document"> | null>(null)
    const [extractedTopics, setExtractedTopics] = useState<{ title: string }[]>()
    const [selectedTopic, setSelectedTopic] = useState("")
    const [isExtractingTopics, setIsExtractingTopics] = useState(false)
    const [summaries, setSummaries] = useState<{
        id: string;
        title: string;
        originalLength: string;
        summaryLength: string;
        createdAt: string;
        topic: string;
        content: string;
    }[]>([])

    // get the workspace
    const workspace = useQuery(api.queries.workspace.getWorkspaceById, workspaceId ? { workspaceId } : "skip")

    // get the documents in the workspace
    const documents = useQuery(
        api.queries.workspace.getDocmentList,
        workspace?._id ? { workspaceId: workspace?._id } : "skip",
    )


    // handle generate summary
    const handleGenerate = async () => {
        if (!selectedDocument) {
            toast.error("A document should be chosen first")
            return
        }

        setIsGenerating(true)
        const newSummary = {
            id: (summaries.length + 1).toString(),
            title: selectedTopic ?? "Generate summary",
            originalLength: "15 pages",
            summaryLength: summaryMode === "topic" ? "0.5 pages" : "2 pages",
            createdAt: new Date().toISOString(),
            topic: summaryMode === "topic" ? selectedTopic || topicInput : "Full Document",
            content: "",
        }
        setSummaries([newSummary, ...summaries])

        try {
            const { output } = await generateSummary(selectedDocument, summaryMode === "topic" && selectedTopic || topicInput);

            for await (const delta of readStreamableValue(output)) {
                console.log("this is the stream value :", delta)
                setSummaries((prev) =>
                    prev.map((s) =>
                        s.id === newSummary.id
                            ? { ...s, content: s.content + `${delta}` }
                            : s
                    )
                );
            }
            // Add a new summary


            setIsGenerating(false)
        } catch (err) {
            toast.error("Could not generate a summary at this time ");
            setIsExtractingTopics(false)
        }
    }

    // extract the topics from the document
    const handleExtractTopics = async () => {
        if (!selectedDocument) {
            toast.error("A document should be chosen first")
            return
        }
        setIsExtractingTopics(true)
        try {
            const { object } = await extractTopics(selectedDocument);

            for await (const partialObject of readStreamableValue(object)) {
                if (partialObject) {
                    setExtractedTopics((partialObject as { topics: { title: string }[] })?.topics || [])
                }
            }
            setIsExtractingTopics(false)
        } catch (err) {
            toast.error("Cannot extract topics at this time");
            setIsExtractingTopics(false)
        }
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Generate Summary</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Settings
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Summary Settings</DialogTitle>
                                                <DialogDescription>Customize how your summaries are generated</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Summary Length</label>
                                                    <Select defaultValue="medium">
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="short">Short (25% of original)</SelectItem>
                                                            <SelectItem value="medium">Medium (15% of original)</SelectItem>
                                                            <SelectItem value="long">Long (10% of original)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Style</label>
                                                    <Select defaultValue="bullet">
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="bullet">Bullet Points</SelectItem>
                                                            <SelectItem value="paragraph">Paragraphs</SelectItem>
                                                            <SelectItem value="outline">Outline</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Focus Areas</label>
                                                    <Select defaultValue="key-concepts">
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="key-concepts">Key Concepts</SelectItem>
                                                            <SelectItem value="definitions">Definitions</SelectItem>
                                                            <SelectItem value="examples">Examples</SelectItem>
                                                            <SelectItem value="all">All Content</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor="auto-extract" className="text-sm font-medium">
                                                            Auto-extract Topics
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground">
                                                            Automatically identify key topics in documents
                                                        </span>
                                                    </div>
                                                    <Switch id="auto-extract" defaultChecked />
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Customize summary settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium">Select Document</label>
                                <Select
                                    value={selectedDocument ?? undefined}
                                    onValueChange={(e: Id<"document">) => setSelectedDocument(e)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a document" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documents?.map((document) => (
                                            <SelectItem key={document?._id} value={document?._id}>
                                                {document?.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Or Upload New Document</label>
                                <div className="flex gap-2">
                                    <Input type="file" className="flex-1" />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Upload document</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="full" onValueChange={(value) => setSummaryMode(value as "full" | "topic")}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="full">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Full Document
                                </TabsTrigger>
                                <TabsTrigger value="topic">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Specific Topic
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="full" className="pt-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Generate a summary of the entire document, covering all key points.
                                </p>
                            </TabsContent>
                            <TabsContent value="topic" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Enter Topic or Select from Extracted Topics</label>
                                        <Button variant="outline" size="sm" onClick={handleExtractTopics} disabled={isExtractingTopics}>
                                            {isExtractingTopics ? (
                                                <>
                                                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                                                    Extracting...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="h-3 w-3 mr-2" />
                                                    Extract Topics
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Enter a topic (e.g., Cell Membrane, DNA Replication)"
                                        value={topicInput}
                                        onChange={(e) => setTopicInput(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Extracted Topics</label>
                                    <div className="flex flex-wrap gap-2">
                                        {extractedTopics?.map((topic, index) => (
                                            <Badge
                                                key={index}
                                                variant={selectedTopic === topic?.title ? "default" : "outline"}
                                                className="cursor-pointer hover:bg-primary/10"
                                                onClick={() => {
                                                    setSelectedTopic(selectedTopic === topic?.title ? "" : topic?.title)
                                                    if (selectedTopic !== topic?.title) {
                                                        setTopicInput("")
                                                    }
                                                }}
                                            >
                                                {topic?.title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {isGenerating ? (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-center text-muted-foreground">
                                    Generating summary{summaryMode === "topic" ? ` for "${selectedTopic || topicInput}"` : ""}...{" "}
                                    {progress}%
                                </p>
                            </div>
                        ) : (
                            <Button
                                className="w-full"
                                onClick={handleGenerate}
                                disabled={summaryMode === "topic" && !topicInput && !selectedTopic}
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate {summaryMode === "topic" ? "Topic" : "Full"} Summary
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Summaries</h2>
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search summaries..."
                            className="pl-10"
                        />
                    </div>
                </div>

                {summaries.map((summary) => (
                    <Card key={summary.id} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>{summary.title}</CardTitle>
                                        <Badge variant="outline">{summary.topic}</Badge>
                                    </div>
                                    <div className="flex gap-2 text-sm text-muted-foreground">
                                        <span>Original: {summary.originalLength}</span>
                                        <span>•</span>
                                        <span>Summary: {summary.summaryLength}</span>
                                        <span>•</span>
                                        <span>Created {new Date(summary.createdAt).toLocaleDateString()}</span>
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
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy to Clipboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Share Summary</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Delete Summary</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none dark:prose-invert">
                                <div className="text-sm whitespace-pre-wrap font-sans">
                                    <ReactMarkdown>
                                        {summary.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                                <RefreshCw className="h-3 w-3 mr-2" />
                                Regenerate
                            </Button>
                            <Button size="sm">
                                <Copy className="h-3 w-3 mr-2" />
                                Copy
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

