import { RoleProtected } from "@/components/providers/role-protected";
import { ClassesClient } from "@/features/classes";

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



  return (
    // only the admin have access to the classes route
    <RoleProtected allowedRoles={["ADMIN"]}>
      <div className="mx-auto max-w-[1600px] p-6">
        <ClassesClient 
          domain={domain} 
          classId={sParams.class} 
        />
      </div>
    </RoleProtected>
  );
}