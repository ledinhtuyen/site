import type { SearchParams } from "@/types";
import * as React from "react";
import { headers } from 'next/headers';

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";
import { getValidFilters } from "@/lib/data-table";

import { FeatureFlagsProvider } from "./_components/feature-flags-provider";
import { PromptsTable } from "./_components/prompts-table";
import { getPrompts } from "./_lib/queries";
import { searchParamsCache } from "./_lib/validations";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function IndexPage(props: IndexPageProps) {
  const headersList = await headers();
  const userEmail = headersList.get('x-goog-authenticated-user-email') || "test.user@email.com";

  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  // Fetch all required data on the server
  const promptsPromise = getPrompts({
    page: search.page,
    perPage: search.perPage,
    searchTerm: search.searchTerm || "",
    appName: search.appName || "",
    from: search.from,
    to: search.to,
    userEmail: search.userEmail || "",
    filters: validFilters,
    sort: search.sort || [],
  });

  // Handle any additional server-side computations
  const [prompts] = await Promise.all([promptsPromise]);

  // return (
  //   <Shell className="gap-2">
  //     <FeatureFlagsProvider>
  //       <React.Suspense
  //         fallback={
  //           <DataTableSkeleton
  //             columnCount={7}
  //             searchableColumnCount={1}
  //             filterableColumnCount={1}
  //             cellWidths={["10rem", "10rem", "10rem", "8rem", "8rem", "8rem", "4rem"]}
  //             shrinkZero
  //           />
  //         }
  //       >
  //         <PromptsTable 
  //           promises={Promise.all([prompts])}
  //           userEmail={userEmail}
  //         />
  //       </React.Suspense>
  //     </FeatureFlagsProvider>
  //   </Shell>
  // );
  return <>HH</>
}

// // Enable static page generation with dynamic params
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";