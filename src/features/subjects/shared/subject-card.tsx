"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVertical, Plus } from "lucide-react";
import Image from "next/image";
import AssignSubjectToTeacher from "../components/Admin/components/assign-subject-to-teacher";
import { type Id } from "~/_generated/dataModel";
import { type Subject } from "../types";
import SubjectActions from "./subject-actions";

interface BaseSubjectCardProps {
  id: Id<"subjects">;
  name: string;
  onClick?: () => void;
  onAssign?: () => void;
  subject: Subject;
  subjectTeacher?: Id<"subjectTeachers">;
}

interface TeacherProps {
  teacher: true;
  teacherName: string;
  className: string;
}

interface NonTeacherProps {
  teacher?: false;
  teacherName?: never;
  className?: never;
}

type SubjectCardProps = BaseSubjectCardProps & (TeacherProps | NonTeacherProps);

export function SubjectCard({
  id,
  name,
  onClick,
  onAssign,
  subjectTeacher,
  teacher,
  teacherName,
  className,
  subject,
}: SubjectCardProps) {
  console.log("subject", subject);
  return (
    <div
      onClick={onClick}
      className="aspect-square max-w-[300px] cursor-pointer rounded-2xl bg-[#2E8B57] p-4 text-white transition-all duration-200 hover:shadow-lg"
    >
      {/* the subject actin to delete, view and edit the subject */}
      <div className="flex justify-end">
        <SubjectActions
          subjectTeacher={subjectTeacher}
          teacher={teacher ? true : false}
          subject={subject}
        />
      </div>

      <div className="flex h-full flex-col">
        <h3 className="mb-4 text-lg font-medium text-[#F8FBFA]">{name}</h3>
        <div className="mb-4 flex flex-1 items-center justify-center rounded-[16px] bg-[#57a178]">
          <Image
            src="/images/book.png"
            width={300}
            height={300}
            className="h-[63px] w-[63px]"
            alt="book"
          />
        </div>

        {teacher ? (
          <div className="flex w-full items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-white/90">{teacherName}</p>
              <p className="text-sm text-white/75">{className}</p>
            </div>
            <div className="rounded-[6.65px] bg-[#FFFFFF] px-2 py-2">
              <MoreVertical className="h-5 w-5 text-[#2E8B57]" />
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="default"
                className="w-full rounded-xl bg-white font-medium text-[#11321F] hover:bg-white/90"
              >
                Assign
                <div className="rounded-md bg-[#2E8B57] px-1 py-1">
                  <Plus className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign subject</DialogTitle>
                <DialogDescription>
                  Assign the subject to a teacher
                </DialogDescription>
              </DialogHeader>
              {/* this is the component that assigns the subject to a teacher , so they are assigning the teacher to a subject in the class, so we will be using the subjectTeachers schema here which joins the teacher, subject and also the class */}
              <AssignSubjectToTeacher subjectId={id} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
