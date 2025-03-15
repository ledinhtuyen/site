import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { News } from "@/types/news";

interface NewsListProps {
  className?: string;
  newsItems: News[];
  children?: React.ReactNode;
  [key: string]: any;
}

const NewsList = React.forwardRef<HTMLDivElement, NewsListProps>(
  ({ className, children, newsItems, ...props }, ref) => {
    return (
      <Card className={className} ref={ref} {...props}>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">ニュース一覧</h1>
          <ul className="space-y-2">
            {newsItems.map((item: News) => (
              <li key={item.id} className="border-b border-gray-300 dark:border-gray-600 last:border-b-0">
                <Link href={item.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <div className="flex items-center space-x-4">
                    <time className="text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap" dateTime={item.postDate.toISOString()}>
                      {item.postDate.toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                    <h2 className="text-base font-semibold truncate text-gray-700 dark:text-gray-200">{item.title}</h2>
                  </div>
                </Link>
              </li>
            ))}
            <li className="border-b border-gray-300 dark:border-gray-600 last:border-b-0">
              <h2 className="text-base font-semibold truncate text-gray-700 dark:text-gray-200">
                More
              </h2>
            </li>
          </ul>
        </CardContent>
      </Card>
    );
  }
);

NewsList.displayName = "NewsList";

export { NewsList };
