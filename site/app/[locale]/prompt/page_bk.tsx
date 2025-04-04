import { ContentLayout } from "@/components/panel/content-layout";
import { Note } from "@/components/ui/note";
// import * as React from "react";

// import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
// // import { DateRangePicker } from "@/components/date-range-picker";
// // import { Shell } from "@/components/shell";
// import { Skeleton } from "@/components/ui/skeleton";
// import { getValidFilters } from "@/lib/data-table/data-table";

// import { FeatureFlagsProvider } from "./_components/feature-flags-provider";
// import { TasksTable } from "./_components/tasks-table";
// import {
//   getTaskPriorityCounts,
//   getTaskStatusCounts,
//   getTasks,
// } from "./_lib/queries";
// import { searchParamsCache } from "./_lib/validations";

export default async function PromptsPage() {
  // const searchParams = await props.searchParams;
  // const search = searchParamsCache.parse(searchParams);

  // const validFilters = getValidFilters(search.filters);

  // const promises = Promise.all([
  //   getTasks({
  //     ...search,
  //     filters: validFilters,
  //   }),
  //   getTaskStatusCounts(),
  //   getTaskPriorityCounts(),
  // ]);

  return (
    // <Shell className="gap-2">
      // <FeatureFlagsProvider>
      //   <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
      //     {/* <DateRangePicker
      //       triggerSize="sm"
      //       triggerClassName="ml-auto w-56 sm:w-60"
      //       align="end"
      //       shallow={false}
      //     /> */}
      //   </React.Suspense>
      //   <React.Suspense
      //     fallback={
      //       <DataTableSkeleton
      //         columnCount={6}
      //         searchableColumnCount={1}
      //         filterableColumnCount={2}
      //         cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
      //         shrinkZero
      //       />
      //     }
      //   >
      //     <TasksTable promises={promises} />
      //   </React.Suspense>
      // </FeatureFlagsProvider>
    // </Shell>
    <ContentLayout title={"Prompts"}>
      <Note>
        This is a prompt page. It is a placeholder for a page that will be
        created in the future.
      </Note>
    </ContentLayout>
  );
}
