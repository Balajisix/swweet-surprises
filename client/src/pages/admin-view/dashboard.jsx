import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Activity, ArrowDown, ArrowUp, Calendar, ChevronDown, DollarSign, Filter, MoreHorizontal, RefreshCw, Search, ShoppingBag, Users } from "lucide-react";

function AdminDashboard() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [showDropdown, setShowDropdown] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 24950,
    totalOrders: 156,
    totalCustomers: 89,
    conversionRate: 3.2,
    salesGrowth: 12.4,
    ordersGrowth: 8.7,
    customersGrowth: 5.3,
    conversionGrowth: -1.2
  });

  // Sample data for the charts
  const salesData = [
    { name: 'Jan', sales: 4000, profit: 2400, loss: 1600 },
    { name: 'Feb', sales: 3000, profit: 1600, loss: 1400 },
    { name: 'Mar', sales: 5000, profit: 2800, loss: 2200 },
    { name: 'Apr', sales: 2780, profit: 1890, loss: 890 },
    { name: 'May', sales: 1890, profit: 1090, loss: 800 },
    { name: 'Jun', sales: 2390, profit: 1590, loss: 800 },
    { name: 'Jul', sales: 3490, profit: 2090, loss: 1400 }
  ];

  const dailyData = [
    { name: 'Mon', sales: 890 },
    { name: 'Tue', sales: 1200 },
    { name: 'Wed', sales: 1450 },
    { name: 'Thu', sales: 970 },
    { name: 'Fri', sales: 1650 },
    { name: 'Sat', sales: 1790 },
    { name: 'Sun', sales: 1100 }
  ];

  const weeklyData = [
    { name: 'W1', sales: 4200 },
    { name: 'W2', sales: 3800 },
    { name: 'W3', sales: 5100 },
    { name: 'W4', sales: 4600 }
  ];

  // Sample recent orders
  const recentOrders = [
    { id: '#ORD-7845', customer: 'John Doe', date: '15 Apr 2025', status: 'Completed', amount: '$129.99' },
    { id: '#ORD-7844', customer: 'Sarah Smith', date: '14 Apr 2025', status: 'Processing', amount: '$89.99' },
    { id: '#ORD-7843', customer: 'Michael Brown', date: '14 Apr 2025', status: 'Completed', amount: '$259.50' },
    { id: '#ORD-7842', customer: 'Emma Wilson', date: '13 Apr 2025', status: 'Shipped', amount: '$149.95' },
    { id: '#ORD-7841', customer: 'James Taylor', date: '12 Apr 2025', status: 'Pending', amount: '$79.99' }
  ];

  // Product category data for pie chart
  const categoryData = [
    { name: 'Electronics', value: 42 },
    { name: 'Clothing', value: 28 },
    { name: 'Books', value: 15 },
    { name: 'Home & Kitchen', value: 10 },
    { name: 'Other', value: 5 }
  ];
  
  const COLORS = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#6B7280'];

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getActiveData = () => {
    switch(activeTab) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      default: return salesData;
    }
  };

  const StatCard = ({ title, value, icon, color, growth }) => (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {growth >= 0 ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
          {Math.abs(growth)}%
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Completed': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your admin dashboard</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
            <button 
              className={`flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 ${isLoading ? 'animate-spin' : ''}`}
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Sales" 
          value={`$${dashboardStats.totalSales.toLocaleString()}`} 
          icon={<DollarSign size={20} className="text-white" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          growth={dashboardStats.salesGrowth}
        />
        <StatCard 
          title="Total Orders" 
          value={dashboardStats.totalOrders} 
          icon={<ShoppingBag size={20} className="text-white" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          growth={dashboardStats.ordersGrowth}
        />
        <StatCard 
          title="Customers" 
          value={dashboardStats.totalCustomers} 
          icon={<Users size={20} className="text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
          growth={dashboardStats.customersGrowth}
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${dashboardStats.conversionRate}%`} 
          icon={<Activity size={20} className="text-white" />}
          color="bg-gradient-to-r from-amber-500 to-amber-600"
          growth={dashboardStats.conversionGrowth}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Sales Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue statistics</p>
            </div>
            <div className="flex mt-3 sm:mt-0 bg-gray-100 rounded-lg p-1">
              <button 
                className={`px-3 py-1 text-sm rounded-md ${activeTab === 'daily' ? 'bg-white shadow' : ''}`}
                onClick={() => setActiveTab('daily')}
              >
                Daily
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${activeTab === 'weekly' ? 'bg-white shadow' : ''}`}
                onClick={() => setActiveTab('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${activeTab === 'monthly' ? 'bg-white shadow' : ''}`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getActiveData()}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  fill="url(#colorSales)" 
                  activeDot={{ r: 6 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Product Categories</h2>
              <p className="text-sm text-gray-500">Sales by category</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="mt-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest customer transactions</p>
          </div>
          <button className="mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Calendar size={16} />
            <span>View All</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">{order.customer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-center">
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-sm font-medium">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">2</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">3</button>
            <span className="px-3 py-1 text-sm">...</span>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-sm">10</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;