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
import { useMutation } from "convex/react";
import { GradingConfigForm } from "./grading-config-form";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDomain } from "@/context/DomainContext";
import { api } from "~/_generated/api";
import { toast } from "sonner";
import { type Id } from "~/_generated/dataModel";
import { CustomSkeleton } from "@/components/custom-skeleton";

// Define the form schema
const gradingConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  classIds: z
    .array(z.custom<Id<"classes">>())
    .min(1, "At least one class must be selected"),
  subjectIds: z.array(z.custom<Id<"subjects">>()).optional(),
  components: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        name: z.string().min(1, "Name is required"),
        active: z.boolean(),
        maxPercentage: z.number().min(0).max(100),
        order: z.number().optional(),
      }),
    )
    .refine((components) => {
      const activeComponents = components.filter((c) => c.active);
      const totalPercentage = activeComponents.reduce(
        (sum, c) => sum + c.maxPercentage,
        0,
      );
      return Math.abs(totalPercentage - 100) < 0.01; // Allow for floating point imprecision
    }, "Total percentage of active components must equal 100%"),
  gradeScale: z
    .array(
      z.object({
        grade: z.string().min(1, "Grade is required"),
        minScore: z.number().min(0).max(100),
        maxScore: z.number().min(0).max(100),
      }),
    )
    .refine((grades) => {
      // Check for overlapping ranges
      const sortedGrades = [...grades].sort((a, b) => a.minScore - b.minScore);
      for (let i = 0; i < sortedGrades.length - 1; i++) {
        if (
          (sortedGrades?.[i]?.maxScore ?? 0) >
          (sortedGrades?.[i + 1]?.minScore ?? 0)
        ) {
          return false;
        }
      }
      return true;
    }, "Grade ranges cannot overlap"),
  isDefault: z.boolean().optional(),
});

type GradingConfigFormValues = z.infer<typeof gradingConfigSchema>;

export function CreateGradingConfigModal() {
  const { closeCreateModal } = useGradingConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Get school ID from somewhere in your app (e.g., context, state, etc.)
  // For now, I'll use a placeholder
  const { school } = useDomain();
  const schoolId = school?._id;

  // Mutation to create a grading config
  const createConfig = useMutation(api.mutations.grading.createGradingConfig);

  // Form setup
  const form = useForm<GradingConfigFormValues>({
    resolver: zodResolver(gradingConfigSchema),
    defaultValues: {
      name: "",
      description: "",
      classIds: [],
      subjectIds: [],
      components: [
        {
          key: "exam",
          name: "Examination",
          active: true,
          maxPercentage: 70,
          order: 1,
        },
        {
          key: "ca",
          name: "Continuous Assessment",
          active: true,
          maxPercentage: 30,
          order: 2,
        },
      ],
      gradeScale: [
        { grade: "A", minScore: 80, maxScore: 100 },
        { grade: "B", minScore: 70, maxScore: 79.99 },
        { grade: "C", minScore: 60, maxScore: 69.99 },
        { grade: "D", minScore: 50, maxScore: 59.99 },
        { grade: "E", minScore: 40, maxScore: 49.99 },
        { grade: "F", minScore: 0, maxScore: 39.99 },
      ],
      isDefault: false,
    },
  });

  const onSubmit = async (values: GradingConfigFormValues) => {
    if (!schoolId) return;
    setIsSubmitting(true);
    try {
      const configId = await createConfig({
        schoolId,
        ...values,
      });

      toast.success("Grading configuration created successfully.");

      // Ask if they want to assign to more classes
      if (values.classIds.length === 1) {
        setShowAssignModal(true);
      } else {
        closeCreateModal();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create configuration",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!schoolId) {
    // If there is no schoolId then show a loader
    //TODO : I will have to use a skeleton that suits the grading page , using this for now
    return <CustomSkeleton />;
  }

  return (
    <Dialog open onOpenChange={closeCreateModal}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Grading Configuration</DialogTitle>
          <DialogDescription>
            Define how grades are calculated and displayed for classes and
            subjects.
          </DialogDescription>
        </DialogHeader>

        <GradingConfigForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          schoolId={schoolId}
        />

        <DialogFooter>
          <Button variant="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          {/* <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Creating..." : "Create Configuration"}
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
