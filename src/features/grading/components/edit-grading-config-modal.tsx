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
import { useMutation, useQuery } from "convex/react";
import { GradingConfigForm } from "./grading-config-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { toast } from "sonner";

// Define the form schema (same as in create modal)
const gradingConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
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

interface EditGradingConfigModalProps {
  configId: Id<"grading">;
}

export function EditGradingConfigModal({
  configId,
}: EditGradingConfigModalProps) {
  const { closeEditModal } = useGradingConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the config data
  const config = useQuery(api.mutations.grading.getGradingConfigById, {
    configId,
  });
  const canEdit = useQuery(api.mutations.grading.canEditGradingConfig, {
    configId,
  });
  const isReadOnly =
    config?.status === "archived" || !(canEdit?.canEdit ?? true);

  // Get school ID from the config
  const schoolId = config?.schoolId;

  // Mutation to update a grading config
  const updateConfig = useMutation(api.mutations.grading.updateGradingConfig);

  // Form setup
  const form = useForm<GradingConfigFormValues>({
    resolver: zodResolver(gradingConfigSchema),
    defaultValues: {
      name: "",
      description: "",
      classIds: [],
      subjectIds: [],
      components: [],
      gradeScale: [],
      isDefault: false,
    },
  });

  // Load config data into form
  useEffect(() => {
    if (config) {
      form.reset({
        name: config.name,
        description: config.description ?? "",
        classIds: config.classIds,
        subjectIds: config.subjectIds ?? [],
        components: config.components,
        gradeScale: config.gradeScale,
        isDefault: config.isDefault ?? false,
      });
      setIsLoading(false);
    }
  }, [config, form]);

  const onSubmit = async (values: GradingConfigFormValues) => {
    if (!schoolId) return;

    setIsSubmitting(true);
    try {
      await updateConfig({
        configId,
        name: values.name,
        description: values.description,
        components: values.components,
        gradeScale: values.gradeScale,
        classIds: values.classIds,
        subjectIds: values.subjectIds,
      });

      toast.success("Grading configuration updated successfully.");

      closeEditModal();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update configuration",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !config || !schoolId) {
    return (
      <Dialog open onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Grading Configuration</DialogTitle>
          </DialogHeader>
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={closeEditModal}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly ? "View" : "Edit"} Grading Configuration
          </DialogTitle>
          <DialogDescription>
            {isReadOnly
              ? "View the details of this grading configuration."
              : "Update how grades are calculated and displayed for classes and subjects."}
          </DialogDescription>
        </DialogHeader>

        <GradingConfigForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          schoolId={schoolId}
          configId={configId}
          isReadOnly={isReadOnly}
        />

        <DialogFooter>
          <Button variant="outline" onClick={closeEditModal}>
            Close
          </Button>
          {/* {!isReadOnly && (
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Saving..." : "Update Configuration"}
            </Button>
          )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
