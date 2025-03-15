import type { SearchParams } from "@/types";
import * as React from "react";
import { headers } from 'next/headers';

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/ui/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/ui/date-range-picker";

import { getValidFilters } from "@/lib/data-table";
import { FeatureFlagsProvider } from "./_components/feature-flags-provider";
import { PromptsTable } from "./_components/prompts-table";
import { getPrompts } from "./_lib/queries";
import { searchParamsCache } from "./_lib/validations";
import { ContentLayout } from "@/components/panel/content-layout";
import { PlaceholderContent } from "@/components/panel/placeholder-content";
import { AnimatedConstellation } from "@/components/ui/animated-constellation"
import { i18n } from "@/i18n/config";

interface PromptPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PromptPage(props: PromptPageProps) {
  const headersList = await headers();
  const userEmail = headersList.get('x-goog-authenticated-user-email')?.replace("accounts.google.com:", "") || "test.user@email.com";

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

  return (
    <ContentLayout title="Prompt">
      <AnimatedConstellation>
        <PlaceholderContent>
          <Shell className="gap-2">
            {/* <FeatureFlagsProvider> */}
              {/* <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
                <DateRangePicker
                  triggerSize="sm"
                  triggerClassName="ml-auto w-56 sm:w-60"
                  align="end"
                  shallow={false}
                />
              </React.Suspense> */}
              <React.Suspense
                fallback={
                  <DataTableSkeleton
                    columnCount={7}
                    searchableColumnCount={1}
                    filterableColumnCount={1}
                    cellWidths={["10rem", "10rem", "10rem", "8rem", "8rem", "8rem", "4rem"]}
                    shrinkZero
                  />
                }
              >
                <PromptsTable promises={Promise.all([promptsPromise])} userEmail={userEmail} />
              </React.Suspense>
            {/* </FeatureFlagsProvider> */}
          </Shell>
        </PlaceholderContent>
      </AnimatedConstellation>
    </ContentLayout>
  );
}
