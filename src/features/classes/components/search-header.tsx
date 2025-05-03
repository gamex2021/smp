"use client";
import * as React from "react";

import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type Props = {
    title?: string;
};
export function SearchHeader({ title }: Props) {
    const pathname = usePathname();
    const params = useParams<{ domain: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const selectedClass = searchParams?.get("class") ?? "";
    console.log(selectedClass);
    // get the classes for this school
    const classes = useQuery(api.queries.class.getClassesData, {
        domain: params.domain,
    });
    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams],
    );
    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{title ?? "All Classes"}</h1>
                {/* <Select
                    disabled={isPending}
                    onValueChange={(e: string) => {
                        startTransition(() => {
                            router.push(
                                `${pathname}?${createQueryString({
                                    class: e,
                                })}`,
                                {
                                    scroll: false,
                                },
                            );
                        });
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue
                            defaultValue={selectedClass}
                            placeholder="Select class"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {classes?.map((item) => (
                            <SelectItem value={item._id} key={item._id}>
                                {item.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search for a class......"
                        className="w-full pl-9"
                    />
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
