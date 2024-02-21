import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { DashboardNav } from "./DashboardNav";
import { navItems } from "../../constants";

// import { Playlist } from "../data/playlists";

// interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
//   // playlists: Playlist[];
// }
// { className }: SidebarProps
export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Ehtikam
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
