"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Sparkles, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface QuestionsToolProps {
    workspaceId?: string
}

export default function QuestionsTool({ workspaceId }: QuestionsToolProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [activeTab, setActiveTab] = useState("all")
    const [showAnswer, setShowAnswer] = useState<string | null>(null)

    const questions = [
        {
            id: "1",
            question: "What is the primary function of the cell membrane?",
            answer:
                "The primary function of the cell membrane is to regulate what enters and exits the cell, maintaining the cell's internal environment through selective permeability.",
            type: "concept",
            difficulty: "medium",
            createdAt: "2023-08-01T15:20:00Z",
        },
        {
            id: "2",
            question: "Explain the process of DNA replication in eukaryotic cells.",
            answer:
                "DNA replication in eukaryotic cells is a complex process that involves multiple enzymes and occurs during the S phase of the cell cycle. It includes unwinding of the DNA double helix, synthesis of new strands, and proofreading to ensure accuracy.",
            type: "process",
            difficulty: "hard",
            createdAt: "2023-07-29T10:15:00Z",
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
                        <CardTitle>Generate Questions</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Question Generation Settings</DialogTitle>
                                    <DialogDescription>Customize your question generation preferences</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Question Types</label>
                                        <Select defaultValue="all">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="concept">Conceptual</SelectItem>
                                                <SelectItem value="process">Process-based</SelectItem>
                                                <SelectItem value="application">Application</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Difficulty Level</label>
                                        <Select defaultValue="mixed">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                                <SelectItem value="mixed">Mixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Number of Questions</label>
                                        <Select defaultValue="10">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5 questions</SelectItem>
                                                <SelectItem value="10">10 questions</SelectItem>
                                                <SelectItem value="15">15 questions</SelectItem>
                                                <SelectItem value="20">20 questions</SelectItem>
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
                                <label className="text-sm font-medium">Topic Focus (Optional)</label>
                                <Input placeholder="Enter specific topics to focus on" />
                            </div>
                        </div>

                        {isGenerating ? (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-center text-muted-foreground">Generating questions... {progress}%</p>
                            </div>
                        ) : (
                            <Button className="w-full" onClick={handleGenerate}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Questions
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Generated Questions</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                            <DropdownMenuItem>Export as Word Document</DropdownMenuItem>
                            <DropdownMenuItem>Copy to Clipboard</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Questions</TabsTrigger>
                        <TabsTrigger value="concept">Conceptual</TabsTrigger>
                        <TabsTrigger value="process">Process-based</TabsTrigger>
                        <TabsTrigger value="application">Application</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 space-y-4">
                        {questions.map((question) => (
                            <Card key={question.id}>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="capitalize">
                                                    {question.type}
                                                </Badge>
                                                <Badge variant="outline" className="capitalize">
                                                    {question.difficulty}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-medium">Q: {question.question}</h3>
                                            {showAnswer === question.id ? (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="pl-4 border-l-2 border-primary"
                                                >
                                                    <p className="text-muted-foreground">A: {question.answer}</p>
                                                </motion.div>
                                            ) : null}
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setShowAnswer(showAnswer === question.id ? null : question.id)}
                                            >
                                                {showAnswer === question.id ? "Hide Answer" : "Show Answer"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

