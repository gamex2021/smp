"use client"

import { useState, useEffect } from "react"
import { FlaskConical, Settings, Sparkles, Clock, ChevronRight, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Id } from "~/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { toast } from "sonner"
import { readStreamableValue } from "ai/rsc"
import { generate } from "@/app/[domain]/actions/generate-quiz"

interface QuizzesToolProps {
    workspaceId?: Id<"workspace">
}

type Quiz = {
    id: string;
    title: string;
    questions: {
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
    }[];
};

export default function QuizzesTool({ workspaceId }: QuizzesToolProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isQuizActive, setIsQuizActive] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<Id<"document"> | null>(null)
    const [score, setScore] = useState(0)
    const [numQuestions, setNumQuestions] = useState("10")
    const [generatedQuizzes, setGeneratedQuizzes] = useState<Quiz[]>([])
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
    // New state for tracking currently generating quiz
    const [generatingQuiz, setGeneratingQuiz] = useState<Quiz | null>(null)

    // get the workspace
    const workspace = useQuery(api.queries.workspace.getWorkspaceById, workspaceId ? { workspaceId } : "skip")

    // get the documents in the workspace
    const documents = useQuery(
        api.queries.workspace.getDocmentList,
        workspace?._id ? { workspaceId: workspace?._id } : "skip",
    )

    // Reset progress when generation stops
    useEffect(() => {
        if (!isGenerating) {
            setProgress(0)
        }
    }, [isGenerating])

    const handleGenerate = async () => {
        if (!selectedDocument) {
            toast.error("Please select a document")
            return
        }

        setIsGenerating(true)
        let currentProgress = 0

        try {
            const { object } = await generate(selectedDocument, numQuestions)

            // Create a new quiz object to track this generation
            const newQuiz: Quiz = {
                id: `${selectedDocument}-${Date.now()}`,
                title: `Quiz on document (${new Date().toLocaleTimeString()})`,
                questions: [],
            }

            // Set as the currently generating quiz
            setGeneratingQuiz(newQuiz)

            // Process the streaming quiz data
            for await (const partialQuiz of readStreamableValue(object)) {
                console.log("the partial quiz", partialQuiz)
                if ((partialQuiz as Quiz)?.questions) {
                    // Update the new quiz with the latest questions
                    newQuiz.questions = [...(partialQuiz as Quiz).questions]

                    // Calculate progress based on questions received
                    const targetQuestions = Number.parseInt(numQuestions)
                    const receivedQuestions = newQuiz.questions.length
                    currentProgress = Math.min(95, Math.floor((receivedQuestions / targetQuestions) * 95))
                    setProgress(currentProgress)

                    // Update the generating quiz state
                    setGeneratingQuiz({ ...newQuiz })

                    // If this is the first question and we're not already taking a quiz,
                    // show a toast notification that the user can start
                    // if (newQuiz.questions.length === 1 && !isQuizActive) {
                    //     toast.success("First question ready! You can start the quiz now.", {
                    //         action: {
                    //             label: "Start Quiz",
                    //             onClick: () => handleStartQuiz(newQuiz),
                    //         },
                    //     })
                    // }

                    // Update the UI with current progress
                    setGeneratedQuizzes((prevQuizzes) => {
                        const updatedQuizzes = [...prevQuizzes]
                        const existingQuizIndex = updatedQuizzes.findIndex((q) => q.title === newQuiz.title)

                        if (existingQuizIndex >= 0) {
                            // Update existing quiz
                            updatedQuizzes[existingQuizIndex] = { ...newQuiz }
                        } else {
                            // Add new quiz
                            updatedQuizzes.push({ ...newQuiz })
                        }

                        return updatedQuizzes
                    })

                    // If this quiz is currently active, update it
                    if (activeQuiz?.title === newQuiz.title) {
                        setActiveQuiz({ ...newQuiz })
                    }
                }
            }

            // Final update
            setProgress(100)
            setGeneratingQuiz(null)
            toast.success(`Generated ${newQuiz.questions.length} questions successfully!`)
        } catch (error) {
            console.error("Error generating quiz:", error)
            toast.error("Failed to generate quiz")
        } finally {
            setIsGenerating(false)
            setGeneratingQuiz(null)
            // Reset progress after a delay
            setTimeout(() => setProgress(0), 1000)
        }
    }

    const handleStartQuiz = (quiz: Quiz) => {
        setActiveQuiz(quiz)
        setIsQuizActive(true)
        setCurrentQuestion(0)
        setScore(0)
        setSelectedAnswer(null)
        setIsAnswerSubmitted(false)
    }

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null || !activeQuiz) return

        setIsAnswerSubmitted(true)
        if (activeQuiz?.questions[currentQuestion] && Number.parseInt(selectedAnswer) === (activeQuiz.questions[currentQuestion].correctAnswer)){
            setScore(score + 1)
        }
    }

    const handleNextQuestion = () => {
        setSelectedAnswer(null)
        setIsAnswerSubmitted(false)
        if (activeQuiz && currentQuestion < activeQuiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            setIsQuizActive(false)
            setActiveQuiz(null)
        }
    }

    return (
        <div className="space-y-8">
            {!isQuizActive ? (
                <>
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Generate Quiz</CardTitle>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Quiz Settings</DialogTitle>
                                            <DialogDescription>Customize your quiz generation preferences</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Number of Questions</label>
                                                <Select value={numQuestions} onValueChange={setNumQuestions}>
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
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Difficulty Level</label>
                                                <Select defaultValue="medium">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="easy">Easy</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="hard">Hard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Question Types</label>
                                                <Select defaultValue="all">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Types</SelectItem>
                                                        <SelectItem value="mcq">Multiple Choice Only</SelectItem>
                                                        <SelectItem value="tf">True/False Only</SelectItem>
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

                                {isGenerating ? (
                                    <div className="space-y-2">
                                        <Progress value={progress} className="h-2" />
                                        <p className="text-sm text-center text-muted-foreground">
                                            Generating quiz... {progress}%
                                            {generatingQuiz?.questions.length ? ` (${generatingQuiz.questions.length} questions so far)` : ""}
                                        </p>
                                    </div>
                                ) : (
                                    <Button className="w-full" onClick={handleGenerate}>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Generate Quiz
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Show generating quiz first if it exists */}
                    {generatingQuiz && (
                        <Card className="border-primary">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle>{generatingQuiz.title}</CardTitle>
                                            <Badge variant="secondary">
                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                Generating
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                            <span>{generatingQuiz.questions.length} questions generated</span>
                                        </div>
                                    </div>
                                    {generatingQuiz.questions.length > 0 && (
                                        <Button onClick={() => handleStartQuiz(generatingQuiz)}>Start Quiz Now</Button>
                                    )}
                                </div>
                            </CardHeader>
                            {generatingQuiz.questions.length > 0 && (
                                <CardContent>
                                    <Alert>
                                        <AlertDescription>
                                            You can start taking this quiz now while more questions are being generated!
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            )}
                        </Card>
                    )}

                    {/* Show other generated quizzes */}
                    {generatedQuizzes.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Generated Quizzes</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {generatedQuizzes
                                    .filter((quiz) => quiz !== generatingQuiz) // Don't show the generating quiz here
                                    .map((quiz, index) => (
                                        <Card key={index} className="border-primary/50">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <CardTitle>{quiz.title}</CardTitle>
                                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                                            <span>{quiz.questions.length} questions</span>
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => handleStartQuiz(quiz)}>Start Quiz</Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">Click Start Quiz to begin.</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FlaskConical className="h-5 w-5 text-primary" />
                                    <CardTitle>{activeQuiz?.title ?? "Quiz"}</CardTitle>
                                    {activeQuiz === generatingQuiz && (
                                        <Badge variant="secondary">
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            More questions being generated
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Question {currentQuestion + 1} of {activeQuiz?.questions.length}
                                        {activeQuiz === generatingQuiz && "+ (generating)"}
                                    </span>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-lg">
                                Score: {score}/{activeQuiz?.questions.length}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {activeQuiz?.questions[currentQuestion] && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">{activeQuiz.questions[currentQuestion].question}</h3>

                                <RadioGroup
                                    value={selectedAnswer?.toString()}
                                    onValueChange={setSelectedAnswer}
                                    className="space-y-3"
                                    disabled={isAnswerSubmitted}
                                >
                                    {activeQuiz.questions[currentQuestion].options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className={`flex-1 p-3 rounded-lg border cursor-pointer ${isAnswerSubmitted
                                                    ? activeQuiz?.questions[currentQuestion] && index === (activeQuiz.questions[currentQuestion].correctAnswer)
                                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                        : Number.parseInt(selectedAnswer!) === index
                                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                            : ""
                                                    : "hover:bg-muted/50"
                                                    }`}
                                            >
                                                {option}
                                                {isAnswerSubmitted && (
                                                    <span className="float-right">
                                                        {activeQuiz?.questions[currentQuestion] && index === (activeQuiz.questions[currentQuestion].correctAnswer) ? (
                                                            <Check className="h-5 w-5 text-green-500" />
                                                        ) : Number.parseInt(selectedAnswer!) === index ? (
                                                            <X className="h-5 w-5 text-red-500" />
                                                        ) : null}
                                                    </span>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {isAnswerSubmitted && activeQuiz.questions[currentQuestion].explanation && (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-medium mb-1">Explanation:</h4>
                                        <p className="text-sm">{activeQuiz.questions[currentQuestion].explanation}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            {!isAnswerSubmitted ? (
                                <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                                    Submit Answer
                                </Button>
                            ) : (
                                <Button onClick={handleNextQuestion}>
                                    {activeQuiz && currentQuestion < activeQuiz.questions.length - 1 ? (
                                        <>
                                            Next Question
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </>
                                    ) : (
                                        "Finish Quiz"
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

