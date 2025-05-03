"use client"

import { useState, useRef } from "react"
import {
    Settings,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Download,
    MoreHorizontal,
    Sparkles,
    Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
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

interface TTSToolProps {
    workspaceId?: string
}

export default function TTSTool({ workspaceId }: TTSToolProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(180) // 3 minutes in seconds
    const [volume, setVolume] = useState(80)

    const audioRef = useRef<HTMLAudioElement>(null)

    const audioFiles = [
        {
            id: "1",
            title: "Cell Biology Chapter 1",
            duration: "15:30",
            createdAt: "2023-08-01T15:20:00Z",
            size: "12.4 MB",
            voice: "Emma",
        },
        {
            id: "2",
            title: "DNA Replication Process",
            duration: "10:45",
            createdAt: "2023-07-29T10:15:00Z",
            size: "8.2 MB",
            voice: "James",
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Generate Audio</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Text to Speech Settings</DialogTitle>
                                    <DialogDescription>Customize your audio generation preferences</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Voice</label>
                                        <Select defaultValue="emma">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="emma">Emma (Female)</SelectItem>
                                                <SelectItem value="james">James (Male)</SelectItem>
                                                <SelectItem value="sarah">Sarah (Female)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Speaking Speed</label>
                                        <Select defaultValue="1">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0.75">Slow</SelectItem>
                                                <SelectItem value="1">Normal</SelectItem>
                                                <SelectItem value="1.25">Fast</SelectItem>
                                                <SelectItem value="1.5">Very Fast</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Audio Quality</label>
                                        <Select defaultValue="high">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Standard</SelectItem>
                                                <SelectItem value="medium">Enhanced</SelectItem>
                                                <SelectItem value="high">Premium</SelectItem>
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
                                <label className="text-sm font-medium">Or Upload Text</label>
                                <div className="flex gap-2">
                                    <Input type="file" className="flex-1" />
                                    <Button variant="outline">
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {isGenerating ? (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-center text-muted-foreground">Generating audio... {progress}%</p>
                            </div>
                        ) : (
                            <Button className="w-full" onClick={handleGenerate}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Audio
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Your Audio Files</h2>
                <div className="space-y-4">
                    {audioFiles.map((file) => (
                        <Card key={file.id}>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{file.title}</h3>
                                            <div className="flex gap-2 text-sm text-muted-foreground">
                                                <span>{file.duration}</span>
                                                <span>•</span>
                                                <span>{file.size}</span>
                                                <span>•</span>
                                                <span>Voice: {file.voice}</span>
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
                                                    Download Audio
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Share Audio</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Delete Audio</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                                            >
                                                <SkipBack className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setIsPlaying(!isPlaying)}
                                            >
                                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                                            >
                                                <SkipForward className="h-4 w-4" />
                                            </Button>
                                            <div className="flex-1">
                                                <Slider
                                                    value={[currentTime]}
                                                    max={duration}
                                                    step={1}
                                                    onValueChange={([value]) => setCurrentTime(value ?? 0)}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-20 text-right">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                                            <Slider
                                                value={[volume]}
                                                max={100}
                                                step={1}
                                                onValueChange={([value]) => setVolume(value ?? 0)}
                                                className="w-24 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

