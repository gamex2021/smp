"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type Id } from "~/_generated/dataModel";

type ClassroomContextType = {
  subjectTeacherId: Id<"subjectTeachers">;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isGradingModalOpen: boolean;
  openGradingModal: (studentId: Id<"users">) => void;
  closeGradingModal: () => void;
  selectedStudentId: Id<"users"> | null;
  isAssignmentModalOpen: boolean;
  openAssignmentModal: () => void;
  closeAssignmentModal: () => void;
  isMaterialModalOpen: boolean;
  openMaterialModal: () => void;
  closeMaterialModal: () => void;
};

const ClassroomContext = createContext<ClassroomContextType | undefined>(
  undefined,
);

interface ClassroomProviderProps {
  children: ReactNode;
  subjectTeacherId: Id<"subjectTeachers">;
}

export function ClassroomProvider({
  children,
  subjectTeacherId,
}: ClassroomProviderProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] =
    useState<Id<"users"> | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const openGradingModal = (studentId: Id<"users">) => {
    setSelectedStudentId(studentId);
    setIsGradingModalOpen(true);
  };

  const closeGradingModal = () => {
    setIsGradingModalOpen(false);
    setSelectedStudentId(null);
  };

  const openAssignmentModal = () => setIsAssignmentModalOpen(true);
  const closeAssignmentModal = () => setIsAssignmentModalOpen(false);

  const openMaterialModal = () => setIsMaterialModalOpen(true);
  const closeMaterialModal = () => setIsMaterialModalOpen(false);

  return (
    <ClassroomContext.Provider
      value={{
        subjectTeacherId,
        activeTab,
        setActiveTab,
        isGradingModalOpen,
        openGradingModal,
        closeGradingModal,
        selectedStudentId,
        isAssignmentModalOpen,
        openAssignmentModal,
        closeAssignmentModal,
        isMaterialModalOpen,
        openMaterialModal,
        closeMaterialModal,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (context === undefined) {
    throw new Error("useClassroom must be used within a ClassroomProvider");
  }
  return context;
};
