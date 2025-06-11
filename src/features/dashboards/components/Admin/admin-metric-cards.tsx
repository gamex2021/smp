/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Banknote, NotebookTabs, UserPen, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useDomain } from "@/context/DomainContext";

type Props = object;

const AdminMetricCards = (props: Props) => {
  const params = useParams();
  const domain = params.domain as string;
  const { school } = useDomain();


  // TODO: TOTAL NUMBER OF STUDENTS
  const studentsNumber = useQuery(
    api.queries.analytics.fetchTotalStudents,
    school?._id
      ? {
          schoolId: school?._id,
        }
      : "skip",
  );

  // TODO: TOTAL NUMBER OF TEACHERS
  const teacherNumber = useQuery(
    api.queries.analytics.fetchTotalTeachers,
    school?._id
      ? {
          schoolId: school?._id,
        }
      : "skip",
  );

  // TODO: TOTAL NUMBER OF SUBJECTS
  const subjectNumber = useQuery(
    api.queries.analytics.fetchTotalSubjects,
    school?._id
      ? {
          schoolId: school?._id,
        }
      : "skip",
  );
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-1 xl:grid-cols-2">
      <MetricCard
        icon={Users}
        title="Total number of students"
        value={studentsNumber ?? 0}
      />
      <MetricCard
        icon={UserPen}
        title="Total number of teachers"
        value={teacherNumber ?? 0}
      />
      <MetricCard
        icon={NotebookTabs}
        title="Total number of subjects"
        value={subjectNumber ?? 0}
      />
      <MetricCard icon={Banknote} title="Total revenue" value="₦1000" />
    </div>
  );
};

export default AdminMetricCards;
