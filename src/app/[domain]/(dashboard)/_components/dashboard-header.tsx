"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { Bell } from "lucide-react";
import Image from "next/image";
import { api } from "~/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDomain } from "@/context/DomainContext";

export function DashboardHeader() {
  // GET THE USER USING THE QUERY CONVEX OPTION

  const user = useQuery(api.queries.user.currentUser);
  const { signOut } = useAuthActions();
  const router = useRouter();
  const { school } = useDomain();

  //  *GET THE CURRENT ACADEMIC YEAR AND TERM OF THE SCHOOL
  const currentAcademicConfig = useQuery(
    api.queries.academic.getCurrentTerm,
    school?._id ? { schoolId: school._id } : "skip",
  );

  // function to logout and go straight to the login page of the tenant
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 min-h-[75px] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around gap-4 px-4">
        <h1 className="text-lg font-semibold">
          {currentAcademicConfig?.year}.{currentAcademicConfig?.termNumber}
        </h1>
        <div className="flex w-full items-center justify-end gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex h-8 w-8 rounded-full"
              >
                <Image
                  src={"/images/emma.png"}
                  alt={user?.name ?? "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>

            {/* <Image
                            src={"/images/emma.png"}
                            alt={user?.name ?? 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                        /> */}
            {/* the name and role */}
            <div className="item-start flex flex-col">
              <h1 className="text-start text-[14px] font-medium leading-[21.84px] text-[#11321F]">
                {user?.name}
              </h1>
              <h1 className="text-start text-[14px] font-medium leading-[21.84px] text-[#11321F99]">
                {user?.role}
              </h1>
            </div>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role}
                  </p>
                  <p>2023/2024.1</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
