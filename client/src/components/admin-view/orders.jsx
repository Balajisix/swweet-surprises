import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { orderList, orderDetails, loading } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  // Filter orders based on search and status filter
  const filteredOrders = orderList?.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.cartItems.some(item => 
        (item.productId?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  function handleRefresh() {
    dispatch(getAllOrdersForAdmin());
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-gray-800">Order Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                className="pl-8 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="inShipping">In Shipping</SelectItem>
                  <SelectItem value="inProcess">In Process</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleRefresh} className="flex-shrink-0">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="hidden md:table-cell">Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Price</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((orderItem) => (
                    <TableRow key={orderItem?._id} className="hover:bg-slate-50">
                      <TableCell className="hidden md:table-cell font-mono text-xs">
                        {orderItem?._id.substring(orderItem?._id.length - 8)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {orderItem.cartItems.slice(0, 2).map((item, index) => (
                            <div 
                              key={index} 
                              className="truncate text-sm"
                              title={item.productId?.title || "N/A"}
                            >
                              {item.productId?.title || "N/A"}
                            </div>
                          ))}
                          {orderItem.cartItems.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{orderItem.cartItems.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell whitespace-nowrap text-sm">
                        {new Date(orderItem?.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-2 text-xs font-medium capitalize ${
                            orderItem?.orderStatus === "delivered"
                              ? "bg-green-100 text-green-800"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-100 text-red-800"
                              : orderItem?.orderStatus === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-medium">
                        ₹{orderItem?.totalAmount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            size="sm"
                            className="text-xs px-3"
                          >
                            Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || statusFilter !== "all" ? (
                <div>
                  <p className="mb-2">No orders match your filters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <p>No orders found</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;