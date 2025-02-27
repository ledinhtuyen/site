import { Navbar } from "@/components/panel/navbar";

export function ContentLayout({ title, children }) {
  return (
    <div>
      <Navbar title={title} />
      {children}
    </div>
  );
}
