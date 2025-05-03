'use client'

import { Search, MoreHorizontal, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AddSubjectCard } from './add-subject-card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from 'react'
export function SearchHeader({ setSearch }: { setSearch: Dispatch<SetStateAction<string>> }) {


    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">All Subjects</h1>
                <div className="flex items-center gap-4">
                    {/* add a subject via the header */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-[#2E8B57] text-white hover:bg-[#2E8B57]/90"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a subject</DialogTitle>
                                <DialogDescription>
                                    Create a subject.
                                </DialogDescription>
                            </DialogHeader>
                            <AddSubjectCard />
                        </DialogContent>
                    </Dialog>

                    {/* query via the query header */}
                    <Select defaultValue="every">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="every">Every Subject</SelectItem>
                            <SelectItem value="core">Core Subjects</SelectItem>
                            <SelectItem value="elective">Elective Subjects</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        id="search"
                        name="search"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for a subject......"
                        className="pl-9 w-full"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                >
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}

