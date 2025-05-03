"use client";

import * as React from "react";

import { api } from "~/_generated/api";
import { useQuery } from "convex/react";
import { ClassCard } from "@/features/classes/components/classes-card";
import { type Id } from "~/_generated/dataModel";
import { CreateClassGroup } from "./create-class-group";

type Props = {
  domain: string;
  classId: string;
};
export function Classes({ domain, classId }: Props) {
  const groups = useQuery(api.queries.group.getClassGroupsData, {
    domain,
    classId: classId as Id<"classes">,
  });

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {groups?.map((classItem) => (
          <ClassCard
            key={classItem._id}
            name={classItem.title}
            teacher={"Mrs David"}
            students={10}
          />
        ))}
        <CreateClassGroup classId={classId} />
      </div>
    </div>
  );
}
