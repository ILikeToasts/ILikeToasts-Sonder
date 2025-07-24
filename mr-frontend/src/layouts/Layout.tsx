import DockNavigation from "@/components/ui/DockNavigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>{/* <Header/> */}</header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="relative w-full">
        <DockNavigation />
      </footer>
    </div>
  );
}
