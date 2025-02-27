'use client'

import { Search, User, UserPlus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { ViewToggle } from './view-toggle'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateStudentForm from './create-student';

interface StudentsHeaderProps {
    view: 'table' | 'grid'
    onViewChange: (view: 'table' | 'grid') => void
    onSearch: (value: string) => void;
}

export function StudentsHeader({ view, onViewChange, onSearch }: StudentsHeaderProps) {

    const [isStudentCreateFormOpen, setIsStudentCreateFormOpen] = useState(false);


    return (
        <div className="flex flex-col space-y-6 mb-6">
            <div className="flex justify-between items-center" >
                <h1 className="text-2xl font-semibold">All Students</h1>
                <div className="flex items-center gap-4">
                    <ViewToggle view={view} onViewChange={onViewChange} />
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Class</SelectItem>
                            <SelectItem value="1">Class 1</SelectItem>
                            <SelectItem value="2">Class 2</SelectItem>
                            <SelectItem value="3">Class 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div >

            <div className="flex gap-2">
                <div className="relative ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search for a student......"
                        className="pl-9 w-full"
                    />
                </div>

                {/* when this icon is clicked, the teacher's create form modal will be opened */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    <Dialog
                        open={isStudentCreateFormOpen}
                        onOpenChange={setIsStudentCreateFormOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <UserPlus className="size-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-[#11321f]">
                                    Add New Student
                                </DialogTitle>
                                <DialogDescription>
                                    Fill in the student&apos;s information below. They will
                                    receive an email with their login credentials.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[calc(90vh-10rem)] max-h-[calc(90vh-10rem)] p-3">
                                <CreateStudentForm
                                    onClose={() => setIsStudentCreateFormOpen(false)}
                                />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>





        </div >
    )
}

