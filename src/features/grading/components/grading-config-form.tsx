/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginatedQuery, useQuery } from "convex/react";
import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { useDomain } from "@/context/DomainContext";

interface GradingConfigFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
  schoolId: Id<"schools">;
  configId?: Id<"grading">;
  isReadOnly?: boolean;
}

export function GradingConfigForm({
  form,
  onSubmit,
  isSubmitting,
  schoolId,
  configId,
  isReadOnly = false,
}: GradingConfigFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const { domain, school } = useDomain();

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

  // Watch form values for validation
  const components =
    (form.watch("components") as Array<{
      key: string;
      name: string;
      active: boolean;
      maxPercentage: number;
      order: number;
    }>) || [];
  const activeComponents = components.filter(
    (c: {
      key: string;
      name: string;
      active: boolean;
      maxPercentage: number;
      order: number;
    }) => c.active,
  );
  const totalPercentage = activeComponents.reduce(
    (
      sum: number,
      c: {
        key: string;
        name: string;
        active: boolean;
        maxPercentage: number;
        order: number;
      },
    ) => sum + (Number.parseFloat(c.maxPercentage.toString()) || 0),
    0,
  );
  const percentageError = Math.abs(totalPercentage - 100) > 0.01;

  // Handle component drag and drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (reorderedItem) {
      items.splice(result.destination.index, 0, reorderedItem);
    }

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    form.setValue("components", updatedItems);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="gradeScale">Grade Scale</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Standard Grading"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this grading configuration"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Classes</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly}
                      onValueChange={(value) => {
                        // Handle multi-select
                        const values: string[] =
                          (field.value as string[]) || [];
                        if (values.includes(value)) {
                          field.onChange(
                            values.filter((v: string) => v !== value),
                          );
                        } else {
                          field.onChange([...values, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select classes" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={(
                                  field.value as string[] | undefined
                                )?.includes(cls._id)}
                                onCheckedChange={(checked) => {
                                  // Handle checkbox state change if needed
                                  console.log(
                                    "Checkbox state changed:",
                                    checked,
                                  );
                                }}
                              />
                              {cls.title}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Selected:{" "}
                    {(field.value as string[] | undefined)?.length ?? 0} classes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apply to Specific Subjects (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly}
                      onValueChange={(value) => {
                        // Handle multi-select
                        const values: string[] =
                          (field.value as string[]) || [];
                        if (values.includes(value)) {
                          field.onChange(
                            values.filter((v: string) => v !== value),
                          );
                        } else {
                          field.onChange([...values, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subjects (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={(
                                  field.value as string[] | undefined
                                )?.includes(subject._id)}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked)
                                }
                              />
                              {subject.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    If no subjects are selected, this configuration will apply
                    to all subjects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={Boolean(field.value)}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set as Default</FormLabel>
                    <FormDescription>
                      This will be used as the default grading configuration
                      when no specific configuration is assigned.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="components" className="space-y-4 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Grading Components</h3>
                <p className="text-sm text-muted-foreground">
                  Define the components that make up the final grade.
                </p>
              </div>

              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentComponents =
                      (form.watch("components") as Array<{
                        key: string;
                        name: string;
                        active: boolean;
                        maxPercentage: number;
                        order: number;
                      }>) || [];
                    form.setValue("components", [
                      ...currentComponents,
                      {
                        key: `component-${currentComponents.length + 1}`,
                        name: `Component ${currentComponents.length + 1}`,
                        active: true,
                        maxPercentage: 0,
                        order: currentComponents.length + 1,
                      },
                    ]);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Component
                </Button>
              )}
            </div>

            {percentageError && (
              <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive">
                Total percentage of active components must equal 100%. Current
                total: {totalPercentage.toFixed(2)}%
              </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="components" isDropDisabled={isReadOnly}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {components.map(
                      (
                        component: {
                          key: string;
                          name: string;
                          active: boolean;
                          maxPercentage: number;
                          order: number;
                        },
                        index: number,
                      ) => (
                        <Draggable
                          key={component.key}
                          draggableId={component.key}
                          index={index}
                          isDragDisabled={isReadOnly}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  {!isReadOnly && (
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}

                                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                    <FormField
                                      control={form.control}
                                      name={`components.${index}.name`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Name</FormLabel>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              disabled={isReadOnly}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`components.${index}.key`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Key</FormLabel>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              disabled={isReadOnly}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`components.${index}.maxPercentage`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Percentage (%)</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min="0"
                                              max="100"
                                              step="0.01"
                                              {...field}
                                              onChange={(e) => {
                                                const value = Number.parseFloat(
                                                  e.target.value,
                                                );
                                                field.onChange(
                                                  isNaN(value) ? 0 : value,
                                                );
                                              }}
                                              disabled={
                                                isReadOnly || !component.active
                                              }
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <FormField
                                      control={form.control}
                                      name={`components.${index}.active`}
                                      render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                          <FormControl>
                                            <Checkbox
                                              checked={Boolean(field.value)}
                                              onCheckedChange={field.onChange}
                                              disabled={isReadOnly}
                                            />
                                          </FormControl>
                                          <FormLabel>Active</FormLabel>
                                        </FormItem>
                                      )}
                                    />

                                    {!isReadOnly && components.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          const currentComponents =
                                            form.getValues(
                                              "components",
                                            ) as Array<{
                                              key: string;
                                              name: string;
                                              active: boolean;
                                              maxPercentage: number;
                                              order: number;
                                            }>;
                                          form.setValue(
                                            "components",
                                            currentComponents.filter(
                                              (_, i) => i !== index,
                                            ),
                                          );
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ),
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="gradeScale" className="space-y-4 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Grade Scale</h3>
                <p className="text-sm text-muted-foreground">
                  Define the grade ranges and their corresponding letter grades.
                </p>
              </div>

              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentGrades = form.watch("gradeScale") as Array<{
                      grade: string;
                      minScore: number;
                      maxScore: number;
                    }>;
                    form.setValue("gradeScale", [
                      ...currentGrades,
                      {
                        grade: "",
                        minScore: 0,
                        maxScore: 0,
                      },
                    ]);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Grade
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {(
                form.watch("gradeScale") as
                  | Array<{ grade: string; minScore: number; maxScore: number }>
                  | undefined
              )?.map((_, index: number) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`gradeScale.${index}.grade`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isReadOnly} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`gradeScale.${index}.minScore`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Score</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => {
                                    const value = Number.parseFloat(
                                      e.target.value,
                                    );
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                  disabled={isReadOnly}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`gradeScale.${index}.maxScore`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Score</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => {
                                    const value = Number.parseFloat(
                                      e.target.value,
                                    );
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                  disabled={isReadOnly}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentGrades = form.getValues(
                              "gradeScale",
                            ) as Array<{
                              grade: string;
                              minScore: number;
                              maxScore: number;
                            }>;
                            form.setValue(
                              "gradeScale",
                              currentGrades.filter((_, i) => i !== index),
                            );
                          }}
                          disabled={
                            (
                              form.watch("gradeScale") as Array<{
                                grade: string;
                                minScore: number;
                                maxScore: number;
                              }>
                            ).length <= 1
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {!isReadOnly && (
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : configId
                  ? "Update Configuration"
                  : "Create Configuration"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
