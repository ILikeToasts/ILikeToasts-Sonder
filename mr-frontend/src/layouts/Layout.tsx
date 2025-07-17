import Header from "@/components/ui/AppHeader";
import DockNavigation from "@/components/ui/DockNavigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>{/* <Header/> */}</header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="relative">
        <DockNavigation />
      </footer>
    </div>
  );
}
