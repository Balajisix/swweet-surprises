import { AlignJustify, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-background border-b sticky top-0 z-10">
      {/* Menu Toggle Button */}
      <Button 
        onClick={() => setOpen(true)} 
        className="lg:hidden block p-1 sm:p-2" 
        variant="ghost" 
        size="sm"
      >
        <AlignJustify size={isMobile ? 20 : 24} />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Swweet Surprise Title */}
      <div className="flex-1 text-center">
        <h1
          className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-transparent bg-clip-text animate-gradient-move hover:scale-105 transition-transform duration-500 cursor-pointer truncate px-2"
        >
          Swweet Surprises
        </h1>
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        {isSmallScreen ? (
          <Button
            onClick={handleLogout}
            className="p-1 sm:p-2"
            variant="ghost"
            size="sm"
            aria-label="Logout"
          >
            <LogOut size={isMobile ? 20 : 24} />
          </Button>
        ) : (
          <Button
            onClick={handleLogout}
            className="inline-flex gap-1 sm:gap-2 items-center rounded-md px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium shadow"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;