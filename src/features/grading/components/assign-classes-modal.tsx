"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGradingConfig } from "../providers/grading-config-provider";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { useDomain } from "@/context/DomainContext";
import { toast } from "sonner";

interface AssignClassesModalProps {
  configId: Id<"grading">;
}

export function AssignClassesModal({ configId }: AssignClassesModalProps) {
  const { closeAssignModal } = useGradingConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("classes");

  // Get the config data
  const config = useQuery(api.mutations.grading.getGradingConfigById, {
    configId,
  });

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

  // Initialize selected classes and subjects from config
  useState(() => {
    if (config) {
      setSelectedClasses(config.classIds);
      setSelectedSubjects(config.subjectIds ?? []);
    }
  });

  // Mutations
  const assignToClasses = useMutation(
    api.mutations.grading.assignGradingConfigToClasses,
  );
  const assignToSubjects = useMutation(
    api.mutations.grading.assignGradingConfigToSubjects,
  );

  const handleSubmit = async () => {
    if (!schoolId) return;

    setIsSubmitting(true);
    try {
      // Update class assignments
      await assignToClasses({
        configId,
        classIds: selectedClasses as Id<"classes">[],
      });

      // Update subject assignments if any are selected
      if (selectedSubjects.length > 0) {
        await assignToSubjects({
          configId,
          subjectIds: selectedSubjects as Id<"subjects">[],
        });
      }

      toast.success("Assignments updated successfully.");

      closeAssignModal();
    } catch (error) {
      toast.error("Failed to update assignments");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config || !schoolId) {
    return (
      <Dialog open onOpenChange={closeAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Classes & Subjects</DialogTitle>
          </DialogHeader>
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={closeAssignModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign &apos;{config.name}&apos;</DialogTitle>
          <DialogDescription>
            Select which classes and subjects should use this grading
            configuration.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4 pt-4">
            <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
              {classes.map((cls) => (
                <div key={cls._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${cls._id}`}
                    checked={selectedClasses.includes(cls._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedClasses([...selectedClasses, cls._id]);
                      } else {
                        setSelectedClasses(
                          selectedClasses.filter((id) => id !== cls._id),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`class-${cls._id}`}>{cls.title}</Label>
                </div>
              ))}

              {classes.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No classes found.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4 pt-4">
            <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
              {subjects.map((subject) => (
                <div key={subject._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject._id}`}
                    checked={selectedSubjects.includes(subject._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubjects([...selectedSubjects, subject._id]);
                      } else {
                        setSelectedSubjects(
                          selectedSubjects.filter((id) => id !== subject._id),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`subject-${subject._id}`}>
                    {subject.name}
                  </Label>
                </div>
              ))}

              {subjects.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No subjects found.
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              If no subjects are selected, this configuration will apply to all
              subjects in the selected classes.
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={closeAssignModal}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedClasses.length === 0}
          >
            {isSubmitting ? "Saving..." : "Save Assignments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
