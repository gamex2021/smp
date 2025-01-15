import { RoleProtected } from "@/components/providers/role-protected";
import { ClassCard } from "@/features/classes/components/classes-card";
import { CreateClassCard } from "@/features/classes/components/create-class";
import { SearchHeader } from "@/features/classes/components/search-header";
import { api } from "../../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

type Params = Promise<{ domain: string }>;

export default async function ClassesPage({ params }: { params: Params }) {
  // get the school domain from the params
  const { domain } = await params;

  // get the classes with fetchQuery since its a server component
  const classes = await fetchQuery(api.queries.class.getClassesData, {
    domain,
  });

  return (
    // only the admin have access to the classes route
    <RoleProtected allowedRoles={["admin"]}>
      <div className="mx-auto max-w-[1600px] p-6">
        <SearchHeader />

        {/* Classes Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {classes?.map((classItem) => (
            <ClassCard
              key={classItem._id}
              name={classItem.title}
              teacher={"Mrs David"}
              students={10}
            />
          ))}
          <CreateClassCard />
        </div>
      </div>
    </RoleProtected>
  );
}
