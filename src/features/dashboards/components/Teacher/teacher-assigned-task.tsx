import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

interface Task {
    subject: string
    description: string
    dueDate: string
}

const tasks: Task[] = [
    {
        subject: "Math",
        description: "Complete the worksheet on solving for x.",
        dueDate: "Friday, November 10",
    },
    {
        subject: "English",
        description: "Write five sentences using the following words: happy, friend, school, help, and learn. Make sure e...",
        dueDate: "Monday, November 13",
    },
    {
        subject: "Math",
        description: "Practice the 6, 7, and 8 times tables. Complete the exercises in your workbook.",
        dueDate: "Tuesday, November 14",
    },
    {
        subject: "English",
        description: "Underline the nouns in each sentence on the worksheet. Complete all 10 sentences.",
        dueDate: "Wednesday, November 15",
    },
]

export default function TeacherAssignedTask() {
    return (
        <Card className="w-full max-w-md bg-emerald-100 shadow-lg">
            <CardHeader className="bg-emerald-600 rounded-t-[25.12px] text-white">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Assigned Task</CardTitle>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-emerald-700">
                        <div className="bg-white px-2 py-2 rounded-[10px]">
                            <Plus className="h-5 w-5 text-emerald-600" />
                        </div>

                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <ul className="space-y-4">
                    {tasks.map((task, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-[10px] h-[10px] mt-2 rounded-full bg-emerald-600" />
                            <div className="flex-grow">
                                <p className="font-medium text-gray-900">
                                    <span className="font-semibold">{task.subject}:</span> {task.description}
                                </p>
                                <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

