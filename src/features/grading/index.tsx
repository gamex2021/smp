"use client";

import { GradingConfigTable } from "./components/grading-config-table";
import { GradingHeader } from "./components/grading-header";
import { useState } from "react";
import { GradingConfigProvider } from "./providers/grading-config-provider";

export function Grading() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  return (
    <GradingConfigProvider>
      <div className="flex flex-col gap-6 p-6">
        <GradingHeader
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <GradingConfigTable
          classFilter={selectedClass}
          subjectFilter={selectedSubject}
          statusFilter={statusFilter}
        />
      </div>
    </GradingConfigProvider>
  );
}
