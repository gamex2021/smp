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
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDomain } from "@/context/DomainContext";
import CreateTeacherForm from "@/features/teachers/components/create-teacher";
import { usePaginatedQuery } from "convex/react";
import { Search, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { api } from "~/_generated/api";

type Props = object;

const TeachersTable = (props: Props) => {
  const { domain } = useDomain();
  // ? This is for searching through the teachers
  const [search, setSearch] = useState<string>("");
  // ? get the list of teachers for a school
  const {
    results: teachers,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.teacher.getTeachersWithPagination,
    domain ? { domain, search } : "skip",
    { initialNumItems: 12 },
  );
  //
  const [isTeacherCreateFormOpen, setIsTeacherCreateFormOpen] = useState(false);

  return (
    <div className="h-full w-[86vw] rounded-[20px] border border-[#11321F99] px-[34px] py-[22px] md:w-[70vw] xl:w-[100%] 2xl:w-[100%]">
      {/* the teachers list and the button to add more teachers */}
      <div className="flex items-center justify-between px-3">
        <h1 className="text-[16px] font-semibold text-[#11321F]">
          Teachers List
        </h1>

        {/* Add a teacher button */}
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

      <div className="relative my-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search for a teacher......"
          className="w-full pl-9"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="relative h-[500px] w-full">
        <Table className="">
          <TableCaption>A list of your teachers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-normal leading-[24.96px] text-[#11321F99]">
                Name
              </TableHead>
              {/* <TableHead className="font-normal leading-[24.96px] text-[#11321F99]">
                Class
              </TableHead> */}
              {/* <TableHead className="font-normal leading-[24.96px] text-[#11321F99]">
                Subject
              </TableHead> */}
              <TableHead className="font-normal leading-[24.96px] text-[#11321F99]">
                Email
              </TableHead>
              <TableHead className="text-right font-normal leading-[24.96px] text-[#11321F99]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers?.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell className="flex w-full items-center space-x-2 font-medium text-[#11321F]">
                  <Image
                    src={teacher.image ?? ""}
                    alt={teacher.name ?? "Teacher's image"}
                    width={500}
                    height={500}
                    className="h-10 w-10 rounded-full object-cover object-top"
                  />
                  <h1>{teacher.name}</h1>
                </TableCell>
                {/* <TableCell className="text-[#11321F]">
                  {teacher.class}
                </TableCell>
                <TableCell className="text-[#11321F]">
                  {teacher.subject}
                </TableCell> */}
                <TableCell className="text-[#11321F]">
                  {teacher.email}
                </TableCell>
                <TableCell className="flex justify-end">
                  <HiDotsVertical className="h-5 w-5 cursor-pointer text-slate-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {status === "CanLoadMore" && (
        <div className="mt-8 flex justify-center">
          <Button
            role="button"
            aria-label="Load more teachers"
            onClick={() => loadMore(12)}
            variant="outline"
            className="px-8"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeachersTable;
