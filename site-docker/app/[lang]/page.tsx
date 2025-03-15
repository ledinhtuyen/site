import { ContentLayout } from "@/components/panel/content-layout";
import { Main } from "@/components/home/main";
import { getLatestNews } from "@/db/news";
// import { NewsList } from "@/components/ui/news-list";
import { NewsCarousel } from "@/components/home/news-carousel";

export default async function HomePage() {
  const newsItems = await getLatestNews(5);

  return (
    <ContentLayout title="Home">
      <Main>
        <NewsCarousel
          newsItems={newsItems}
        />
      </Main>
    </ContentLayout>
  );
}
