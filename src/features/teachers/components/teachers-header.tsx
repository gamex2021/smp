"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserPlus } from "lucide-react";
import { ViewToggle } from "./view-toggle";
import { useState } from "react";
import CreateTeacherForm from "./create-teacher";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeachersHeaderProps {
  view: "table" | "grid";
  onViewChange: (view: "table" | "grid") => void;
  onSearch: (value: string) => void;
}

export function TeachersHeader({
  view,
  onViewChange,
  onSearch,
}: TeachersHeaderProps) {
  const [isTeacherCreateFormOpen, setIsTeacherCreateFormOpen] = useState(false);

  return (
    <div className="mb-6 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Teachers</h1>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={onViewChange} />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Class</SelectItem>
              <SelectItem value="jss1">JSS 1</SelectItem>
              <SelectItem value="jss2">JSS 2</SelectItem>
              <SelectItem value="jss3">JSS 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search for a teacher......"
            className="w-full pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* when this icon is clicked, the teacher's create form modal will be opened */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full">
          <Dialog
            open={isTeacherCreateFormOpen}
            onOpenChange={setIsTeacherCreateFormOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <UserPlus className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#11321f]">
                  Add New Teacher
                </DialogTitle>
                <DialogDescription>
                  Fill in the teacher&apos;s information below. They will
                  receive an email with their login credentials.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-10rem)] max-h-[calc(90vh-10rem)] p-3">
                <CreateTeacherForm
                  onClose={() => setIsTeacherCreateFormOpen(false)}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
