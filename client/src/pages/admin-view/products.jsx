import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Search, Filter, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  occasion: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Filter and sort products
  const filteredProducts = productList ? productList.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock = stockFilter === "all" || 
                         (stockFilter === "inStock" && parseInt(product.totalStock) > 0) ||
                         (stockFilter === "lowStock" && parseInt(product.totalStock) > 0 && parseInt(product.totalStock) <= 10) ||
                         (stockFilter === "outOfStock" && parseInt(product.totalStock) === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === "priceHigh") return parseFloat(b.price) - parseFloat(a.price);
    if (sortOrder === "priceLow") return parseFloat(a.price) - parseFloat(b.price);
    if (sortOrder === "nameAZ") return a.title.localeCompare(b.title);
    if (sortOrder === "nameZA") return b.title.localeCompare(a.title);
    return 0;
  }) : [];

  // Get unique categories for filter
  const categories = productList ? 
    ["all", ...new Set(productList.map(product => product.category))] :
    ["all"];

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast({
            title: "Product updated successfully",
            description: `${formData.title} has been updated.`,
            variant: "success",
          });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product added successfully",
            description: `${formData.title} has been added to inventory.`,
            variant: "success",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId, productName) {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      dispatch(deleteProduct(getCurrentProductId)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          toast({
            title: "Product deleted",
            description: `${productName} has been removed.`,
            variant: "destructive",
          });
        }
      });
    }
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => 
        currentKey !== "averageReview" && 
        currentKey !== "salePrice" // Make salePrice optional
      )
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchAllProducts()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  function resetFilters() {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortOrder("newest");
  }

  const getProductStats = () => {
    if (!productList) return { total: 0, outOfStock: 0, lowStock: 0 };
    
    const total = productList.length;
    const outOfStock = productList.filter(p => parseInt(p.totalStock) === 0).length;
    const lowStock = productList.filter(p => parseInt(p.totalStock) > 0 && parseInt(p.totalStock) <= 10).length;
    
    return { total, outOfStock, lowStock };
  };

  const stats = getProductStats();

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Button 
          onClick={() => setOpenCreateProductsDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          size="lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.outOfStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats.lowStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="inStock">In Stock</SelectItem>
                  <SelectItem value="lowStock">Low Stock</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                  <SelectItem value="priceLow">Price: Low to High</SelectItem>
                  <SelectItem value="nameAZ">Name: A to Z</SelectItem>
                  <SelectItem value="nameZA">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="whitespace-nowrap"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid with Loading State */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Card key={item} className="overflow-hidden">
              <div className="aspect-square w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((productItem) => (
                <AdminProductTile
                  key={productItem._id}
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || categoryFilter !== "all" || stockFilter !== "all" ? 
                  "Try changing your search or filter criteria" : 
                  "Start by adding your first product"}
              </p>
              {searchTerm || categoryFilter !== "all" || stockFilter !== "all" ? (
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setOpenCreateProductsDialog(true)}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Product
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="w-full sm:w-[600px]">
          <ScrollArea className="h-full pr-4">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-xl font-bold">
                {currentEditedId !== null ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Product Image</h3>
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !== null}
              />
            </div>
            
            <div className="py-6">
              <h3 className="text-lg font-medium mb-3">Product Details</h3>
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText=""
                formControls={addProductFormElements}
                isBtnDisabled={true}
                hideButton={true}
              />
            </div>
          </ScrollArea>
          
          <SheetFooter className="pt-4 border-t mt-4">
            <div className="flex w-full justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setOpenCreateProductsDialog(false);
                  setCurrentEditedId(null);
                  setFormData(initialFormData);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={onSubmit}
                disabled={!isFormValid() || imageLoadingState}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {imageLoadingState ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : currentEditedId !== null ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AdminProducts;