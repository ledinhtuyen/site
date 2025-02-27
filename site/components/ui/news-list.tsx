"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const NewsList = React.forwardRef(({ className, children, newsItems, ...props } : any, ref) => {
    return (
        <Card
            className={className}
            ref={ref}
            {...props}
        >
            <CardContent>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">ニュース一覧</h1>
                <ul className="space-y-2">
                    {newsItems.map((item : any, index : any) => (
                        <li key={index} className="border-b border-gray-300 last:border-b-0 pb-2">
                            <div className="flex items-center space-x-4">
                                <time className="text-sm text-gray-500 whitespace-nowrap" dateTime={item.date}>
                                    {new Date(item.date).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
                                </time>
                                <h2 className="text-base font-semibold truncate text-gray-700">{item.title}</h2>
                            </div>
                        </li>
                    ))}
                    <li className="border-b border-gray-300 last:border-b-0">
                        <h2 className="text-base font-semibold truncate text-gray-700">
                            More
                        </h2>
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
});
NewsList.displayName = "NewsList";

export { NewsList };
