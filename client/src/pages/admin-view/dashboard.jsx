import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  ChevronRight,
  Clock,
  ChevronDown,
} from "lucide-react";

import BACKEND_URL from '../../config/url';

function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Data from backend
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    conversionRate: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    conversionGrowth: 0,
    graphData: [], 
    productCategoryData: [],
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/dashboard-stats`);
        const data = await res.json();
        if (data.success) {
          setDashboardData({
            totalSales: data.totalSales || 0,
            totalOrders: data.totalOrders || 0,
            totalUsers: data.totalUsers || 0,
            conversionRate: data.conversionRate || 0,
            salesGrowth: data.salesGrowth || 0,
            ordersGrowth: data.ordersGrowth || 0,
            usersGrowth: data.usersGrowth || 0,
            conversionGrowth: data.conversionGrowth || 0,
            graphData: data.graphData || [],
            productCategoryData:  [{ "category": "Mugs", "totalSales": 5000 },
              { "category": "Photo frame", "totalSales": 8089 },
              { "category": "Keychains", "totalSales": 10000 }],
          });
        }
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/orders/recent`);
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };
    fetchRecentOrders();
  }, []);

  const getSalesDataForChart = () => {
    return dashboardData.graphData.map((item) => ({
      name: item._id,
      totalSales: item.totalSales,
    }));
  };

  const getCategoryDataForChart = () => {
    const data = dashboardData.productCategoryData.map((cat) => ({
      name: cat.category,
      value: cat.totalSales,
    }));
    return data;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StatCard = ({ title, value, icon, color, growth }) => (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className={`rounded-full p-2 sm:p-3 ${color}`}>{icon}</div>
        <div
          className={`flex items-center text-xs sm:text-sm font-medium ${
            growth >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {growth >= 0 ? (
            <ArrowUp size={16} className="mr-1" />
          ) : (
            <ArrowDown size={16} className="mr-1" />
          )}
          {Math.abs(growth)}%
        </div>
      </div>
      <div>
        <h3 className="text-lg sm:text-2xl font-bold mb-1">{value}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  const COLORS = ["#4F46E5", "#EC4899", "#10B981", "#F59E0B", "#6B7280", "#E879F9"];

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.orderStatus?.toLowerCase() === activeFilter.toLowerCase();
  });

  const OrderCard = ({ order, isExpanded, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow mb-3 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onClick(order)}
    >
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
            {order?.userId?.userName ? order?.userId?.userName.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <div className="font-medium">{order?.userId?.userName || "Anonymous"}</div>
            <div className="text-xs text-gray-500">
              ID: {order._id?.substring(0, 8)}...
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold">₹{order.totalAmount}</div>
          <span className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Status:</span>
            <span>{order.orderStatus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">₹{order.totalAmount}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 flex items-center">
            <Calendar size={14} className="mr-1" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 sm:mb-6">
        <StatCard
          title="Total Sales"
          value={`₹${dashboardData.totalSales.toLocaleString()}`}
          icon={<DollarSign size={isMobile ? 16 : 20} className="text-white" />}
          color="bg-gradient-to-r from-blue-500 to-indigo-600"
          growth={dashboardData.salesGrowth}
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          icon={<ShoppingBag size={isMobile ? 16 : 20} className="text-white" />}
          color="bg-gradient-to-r from-purple-500 to-pink-600"
          growth={dashboardData.ordersGrowth}
        />
        <StatCard
          title="Customers"
          value={dashboardData.totalUsers.toLocaleString()}
          icon={<Users size={isMobile ? 16 : 20} className="text-white" />}
          color="bg-gradient-to-r from-green-500 to-emerald-600"
          growth={dashboardData.usersGrowth}
        />
        <StatCard
          title="Conversion Rate"
          value={`${dashboardData.conversionRate}%`}
          icon={<Activity size={isMobile ? 16 : 20} className="text-white" />}
          color="bg-gradient-to-r from-amber-500 to-orange-600"
          growth={dashboardData.conversionGrowth}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold flex items-center">
                <DollarSign size={20} className="text-blue-500 mr-2" />
                Sales Overview
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Revenue statistics by day
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <select className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 py-1 bg-gray-50">
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
            </div>
          </div>
          <div className="h-48 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getSalesDataForChart()}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
                <XAxis
                  dataKey="name"  
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 50}
                />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Sales"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#4F46E5"
                  strokeWidth={isMobile ? 2 : 3}
                  fill="url(#colorSales)"
                  activeDot={{ r: isMobile ? 4 : 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold flex items-center">
                <ShoppingBag size={20} className="text-purple-500 mr-2" />
                Product Categories
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Sales distribution by category
              </p>
            </div>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCategoryDataForChart()}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"    
                  nameKey="name"
                  label={
                    isMobile
                      ? null
                      : ({ name, value, percent }) =>
                          `${name} ₹${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={!isMobile}
                >
                  {getCategoryDataForChart().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center">
              <Clock size={20} className="text-indigo-500 mr-2" />
              Recent Orders
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Overview of latest transactions
            </p>
          </div>
          
          <div className="flex items-center mt-2 sm:mt-0 w-full sm:w-auto">
            <div className="flex gap-2 items-center overflow-x-auto pb-2 w-full sm:w-auto">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`text-xs px-3 py-1 rounded-full transition-colors flex-shrink-0 ${
                  activeFilter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('pending')}
                className={`text-xs px-3 py-1 rounded-full transition-colors flex-shrink-0 ${
                  activeFilter === 'pending' 
                    ? 'bg-yellow-100 text-yellow-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button 
                onClick={() => setActiveFilter('processing')}
                className={`text-xs px-3 py-1 rounded-full transition-colors flex-shrink-0 ${
                  activeFilter === 'processing' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Processing
              </button>
              <button 
                onClick={() => setActiveFilter('completed')}
                className={`text-xs px-3 py-1 rounded-full transition-colors flex-shrink-0 ${
                  activeFilter === 'completed' 
                    ? 'bg-green-100 text-green-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ShoppingBag size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-sm text-gray-400">Try changing your filter or check back later</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden mt-2">
              {(isTableExpanded ? filteredOrders : filteredOrders.slice(0, 5)).map((order) => (
                <OrderCard 
                  key={order._id} 
                  order={order} 
                  isExpanded={selectedOrder?._id === order._id}
                  onClick={(order) => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                />
              ))}
              
              {filteredOrders.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsTableExpanded(!isTableExpanded)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mx-auto"
                  >
                    {isTableExpanded ? "Show Less" : "View All Orders"}
                    <ChevronDown size={16} className={`ml-1 transition-transform ${isTableExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="hidden sm:block overflow-x-auto mt-2">
              <table className="w-full">
                <thead className="bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {(isTableExpanded ? filteredOrders : filteredOrders.slice(0, 5)).map((order) => (
                    <tr 
                      key={order._id} 
                      className="text-sm hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{order._id?.substring(0, 8)}...</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-2">
                            {order?.userId?.userName ? order?.userId?.userName.charAt(0).toUpperCase() : "?"}
                          </div>
                          <span>{order?.userId?.userName || "Anonymous"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right font-medium">
                        ₹{order.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsTableExpanded(!isTableExpanded)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mx-auto"
                  >
                    {isTableExpanded ? "Show Less" : "View All Orders"}
                    <ChevronRight size={16} className={`ml-1 transition-transform ${isTableExpanded ? "rotate-90" : ""}`} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;