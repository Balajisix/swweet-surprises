import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

// Assuming userName is passed as a prop or fetched from a global state/context
function ShoppingAccount({ userName }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-pink-200 to-pink-300">
      {/* Hero Image Section with Soft Glassmorphism */}
      <div className="relative h-[350px] w-full overflow-hidden mb-8 rounded-xl shadow-lg">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account Hero"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold text-center tracking-widest drop-shadow-lg">
            Welcome, {userName}!
          </h1>
        </div> */}
      </div>

      {/* Account Content Section with Soft Glassmorphism */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8 px-4 lg:px-6">
        <div className="flex flex-col rounded-xl bg-white bg-opacity-70 backdrop-blur-lg shadow-xl border border-gray-200 p-6">
          {/* Tabs Navigation with Hover Effect */}
          <Tabs defaultValue="orders">
            <TabsList className="flex justify-center mb-4 border-b border-gray-300">
              <TabsTrigger
                value="orders"
                className="text-xl font-medium text-gray-700 px-6 py-3 rounded-t-lg focus:outline-none transition-transform hover:scale-105 hover:bg-pink-100 hover:text-pink-600"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="text-xl font-medium text-gray-700 px-6 py-3 rounded-t-lg focus:outline-none transition-transform hover:scale-105 hover:bg-pink-100 hover:text-pink-600"
              >
                Address
              </TabsTrigger>
            </TabsList>

            {/* Tab Content with Smooth Transitions */}
            <TabsContent value="orders" className="p-6">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="p-6">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer Section with Light Pink Theme */}
      <footer className="bg-pink-300 py-6 mt-8">
        <div className="container mx-auto text-center">
          <div className="text-gray-700 text-[25px] font-medium mb-4">
            Stay connected with us...
          </div>
          <div className="flex justify-center space-x-4 text-white">
            <a href="" className="hover:text-pink-600">Facebook</a>
            <a href="#" className="hover:text-pink-600">Twitter</a>
            <a href="https://www.instagram.com/swweet_surprises/" target="blank" className="hover:text-pink-600">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingAccount;
