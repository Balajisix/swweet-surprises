import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* Menu Toggle Button */}
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Centered Title */}
      <div className="flex-1 text-center">
        <h1
          className="text-xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-transparent bg-clip-text animate-gradient-move hover:scale-105 transition-transform duration-500 cursor-pointer"
        >
          Swweet Surprises
        </h1>
      </div>


      {/* Logout Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
