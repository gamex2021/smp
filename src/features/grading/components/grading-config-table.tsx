"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Archive, Copy, Star } from "lucide-react";
import { useGradingConfig } from "../providers/grading-config-provider";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useDomain } from "@/context/DomainContext";
import { api } from "~/_generated/api";
import { type Id } from "~/_generated/dataModel";
import { toast } from "sonner";

interface GradingConfigTableProps {
  classFilter: string | null;
  subjectFilter: string | null;
  statusFilter: string | null;
}

export function GradingConfigTable({
  classFilter,
  subjectFilter,
  statusFilter,
}: GradingConfigTableProps) {
  const { openEditModal, openViewModal, openAssignModal } = useGradingConfig();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { school, domain } = useDomain();
  // Get school ID from somewhere in your app (e.g., context, state, etc.)
  // For now, I'll use a placeholder
  const schoolId = school?._id;

  const configs =
    useQuery(
      api.mutations.grading.getGradingConfigsBySchool,
      schoolId
        ? {
            schoolId,
            status: statusFilter ?? undefined,
          }
        : "skip",
    ) ?? [];

  // Filter by class and subject if needed
  const filteredConfigs = configs.filter((config) => {
    let matchesClass = true;
    let matchesSubject = true;

    if (classFilter) {
      matchesClass = config.classIds.includes(classFilter as Id<"classes">);
    }

    if (subjectFilter && config.subjectIds) {
      matchesSubject = config.subjectIds.includes(
        subjectFilter as Id<"subjects">,
      );
    }

    return matchesClass && matchesSubject;
  });

  // Pagination
  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
  const paginatedConfigs = filteredConfigs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Mutations
  const archiveConfig = useMutation(api.mutations.grading.archiveGradingConfig);
  const setDefaultConfig = useMutation(
    api.mutations.grading.setDefaultGradingConfig,
  );
  const activateConfig = useMutation(
    api.mutations.grading.activateGradingConfig,
  );
  const draftConfig = useMutation(api.mutations.grading.draftGradingConfig);
  const updateConfig = useMutation(api.mutations.grading.updateGradingConfig);
  const duplicateConfig = useMutation(
    api.mutations.grading.duplicateGradingConfig,
  );

  // Classes data for displaying class names
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
  const classMap = new Map(classes.map((cls) => [cls._id, cls.title]));

  // Handle actions
  const handleArchive = async (configId: Id<"grading">) => {
    try {
      await archiveConfig({ configId });
      toast.success(
        "The grading configuration has been archived successfully.",
      );
    } catch (error) {
      toast.error("Failed to archive configuration.");
    }
  };

  const handleSetDefault = async (configId: Id<"grading">) => {
    try {
      await setDefaultConfig({ configId });
      toast.success("This configuration is now the default.");
    } catch (error) {
      toast.error("Failed to set as default.");
    }
  };

  const handleDuplicate = async (configId: Id<"grading">, name: string) => {
    try {
      await duplicateConfig({
        configId,
        newName: `${name} (Copy)`,
      });
      toast.success(
        "The grading configuration has been duplicated successfully.",
      );
    } catch (error) {
      toast.error("Failed to duplicate configuration.");
    }
  };

  const handleToggleStatus = async (
    configId: Id<"grading">,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "draft") {
        await activateConfig({ configId });
        toast.success("Configuration has been activated successfully.");
      } else if (currentStatus === "active") {
        await draftConfig({ configId });
        toast.success("Configuration has been set to draft successfully.");
      }
    } catch (error) {
      toast.error("Failed to update configuration status.");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Classes</TableHead>
            <TableHead>Components</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedConfigs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No grading configurations found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedConfigs.map((config) => (
              <TableRow key={config._id}>
                <TableCell className="font-medium">{config.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      config.status === "active"
                        ? "default"
                        : config.status === "draft"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {config.status ?? "draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {config.isDefault && (
                    <Badge variant="default" className="bg-amber-500">
                      Default
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {config.classIds.slice(0, 2).map((classId) => (
                      <Badge key={classId} variant="outline">
                        {classMap.get(classId) ?? "Unknown"}
                      </Badge>
                    ))}
                    {config.classIds.length > 2 && (
                      <Badge variant="outline">
                        +{config.classIds.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {config.components.filter((c) => c.active).length} components
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => openViewModal(config._id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEditModal(config._id)}
                        disabled={config.status === "archived"}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleSetDefault(config._id)}
                        disabled={
                          config.isDefault ?? config.status === "archived"
                        }
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(
                            config._id,
                            config.status ?? "draft",
                          )
                        }
                        disabled={config.status === "archived"}
                      >
                        {config.status === "draft" ? (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Set to Active
                          </>
                        ) : (
                          <>
                            <Archive className="mr-2 h-4 w-4" />
                            Set to Draft
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openAssignModal(config._id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Assign to Classes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(config._id, config.name)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleArchive(config._id)}
                        disabled={config.status === "archived"}
                        className="text-destructive"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 px-4 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
