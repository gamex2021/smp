"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type Props = {
    title?: string;
    setSearch: Dispatch<SetStateAction<string>>
};
export function SearchHeader({ title, setSearch }: Props) {
    
    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{title ?? "All Classes"}</h1>
                
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search for a class......"
                        className="w-full pl-9"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
