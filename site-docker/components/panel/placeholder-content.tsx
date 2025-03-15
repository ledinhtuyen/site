import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"

export function PlaceholderContent({
  children, className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // <Card className={cn("rounded-lg border-none", className)}>
    //   <CardContent>
        <div className="flex justify-center items-center min-h-[calc(100vh-115px)] p-6 text-card-foreground">
          <div className="flex flex-col relative w-[1200px]">
            {children}
          </div>
        </div>
    //   </CardContent>
    // </Card>
  );
}

// 100vh-56px-64px-20px-24px-56px-48px
