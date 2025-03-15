import { createNews } from "./news";

async function seedNews() {
  try {
    // Sample news data
    const sampleNews = [
      {
        title: "生成AI利活用ガイドラインが更新されました",
        postDate: new Date("2025-01-30"),
        link: "https://intra.ebara.com/grp/12/it/00/12/1483894_108044.html"
      },
      {
        title: "Googleに荏原製作所の取り組みが掲載されました",
        postDate: new Date("2024-11-26"),
        link: "https://cloud.google.com/blog/ja/topics/customers/ebaras-dx-frontline?hl=ja"
      },
      {
        title: "EBARA AI Chatを社外ホームページへ掲載しました",
        postDate: new Date("2024-11-11"),
        link: "https://www.ebara.co.jp/corporate/newsroom/release/company/detail/1221953_1673.html"
      },
      {
        title: "チャットボットのシステム移行を行いました",
        postDate: new Date("2024-10-21"),
        link: "https://intra.ebara.com/grp/12/it/00/12/1486008_108044.html"
      },
      {
        title: "EBARA AI Chat説明会を行いました",
        postDate: new Date("2024-08-27"),
        link: "https://intra.ebara.com/grp/tool/studygroup/00/02/1484722_108385.html"
      }
    ];
    
    // Create the sample news items
    const createdNews = [];
    for (const newsData of sampleNews) {
      const news = await createNews(newsData);
      createdNews.push(news);
    }
    
    console.log("Sample news created:", createdNews);
  } catch (error) {
    console.error("Failed to seed news:", error);
  }
}

async function runSeed() {
  console.log("⏳ Running news seed...");

  const start = Date.now();

  await seedNews();

  const end = Date.now();

  console.log(`✅ News seed completed in ${end - start}ms`);

  process.exit(0);
}

runSeed().catch((err) => {
  console.error("❌ News seed failed");
  console.error(err);
  process.exit(1);
});
