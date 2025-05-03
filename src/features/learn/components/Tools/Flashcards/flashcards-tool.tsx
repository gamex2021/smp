"use client"

import { useState, useEffect } from "react"
import { Layers, Plus, Sparkles, Check, X, Edit, Trash, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import type { Id } from "~/_generated/dataModel"
import { cn } from "@/lib/utils"
import { api } from "~/_generated/api"
import { useQuery } from "convex/react"
import { toast } from "sonner"
import { extractTopics } from "@/app/[domain]/actions/generate-summary"
import { readStreamableValue } from "ai/rsc"
import { generateFlashcards } from "@/app/[domain]/actions/generate-flashcards"

interface FlashcardsToolProps {
    workspaceId?: Id<"workspace">
}


type Flash = {
    flashcards: {
        id: string;
        front: string;
        back: string;
    }[];
}

type FlashCard = ({
    id: string;
    title: string;
    description: string;
    cardCount: number;
    lastStudied: string;
    progress: number;
    flashcards: {
        id: string;
        front: string;
        back: string;
    }[];
} | {
    id: string;
    title: string;
    description: string;
    cardCount: number;
    lastStudied: string;
    progress: number;
    flashcards?: undefined;
})

export default function FlashcardsTool({ workspaceId }: FlashcardsToolProps) {
    // get the workspace
    const workspace = useQuery(api.queries.workspace.getWorkspaceById, workspaceId ? { workspaceId } : "skip")

    // get the documents in the workspace
    const documents = useQuery(
        api.queries.workspace.getDocmentList,
        workspace?._id ? { workspaceId: workspace?._id } : "skip",
    )

    const [selectedDocument, setSelectedDocument] = useState<Id<"document"> | null>(null)
    const [extractedTopics, setExtractedTopics] = useState<{ title: string }[]>()
    const [selectedTopic, setSelectedTopic] = useState("")
    const [flashcardSets, setFlashcardSets] = useState<FlashCard[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
    const [isStudyMode, setIsStudyMode] = useState(false)
    const [currentSetId, setCurrentSetId] = useState<string | null>(null)
    const [numCards, setNumCards] = useState("10")
    const [animateProgress, setAnimateProgress] = useState(0)

    const [isExtracting, setIsExtracting] = useState(false)
    const [customTopic, setCustomTopic] = useState("")
    const [setName, setSetName] = useState("")

    // Study mode states
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [studyProgress, setStudyProgress] = useState(0)
    const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)
    const [isAnswerVisible, setIsAnswerVisible] = useState(false)

    // Mock flashcards for the selected set
    const flashcards = [
        {
            id: "1",
            front: "What is a cell?",
            back: "The basic structural, functional, and biological unit of all known organisms.",
        },
        {
            id: "2",
            front: "What is the function of the cell membrane?",
            back: "To regulate what enters and exits the cell and to protect the cell from its surroundings.",
        },
        {
            id: "3",
            front: "What is the powerhouse of the cell?",
            back: "Mitochondria",
        },
        {
            id: "4",
            front: "What is the function of the nucleus?",
            back: "To maintain the integrity of genes and to control cellular activities by regulating gene expression.",
        },
        {
            id: "5",
            front: "What is the endoplasmic reticulum?",
            back: "A network of membranous tubules within the cytoplasm of a eukaryotic cell, involved in protein and lipid synthesis.",
        },
    ]

    // Animate progress bar on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateProgress(100)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    const handleStartStudy = (setId: string) => {
        setCurrentSetId(setId)
        setCurrentCardIndex(0)
        setIsFlipped(false)
        setStudyProgress(0)
        setAnimateProgress(0)
        setIsStudyMode(true)

        // Animate progress after transition
        setTimeout(() => {
            setAnimateProgress(100)
        }, 500)
    }

    const handleNextCard = (known: boolean) => {
        // In a real app, you would track which cards the user knows/doesn't know
        setSlideDirection("left")
        setIsAnswerVisible(false)

        setTimeout(() => {
            if (currentCardIndex < flashcards.length - 1) {
                setCurrentCardIndex(currentCardIndex + 1)
                const newProgress = Math.round(((currentCardIndex + 1) / flashcards.length) * 100)
                setStudyProgress(newProgress)
                setSlideDirection(null)
            } else {
                // End of study session
                setStudyProgress(100)
                setTimeout(() => {
                    setIsStudyMode(false)
                    setCurrentSetId(null)
                }, 1000)
            }
        }, 300)
    }

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setSlideDirection("right")
            setIsAnswerVisible(false)

            setTimeout(() => {
                setCurrentCardIndex(currentCardIndex - 1)
                const newProgress = Math.round(((currentCardIndex - 1) / flashcards.length) * 100)
                setStudyProgress(newProgress)
                setSlideDirection(null)
            }, 300)
        }
    }

    const handleCreateSet = () => {
        // In a real app, you would save the new set to the backend
        setIsCreateDialogOpen(false)
    }

    const handleGenerateSet = async () => {
        if (!selectedDocument) {
            toast.error("Select document")
            return
        }
        // In a real app, you would generate flashcards using AI
        // based on the selected document and topic
        const topicUsed = selectedTopic ?? customTopic ?? "Entire Document"

        try {
            // call server to generate flashcards
            const { object } = await generateFlashcards(selectedDocument, numCards, topicUsed)

            const newFlashCard: FlashCard = {
                id: `${topicUsed}-${Date.now()}`,
                cardCount: +numCards,
                description: `Flascards on ${setName ?? selectedTopic ?? customTopic ?? ""}`,
                lastStudied: "20/34/2002",
                progress: 45,
                title: setName ?? selectedTopic ?? customTopic ?? "",
                flashcards: []
            }

            setFlashcardSets([...flashcardSets, newFlashCard])

            // process the streamin flashcards data
            for await (const partialFlashCard of readStreamableValue(object)) {
                if ((partialFlashCard as Flash)?.flashcards) {
                    // Update the new quiz with the latest questions
                    newFlashCard.flashcards = [...(partialFlashCard as Flash).flashcards]

                    setFlashcardSets((prev) =>
                        prev.map((flashcardset) => {
                            if (flashcardset.id === newFlashCard.id) return newFlashCard
                            return flashcardset
                        })
                    )
                }

            }

        } catch (err) {
            console.error("Error generating flashcards:", err)
            toast.error("Failed to generate flashcards")
        }

        // Reset states
        setIsGenerateDialogOpen(false)
        setExtractedTopics([])
        setSelectedTopic("")
        setCustomTopic("")
        setSetName("")
        setIsExtracting(false)
    }

    const handleViewAnswer = () => {
        setIsFlipped(true)
        setIsAnswerVisible(true)
    }


    // extract the topics from the document
    const handleExtractTopics = async () => {
        if (!selectedDocument) {
            toast.error("Select document")
            return
        }

        setIsExtracting(true)
        try {
            const { object } = await extractTopics(selectedDocument);

            for await (const partialObject of readStreamableValue(object)) {
                if (partialObject) {
                    setExtractedTopics((partialObject as { topics: { title: string }[] })?.topics || [])
                }
            }
            setIsExtracting(false)
        } catch (err) {
            toast.error("Cannot extract topics at this time");
            setIsExtracting(false)
        }
    }

    return (
        <div className="space-y-8">
            {!isStudyMode ? (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold animate-slide-in-from-left">Your Flashcard Sets</h2>
                        <div className="flex gap-2 animate-slide-in-from-right">
                            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="transition-all duration-300 hover:scale-105">
                                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                                        Generate from Document
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="animate-fade-in-up max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Generate Flashcards</DialogTitle>
                                        <DialogDescription>Use AI to generate flashcards from your documents</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                                            <label className="text-sm font-medium">Select Document</label>
                                            <Select
                                                value={selectedDocument ?? undefined}
                                                onValueChange={(e: Id<"document">) => setSelectedDocument(e)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a document" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-48">
                                                    {documents?.map((document) => (
                                                        <SelectItem key={document?._id} value={document?._id}>
                                                            {document?.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">Topic Selection</label>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={(extractedTopics?.length ?? 0) > 0}
                                                    className="h-8 animate-pulse-slow hover:animate-none"
                                                    onClick={handleExtractTopics}
                                                >
                                                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                                                    Extract Topics
                                                </Button>
                                            </div>

                                            {isExtracting ? (
                                                <div className="p-4 border rounded-md bg-muted/50 animate-pulse">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Sparkles className="h-4 w-4 animate-spin" />
                                                        <p className="text-sm">Extracting topics from document...</p>
                                                    </div>
                                                </div>
                                            ) : extractedTopics && extractedTopics?.length > 0 ? (
                                                <div className="space-y-2 animate-fade-in">
                                                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-1">
                                                        {extractedTopics?.map((topic, index) => (
                                                            <div
                                                                key={index}
                                                                className={cn(
                                                                    "flex items-center p-2 rounded-md border cursor-pointer transition-all duration-200 hover:bg-primary/10",
                                                                    selectedTopic === topic?.title ? "bg-primary/20 border-primary" : "bg-card",
                                                                )}
                                                                onClick={() => setSelectedTopic(topic?.title)}
                                                            >
                                                                <div className="flex-1">{topic?.title}</div>
                                                                {selectedTopic === topic?.title && <Check className="h-4 w-4 text-primary animate-fade-in" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-px flex-1 bg-border" />
                                                        <span className="text-xs text-muted-foreground">or</span>
                                                        <div className="h-px flex-1 bg-border" />
                                                    </div>
                                                </div>
                                            ) : null}

                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder="Enter a custom topic (optional)"
                                                        value={customTopic}
                                                        onChange={(e) => {
                                                            setCustomTopic(e.target.value)
                                                            if (e.target.value) {
                                                                setSelectedTopic("")
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "whitespace-nowrap transition-all duration-300",
                                                        selectedTopic || customTopic ? "opacity-50" : "opacity-100",
                                                    )}
                                                    onClick={() => {
                                                        setSelectedTopic("")
                                                        setCustomTopic("")
                                                    }}
                                                >
                                                    Entire Document
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                                            <label className="text-sm font-medium">Number of Cards</label>
                                            <Select onValueChange={(e) => { setNumCards(e) }} defaultValue="10">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10 cards</SelectItem>
                                                    <SelectItem value="20">20 cards</SelectItem>
                                                    <SelectItem value="30">30 cards</SelectItem>
                                                    <SelectItem value="40">40 cards</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
                                            <label className="text-sm font-medium">Flashcard Set Name</label>
                                            <Input
                                                placeholder="Enter a name for this set"
                                                value={setName || selectedTopic || customTopic || ""}
                                                onChange={(e) => setSetName(e.target.value)}
                                            />
                                        </div>

                                        <Button className="w-full animate-pulse-slow hover:animate-none mt-2" onClick={handleGenerateSet}>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate Flashcards
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="transition-all duration-300 hover:scale-105">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Set
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="animate-fade-in-up">
                                    <DialogHeader>
                                        <DialogTitle>Create Flashcard Set</DialogTitle>
                                        <DialogDescription>Create a new set of flashcards for studying</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                                            <label className="text-sm font-medium">Set Name</label>
                                            <Input placeholder="Enter a name for this set" />
                                        </div>
                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea placeholder="Enter a description" />
                                        </div>
                                        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                                            <label className="text-sm font-medium">Workspace</label>
                                            <Select defaultValue={workspaceId ?? ""}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a workspace" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Biology 101</SelectItem>
                                                    <SelectItem value="2">World History</SelectItem>
                                                    <SelectItem value="3">Calculus II</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button className="w-full animate-pulse-slow hover:animate-none" onClick={handleCreateSet}>
                                            Create Flashcard Set
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="border-dashed cursor-pointer hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in-up">
                            <CardContent className="flex flex-col items-center justify-center h-[200px] p-6">
                                <Layers className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors animate-float" />
                                <p className="mt-4 text-muted-foreground group-hover:text-primary transition-colors">
                                    Create New Flashcard Set
                                </p>
                                <Button
                                    variant="ghost"
                                    className="mt-4 animate-pulse-slow hover:animate-none"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Set
                                </Button>
                            </CardContent>
                        </Card>

                        {flashcardSets.map((set, index) => (
                            <Card
                                key={set.id}
                                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                                style={{ animationDelay: `${(index + 1) * 100}ms` }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-medium text-lg">{set.title}</h3>
                                            <p className="text-sm text-muted-foreground">{set.description}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 transition-all duration-300 hover:bg-muted"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="animate-fade-in-down">
                                                <DropdownMenuItem className="transition-colors duration-300 hover:bg-muted">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Set
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="transition-colors duration-300 hover:bg-muted">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Cards
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive transition-colors duration-300 hover:bg-destructive/10">
                                                    <Trash className="h-4 w-4 mr-2" />
                                                    Delete Set
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span>{set.cardCount} cards</span>
                                            <span>{set.progress}% mastered</span>
                                        </div>
                                        <Progress value={set.progress} className="h-2 transition-all duration-1000" />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">
                                            Last studied: {new Date(set.lastStudied).toLocaleDateString()}
                                        </span>
                                        <Button
                                            onClick={() => handleStartStudy(set.id)}
                                            className="transition-all duration-300 hover:scale-105"
                                        >
                                            Study Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto animate-fade-in">
                    <div className="flex justify-between items-center mb-6 animate-slide-in-from-top">
                        <div>
                            <h2 className="text-2xl font-bold">{flashcardSets.find((set) => set.id === currentSetId)?.title}</h2>
                            <p className="text-muted-foreground">
                                Card {currentCardIndex + 1} of {flashcardSets.find((set) => set.id === currentSetId)?.flashcards?.length}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsStudyMode(false)}
                            className="transition-all duration-300 hover:scale-105"
                        >
                            Exit Study Mode
                        </Button>
                    </div>

                    <Progress value={studyProgress} className="mb-8 h-2 transition-all duration-1000 ease-in-out" />

                    <div className="relative mb-8">
                        <Card
                            className={cn(
                                "shadow-md hover:shadow-lg transition-all duration-300",
                                slideDirection === "left"
                                    ? "animate-slide-out-to-left"
                                    : slideDirection === "right"
                                        ? "animate-slide-out-to-right"
                                        : "animate-slide-in-from-right",
                            )}
                        >
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    <div className="text-2xl font-medium text-center animate-fade-in">
                                        {flashcardSets.find((set) => set.id === currentSetId)?.flashcards?.[currentCardIndex]?.front ?? "No front text available"}
                                    </div>

                                    {!isFlipped ? (
                                        <div className="flex justify-center mt-6 animate-bounce-slow">
                                            <Button
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleViewAnswer()
                                                }}
                                                className="px-8 transition-all duration-300 hover:scale-105"
                                            >
                                                View Answer
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-6 pt-6 border-t animate-fade-in-up">
                                            <div className="text-xl text-center">{flashcardSets.find((set) => set.id === currentSetId)?.flashcards?.[currentCardIndex]?.back ?? "No back text available"}</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {currentCardIndex > 0 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-110 animate-fade-in"
                                onClick={handlePrevCard}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        )}

                        {currentCardIndex < (flashcardSets.find((set) => set.id === currentSetId)?.flashcards?.length ?? 0) - 1 && isFlipped && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-110 animate-fade-in"
                                onClick={() => {
                                    setIsFlipped(false)
                                    handleNextCard(true)
                                }}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-center gap-4 animate-slide-in-from-bottom">
                        {isFlipped && (
                            <>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-40 border-destructive text-destructive hover:bg-destructive/10 transition-all duration-300 hover:scale-105 animate-fade-in"
                                    onClick={() => {
                                        setIsFlipped(false)
                                        handleNextCard(false)
                                    }}
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    Don&apos;t Know
                                </Button>
                                <Button
                                    size="lg"
                                    className="w-40 transition-all duration-300 hover:scale-105 animate-fade-in"
                                    onClick={() => {
                                        setIsFlipped(false)
                                        handleNextCard(true)
                                    }}
                                >
                                    <Check className="h-5 w-5 mr-2" />
                                    Know It
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

