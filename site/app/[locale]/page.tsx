"use client";

import { ContentLayout } from "@/components/panel/content-layout";
import { Main } from "@/components/home/main";

export default function HomePage() {
  return (
    <ContentLayout title="Home">
      <Main />
    </ContentLayout>
  );
}
