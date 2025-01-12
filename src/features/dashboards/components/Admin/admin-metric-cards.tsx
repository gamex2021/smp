"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Banknote, NotebookTabs, UserPen, Users } from "lucide-react";
import { useParams } from "next/navigation";

type Props = object;

const AdminMetricCards = (props: Props) => {
  const params = useParams();
  const domain = params.domain as string;

  const schoolMatrics = useQuery(api.queries.matrics.fetchSchoolMatrics, {
    domain: domain ?? "",
  });

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-1 xl:grid-cols-2">
      <MetricCard
        icon={Users}
        title="Total number of students"
        value={schoolMatrics?.students?.length ?? 0}
      />
      <MetricCard
        icon={UserPen}
        title="Total number of teachers"
        value={schoolMatrics?.teachers?.length ?? 0}
      />
      <MetricCard
        icon={NotebookTabs}
        title="Total number of subjects"
        value="12"
      />
      <MetricCard icon={Banknote} title="Total revenue" value="₦1000" />
    </div>
  );
};

export default AdminMetricCards;
