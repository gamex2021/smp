"use client"

import { motion } from "framer-motion"
import { FileText, Clock, Award, BookOpen, BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkspaceStatsProps {
    stats: {
        totalDocuments: number
        totalPages: number
        studyTime: string
        quizzesTaken: number
        averageScore: string
    } | undefined
}

export default function WorkspaceStats({ stats }: WorkspaceStatsProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    <CardTitle>Workspace Stats</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
                        <FileText className="h-5 w-5 text-primary mb-1" />
                        <span className="text-2xl font-bold">{stats?.totalDocuments ?? 0}</span>
                        <span className="text-xs text-muted-foreground">Documents</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
                        <BookOpen className="h-5 w-5 text-primary mb-1" />
                        <span className="text-2xl font-bold">{stats?.totalPages ?? 0}</span>
                        <span className="text-xs text-muted-foreground">Pages</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
                        <Clock className="h-5 w-5 text-primary mb-1" />
                        <span className="text-2xl font-bold">{stats?.studyTime ?? 0}</span>
                        <span className="text-xs text-muted-foreground">Study Time</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
                        <Award className="h-5 w-5 text-primary mb-1" />
                        <span className="text-2xl font-bold">{stats?.averageScore ?? 0}</span>
                        <span className="text-xs text-muted-foreground">Avg. Score</span>
                    </div>
                </motion.div>

                <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Study Progress</h4>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ delay: 0.5, duration: 1 }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>65% Complete</span>
                        <span>{stats?.quizzesTaken} Quizzes Taken</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

