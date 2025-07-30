import DockNavigation from "@/components/ui/DockNavigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <footer className="relative w-full">
        <DockNavigation />
      </footer>
    </div>
  );
}
