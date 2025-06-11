"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGradingConfig } from "../providers/grading-config-provider";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "~/_generated/api";
import { Id } from "~/_generated/dataModel";
import { useDomain } from "@/context/DomainContext";

interface ViewGradingConfigModalProps {
  configId: Id<"grading">;
}

export function ViewGradingConfigModal({
  configId,
}: ViewGradingConfigModalProps) {
  const { closeViewModal } = useGradingConfig();
  const [activeTab, setActiveTab] = useState("components");

  // Get the config data
  const config = useQuery(api.mutations.grading.getGradingConfigById, {
    configId,
  });

  // Get classes and subjects for display
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

  // Create maps for easy lookup
  const classMap = new Map(classes.map((cls) => [cls._id, cls.title]));
  const subjectMap = new Map(
    subjects.map((subject) => [subject._id, subject.name]),
  );

  if (!config) {
    return (
      <Dialog open onOpenChange={closeViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Grading Configuration</DialogTitle>
          </DialogHeader>
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={closeViewModal}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.name}
            <Badge
              variant={
                config.status === "active"
                  ? "default"
                  : config.status === "draft"
                    ? "outline"
                    : "secondary"
              }
            >
              {config.status}
            </Badge>
            {config.isDefault && (
              <Badge variant="default" className="bg-amber-500">
                Default
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {config.description ?? "No description provided."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="gradeScale">Grade Scale</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-4 pt-4">
            <div className="grid gap-4">
              {config.components
                .filter((component) => component.active)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((component) => (
                  <Card key={component.key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between text-sm font-medium">
                        <span>{component.name}</span>
                        <span>{component.maxPercentage}%</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress
                        value={component.maxPercentage}
                        className="h-2"
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>

            {config.components.some((c) => !c.active) && (
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium">
                  Inactive Components
                </h4>
                <div className="grid gap-2">
                  {config.components
                    .filter((component) => !component.active)
                    .map((component) => (
                      <div
                        key={component.key}
                        className="text-sm text-muted-foreground"
                      >
                        {component.name} ({component.key})
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gradeScale" className="space-y-4 pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Grade</th>
                    <th className="px-4 py-2 text-left">Min Score</th>
                    <th className="px-4 py-2 text-left">Max Score</th>
                    <th className="px-4 py-2 text-left">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {config.gradeScale
                    .sort((a, b) => b.minScore - a.minScore)
                    .map((grade, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 font-medium">{grade.grade}</td>
                        <td className="px-4 py-2">{grade.minScore}%</td>
                        <td className="px-4 py-2">{grade.maxScore}%</td>
                        <td className="px-4 py-2">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${((grade.maxScore - grade.minScore) / 100) * 100}%`,
                                marginLeft: `${(grade.minScore / 100) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Assigned Classes</h4>
                <div className="flex flex-wrap gap-2">
                  {config.classIds.map((classId) => (
                    <Badge key={classId} variant="outline">
                      {classMap.get(classId) ?? "Unknown Class"}
                    </Badge>
                  ))}
                </div>
              </div>

              {config.subjectIds && config.subjectIds.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">
                    Specific Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {config.subjectIds.map((subjectId) => (
                      <Badge key={subjectId} variant="outline">
                        {subjectMap.get(subjectId) ?? "Unknown Subject"}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(!config.subjectIds || config.subjectIds.length === 0) && (
                <div className="text-sm text-muted-foreground">
                  This configuration applies to all subjects in the assigned
                  classes.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={closeViewModal}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
