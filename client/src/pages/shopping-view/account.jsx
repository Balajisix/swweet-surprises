import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin } from "lucide-react";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount({ userName = "Valued Customer" }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-pink-100 to-pink-200">
      {/* Welcome Header - Replaced large banner with a clean welcome section */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-pink-600">Welcome, {userName}!</h1>
              <p className="text-gray-600 mt-1">Manage your sweet surprises account</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <User size={36} className="text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Content Section */}
      <div className="container mx-auto flex-grow py-6 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden">
          {/* Tabs Navigation with Icons */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full flex border-b border-gray-200 bg-pink-50">
              <TabsTrigger 
                value="orders" 
                className="flex-1 flex items-center justify-center gap-2 py-4 text-base font-medium transition-all hover:bg-pink-100"
              >
                <Package size={18} />
                <span className="hidden sm:inline">My Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                className="flex-1 flex items-center justify-center gap-2 py-4 text-base font-medium transition-all hover:bg-pink-100"
              >
                <MapPin size={18} />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="p-4 md:p-6">
              <TabsContent value="orders" className="mt-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order History</h2>
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address" className="mt-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Addresses</h2>
                <Address />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer Section - Simplified and more responsive */}
      <footer className="bg-pink-600 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-lg font-medium mb-3 sm:mb-0">
              Stay connected with us
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-pink-200 transition-colors">Facebook</a>
              <a href="#" className="hover:text-pink-200 transition-colors">Twitter</a>
              <a href="https://www.instagram.com/swweet_surprises/" target="blank" className="hover:text-pink-200 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingAccount;