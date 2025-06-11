"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type Id } from "~/_generated/dataModel";

type GradingConfigContextType = {
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  isEditModalOpen: boolean;
  openEditModal: (configId: Id<"grading">) => void;
  closeEditModal: () => void;
  isViewModalOpen: boolean;
  openViewModal: (configId: Id<"grading">) => void;
  closeViewModal: () => void;
  isAssignModalOpen: boolean;
  openAssignModal: (configId: Id<"grading">) => void;
  closeAssignModal: () => void;
  currentConfigId: Id<"grading"> | null;
};

const GradingConfigContext = createContext<
  GradingConfigContextType | undefined
>(undefined);

export function GradingConfigProvider({ children }: { children: ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentConfigId, setCurrentConfigId] = useState<Id<"grading"> | null>(
    null,
  );

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (configId: Id<"grading">) => {
    setCurrentConfigId(configId);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openViewModal = (configId: Id<"grading">) => {
    setCurrentConfigId(configId);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => setIsViewModalOpen(false);

  const openAssignModal = (configId: Id<"grading">) => {
    setCurrentConfigId(configId);
    setIsAssignModalOpen(true);
  };
  const closeAssignModal = () => setIsAssignModalOpen(false);

  return (
    <GradingConfigContext.Provider
      value={{
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        isEditModalOpen,
        openEditModal,
        closeEditModal,
        isViewModalOpen,
        openViewModal,
        closeViewModal,
        isAssignModalOpen,
        openAssignModal,
        closeAssignModal,
        currentConfigId,
      }}
    >
      {children}
    </GradingConfigContext.Provider>
  );
}

export const useGradingConfig = () => {
  const context = useContext(GradingConfigContext);
  if (context === undefined) {
    throw new Error(
      "useGradingConfig must be used within a GradingConfigProvider",
    );
  }
  return context;
};
