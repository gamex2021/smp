"use client";

import { Button } from "@/components/ui/button";
import { Classes } from "@/features/classes/components/classes";
import { ClassCard } from "@/features/classes/components/classes-card";
import { CreateClassCard } from "@/features/classes/components/create-class";
import { SearchHeader } from "@/features/classes/components/search-header";
import { usePaginatedQuery, usePreloadedQuery } from "convex/react";
import { useState } from "react";
import { api } from "~/_generated/api";

export function ClassesClient({
  domain,
  classId,
}: {
  domain: string;
  classId?: string;
}) {
  // this is for the search state
  const [search, setSearch] = useState<string>("");
  // get the classes here , which should be paginated
  const {
    results: classes,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.class.getClassesData,
    domain ? { domain, search } : "skip",
    { initialNumItems: 12 },
  );

  return (
    <>
      <SearchHeader
        title={classes?.find((item) => item._id === classId)?.title}
        setSearch={setSearch}
      />
      {/* // ? class card grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {classes?.map((classItem) => (
          <ClassCard
            key={classItem._id}
            name={classItem.title}
            teacher={"Mrs David"}
            classItem={classItem}
            students={10}
          />
        ))}
        <CreateClassCard />
      </div>

      {/* // * This is for the pagination , to load more of the class */}
      {status === "CanLoadMore" && (
        <div className="mt-8 flex justify-center">
          <Button
            role="button"
            aria-label="Load more teachers"
            onClick={() => loadMore(12)}
            variant="outline"
            className="px-8"
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
