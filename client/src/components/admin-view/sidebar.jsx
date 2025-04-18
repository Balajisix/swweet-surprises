import React, { Fragment, useEffect, useState } from "react";
import {
  BadgeCheck,
  ShieldCheck, 
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
];

function MenuItems({ setOpen, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-4 sm:mt-8 flex-col flex gap-1 sm:gap-2 w-full">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer text-sm sm:text-base md:text-lg items-center gap-2 rounded-md px-2 sm:px-3 py-2 
              hover:bg-muted hover:text-foreground transition-colors duration-200
              ${isActive ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'}`}
          >
            {menuItem.icon && React.cloneElement(menuItem.icon, { 
              size: isMobile ? 18 : 20 
            })}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-56 sm:w-64 p-4">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-3">
              <SheetTitle className="flex gap-2 items-center mt-3 mb-3">
                <ShieldCheck size={isMobile ? 24 : 28} />
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} isMobile={isMobile} />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-background p-3 sm:p-4 md:p-6 lg:flex lg:w-56 xl:w-64 flex-shrink-0 flex-col transition-all duration-300">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ShieldCheck size={24} />
          <h1 className="text-xl xl:text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems isMobile={false} />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;