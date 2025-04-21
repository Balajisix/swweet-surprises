import { useState, useEffect } from "react";
import CommonForm from "../common/form";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from "../ui/card";
import { 
  Package, 
  Truck, 
  User, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  ArrowLeft, 
  ShoppingBag,
  MapPin,
  Phone,
  FileText,
  Clock
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "../ui/progress";

function AdminOrderDetailsView() {
  const [formData, setFormData] = useState({ status: "" });
  const { user } = useSelector((state) => state.auth);
  const { orderDetails, loading } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetailsForAdmin(orderId));
    }
  }, [dispatch, orderId]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData({ status: "" });
        toast({
          title: data?.payload?.message,
          variant: "success",
        });
      }
    });
  }

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return "bg-green-100 text-green-800 border-green-200";
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-200";
      case 'inshipping':
      case 'inprocess':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get progress percentage based on status
  const getProgressPercentage = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 20;
      case 'inprocess': return 40;
      case 'inshipping': return 60;
      case 'confirmed': return 80;
      case 'delivered': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  // Get progress color based on status
  const getProgressColor = (status) => {
    return status?.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-blue-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-blue-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-bold">Order details not found</h2>
        <p className="text-gray-500 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/admin/orders')} size="lg" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/orders')}
                className="border-gray-200 hover:bg-gray-100"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Details</h1>
            </div>
            <Badge 
              className={`py-1.5 px-4 text-sm font-medium capitalize border ${getStatusColor(orderDetails?.orderStatus)}`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
          
          {/* Order Progress */}
          <Card className="overflow-hidden shadow-sm border-0 mb-8">
            <CardContent className="p-6">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Order Progress</h3>
                <span className="text-sm text-gray-500">{orderDetails?.orderStatus}</span>
              </div>
              <Progress 
                value={getProgressPercentage(orderDetails?.orderStatus)} 
                className={`h-2 ${getProgressColor(orderDetails?.orderStatus)}`}
              />
              
              <div className="grid grid-cols-5 mt-2 text-xs text-gray-500">
                <div className="text-center">Pending</div>
                <div className="text-center">Processing</div>
                <div className="text-center">Shipping</div>
                <div className="text-center">Confirmed</div>
                <div className="text-center">Delivered</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary Card */}
              <Card className="overflow-hidden shadow-sm border-0">
                <CardHeader className="bg-white border-b p-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold flex items-center text-gray-800">
                      <Package className="mr-2 h-5 w-5 text-blue-600" />
                      Order Summary
                    </CardTitle>
                    <p className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                      #{orderDetails?._id?.slice(-6)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <ShoppingBag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono font-medium">{orderDetails?._id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium">
                            {new Date(orderDetails?.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium text-lg">₹{orderDetails?.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Details</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {orderDetails?.paymentMethod}
                            </p>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                              {orderDetails?.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products Card */}
              <Card className="overflow-hidden shadow-sm border-0">
                <CardHeader className="bg-white border-b p-6">
                  <CardTitle className="text-lg font-medium flex items-center text-gray-800">
                    <ShoppingBag className="mr-2 h-5 w-5 text-blue-600" />
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b bg-gray-50">
                          <th className="py-4 px-6 text-sm font-medium text-gray-600">Product</th>
                          <th className="py-4 px-6 text-sm font-medium text-gray-600">Quantity</th>
                          <th className="py-4 px-6 text-sm font-medium text-gray-600 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                          ? orderDetails?.cartItems.map((item, index) => (
                              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 rounded-md h-10 w-10 flex items-center justify-center">
                                      <ShoppingBag className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{item.title}</div>
                                      {item.productId?.description && (
                                        <div className="text-sm text-gray-500 line-clamp-1">
                                          {item.productId.description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 rounded-full h-8 w-8 font-medium">
                                    {item.quantity}
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-right font-medium">₹{item.price.toLocaleString()}</td>
                              </tr>
                            ))
                          : (
                            <tr>
                              <td colSpan="3" className="py-6 text-center text-gray-500">
                                No products found
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t p-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Total</span>
                      <span className="font-bold text-lg">₹{orderDetails?.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Customer & Actions */}
            <div className="space-y-6">
              {/* Customer Info Card */}
              <Card className="overflow-hidden shadow-sm border-0">
                <CardHeader className="bg-white border-b p-6">
                  <CardTitle className="text-lg font-medium flex items-center text-gray-800">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer Name</p>
                        <p className="font-medium">{user.userName}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-full mr-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <div className="mt-1 space-y-1">
                          <p>{orderDetails?.addressInfo?.address}</p>
                          <p>{orderDetails?.addressInfo?.city} - {orderDetails?.addressInfo?.pincode}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-full mr-3">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p>{orderDetails?.addressInfo?.phone}</p>
                      </div>
                    </div>
                    {orderDetails?.addressInfo?.notes && (
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm mt-1 bg-gray-50 p-3 rounded-md border border-gray-100">
                            {orderDetails?.addressInfo?.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Update Status Card */}
              <Card className="overflow-hidden shadow-sm border-0">
                <CardHeader className="bg-white border-b p-6">
                  <CardTitle className="text-lg font-medium flex items-center text-gray-800">
                    <Truck className="mr-2 h-5 w-5 text-blue-600" />
                    Update Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CommonForm
                    formControls={[
                      {
                        label: "Order Status",
                        name: "status",
                        componentType: "select",
                        options: [
                          { id: "pending", label: "Pending" },
                          { id: "inProcess", label: "In Process" },
                          { id: "inShipping", label: "In Shipping" },
                          { id: "delivered", label: "Delivered" },
                          { id: "rejected", label: "Rejected" },
                        ],
                      },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={"Update Status"}
                    onSubmit={handleUpdateStatus}
                  />
                  <div className="mt-4 text-xs text-gray-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Status changes will be logged and cannot be undone</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Timeline Card */}
              <Card className="overflow-hidden shadow-sm border-0">
                <CardHeader className="bg-white border-b p-6">
                  <CardTitle className="text-lg font-medium flex items-center text-gray-800">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-0">
                    <div className="relative pl-8 pb-8">
                      <div className="absolute left-0 top-2 h-full border-l-2 border-gray-200"></div>
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-green-500 shadow-md"></div>
                      <div className="mb-1 flex items-center">
                        <h4 className="text-sm font-medium">Order Placed</h4>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(orderDetails?.orderDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {orderDetails?.orderStatus && orderDetails.orderStatus.toLowerCase() !== "pending" && (
                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-2 h-full border-l-2 border-gray-200"></div>
                        <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-blue-500 shadow-md"></div>
                        <div className="mb-1 flex items-center">
                          <h4 className="text-sm font-medium">Status Updated</h4>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            orderDetails.orderStatus.toLowerCase() === 'rejected' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {orderDetails.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {/* This would ideally use the timestamp from the status update */}
                          {new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}

                    {orderDetails?.orderStatus && orderDetails.orderStatus.toLowerCase() === "delivered" && (
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-green-500 shadow-md"></div>
                        <div className="mb-1 flex items-center">
                          <h4 className="text-sm font-medium">Order Completed</h4>
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {/* This would ideally use the timestamp from the delivery */}
                          {new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailsView;