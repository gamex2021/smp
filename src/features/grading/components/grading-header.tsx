"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGradingConfig } from "../providers/grading-config-provider";
import { usePaginatedQuery, useQuery } from "convex/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGradingConfigModal } from "./create-grading-config-modal";
import { EditGradingConfigModal } from "./edit-grading-config-modal";
import { ViewGradingConfigModal } from "./view-grading-config-modal";
import { AssignClassesModal } from "./assign-classes-modal";
import { useDomain } from "@/context/DomainContext";
import { useState } from "react";
import { api } from "~/_generated/api";

interface GradingHeaderProps {
  selectedClass: string | null;
  setSelectedClass: (classId: string | null) => void;
  selectedSubject: string | null;
  setSelectedSubject: (subjectId: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

export function GradingHeader({
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  statusFilter,
  setStatusFilter,
}: GradingHeaderProps) {
  const {
    openCreateModal,
    isCreateModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    isAssignModalOpen,
    currentConfigId,
  } = useGradingConfig();

  // Get school ID from somewhere in your app (e.g., context, state, etc.)
  const { domain, school } = useDomain();
  // Get school ID from the config
  const schoolId = school?._id;

  // Get classes and subjects
  // this is for the search state
  const [classesSearch, setClassesSearch] = useState<string>("");
  // get the classes here , which should be paginated
  const {
    results: classes,
    status: classesStatus,
    loadMore: classesLoadMore,
  } = usePaginatedQuery(
    api.queries.class.getClassesData,
    domain ? { domain, search: classesSearch } : "skip",
    { initialNumItems: 12 },
  );
  const [subjectSearch, setSubjectSearch] = useState<string>("");
  const {
    results: subjects,
    status: subjectStatus,
    loadMore: subjectLoadMore,
  } = usePaginatedQuery(
    api.queries.subject.getSchoolSubjectsWithPagination,
    schoolId ? { schoolId, search: subjectSearch } : "skip",
    { initialNumItems: 12 },
  );
  
  const stats = useQuery(
    api.mutations.grading.getGradingStatistics,
    schoolId
      ? {
          schoolId,
        }
      : "skip",
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Grading Configuration
            </h1>
            <p className="text-muted-foreground">
              Manage grading configurations for classes and subjects
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Config
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Configs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.active ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.draft ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.archived ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <Select
              value={statusFilter ?? "all"}
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Select
              value={selectedClass ?? "all"}
              onValueChange={(value) =>
                setSelectedClass(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Select
              value={selectedSubject ?? "all"}
              onValueChange={(value) =>
                setSelectedSubject(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isCreateModalOpen && <CreateGradingConfigModal />}
      {isEditModalOpen && currentConfigId && (
        <EditGradingConfigModal configId={currentConfigId} />
      )}
      {isViewModalOpen && currentConfigId && (
        <ViewGradingConfigModal configId={currentConfigId} />
      )}
      {isAssignModalOpen && currentConfigId && (
        <AssignClassesModal configId={currentConfigId} />
      )}
    </>
  );
}
