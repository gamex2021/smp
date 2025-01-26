import { RoleProtected } from "@/components/providers/role-protected";
import { ClassCard } from "@/features/classes/components/classes-card";
import { CreateClassCard } from "@/features/classes/components/create-class";
import { SearchHeader } from "@/features/classes/components/search-header";
import { api } from "../../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Classes } from "@/features/classes/components/classes";

type Params = Promise<{ domain: string }>;
type SearchParams = Promise<{ class: string }>;

export default async function ClassesPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  // get the school domain from the params
  const { domain } = await params;
  const sParams = await searchParams;

  // get the classes with fetchQuery since its a server component
  const classes = await fetchQuery(api.queries.class.getClassesData, {
    domain,
  });

  return (
    // only the admin have access to the classes route
    <RoleProtected allowedRoles={["admin"]}>
      <div className="mx-auto max-w-[1600px] p-6">
        <SearchHeader
          title={classes?.find((item) => item._id === sParams.class)?.title}
        />
        {sParams.class ? (
          <Classes domain={domain} classId={sParams.class} />
        ) : (
          // class card grid
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
        )}
      </div>
    </RoleProtected>
  );
}
