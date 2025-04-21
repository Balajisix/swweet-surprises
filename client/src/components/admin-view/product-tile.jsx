import { useState } from "react";
import { Edit, Trash2, Eye, MoreHorizontal, AlertCircle, Tag, Package } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const inStock = parseInt(product?.totalStock) > 0;
  const lowStock = parseInt(product?.totalStock) > 0 && parseInt(product?.totalStock) <= 10;
  
  function getStockStatusBadge() {
    if (!inStock) {
      return <Badge variant="destructive" className="font-medium">Out of Stock</Badge>;
    } else if (lowStock) {
      return <Badge variant="warning" className="bg-amber-500 text-white font-medium">Low Stock</Badge>;
    } else {
      return <Badge variant="success" className="bg-green-500 text-white font-medium">In Stock</Badge>;
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="overflow-hidden border-gray-200 h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Quick Actions Overlay */}
          {isHovered && (
            <div className="absolute top-3 right-3 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 shadow-md hover:bg-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setIsShowingDetails(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenCreateProductsDialog(true);
                      setCurrentEditedId(product?._id);
                      setFormData(product);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(product?._id, product?.title)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            {getStockStatusBadge()}
          </div>

          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {product?.image ? (
              <img
                src={product.image}
                alt={product?.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {/* Sale Overlay */}
            {product?.salePrice > 0 && (
              <div className="absolute bottom-0 right-0 bg-red-500 text-white px-3 py-1 font-medium">
                SALE
              </div>
            )}
          </div>

          {/* Product Details */}
          <CardContent className="p-4 flex-grow">
            <div className="mb-1">
              <Badge variant="outline" className="font-normal text-xs text-gray-500">
                {product?.category || "Uncategorized"}
              </Badge>
              {product?.occasion && (
                <Badge variant="outline" className="ml-2 font-normal text-xs text-gray-500">
                  {product?.occasion}
                </Badge>
              )}
            </div>
            
            <h3 className="text-lg font-semibold line-clamp-1 mb-1">
              {product?.title}
            </h3>
            
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">
              {product?.description}
            </p>
            
            <div className="flex items-baseline gap-2 mb-1">
              {product?.salePrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-green-600">₹{product?.salePrice}</span>
                  <span className="text-sm line-through text-gray-400">₹{product?.price}</span>
                </>
              ) : (
                <span className="text-lg font-bold">₹{product?.price}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Package className="h-4 w-4 mr-1" />
                <span>{product?.totalStock} in stock</span>
              </div>
              
              {product?.averageReview > 0 && (
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(product?.averageReview) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Action Buttons */}
          <CardFooter className="p-4 bg-gray-50 border-t gap-2">
            <Button
              variant="outline"
              className="flex-1 text-gray-600 hover:text-indigo-600 hover:border-indigo-600"
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleDelete(product?._id, product?.title)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Product Details Dialog */}
      <Dialog open={isShowingDetails} onOpenChange={setIsShowingDetails}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information about this product
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div>
              <div className="aspect-square rounded-md overflow-hidden">
                {product?.image ? (
                  <img
                    src={product.image}
                    alt={product?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <Badge>{product?.category || "Uncategorized"}</Badge>
                  {product?.occasion && <Badge variant="outline">{product?.occasion}</Badge>}
                  {getStockStatusBadge()}
                </div>
                <h2 className="text-2xl font-bold">{product?.title}</h2>
              </div>
              
              <div className="flex items-baseline gap-3">
                {product?.salePrice > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-green-600">₹{product?.salePrice}</span>
                    <span className="text-lg line-through text-gray-400">₹{product?.price}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">₹{product?.price}</span>
                )}
              </div>
              
              <div className="text-gray-700">
                <p>{product?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Stock</h4>
                  <p className="font-medium">{product?.totalStock} units</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                  <div className="flex items-center">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(product?.averageReview) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span>({product?.averageReview || 0})</span>
                  </div>
                </div>
              </div>
              
              {product?.tags && product?.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product?.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {lowStock && (
                <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="text-sm">Low stock alert: Only {product?.totalStock} items remaining</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline" 
              onClick={() => setIsShowingDetails(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsShowingDetails(false);
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminProductTile;