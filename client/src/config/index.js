export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "frame", label: "Photo frame" },
      { id: "wallet", label: "Wallet cards" },
      { id: "keychain", label: "Keychains" },
      { id: "mugs", label: "Mugs" },
      { id: "photoBook", label: "Mini Photo Book" },
    ],
  },
  {
    label: "Occasions",
    name: "occasion",
    componentType: "select",
    options: [
      { id: "valentine", label: "Valentine's day" },
      { id: "wedding", label: "Wedding Gift" },
      { id: "friends", label: "Friendship day" },
      { id: "christmas", label: "Christmas" },
      { id: "mother", label: "Mother's day" },
      { id: "father", label: "Father's day" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "frame",
    label: "Photo frame",
    path: "/shop/listing",
  },
  {
    id: "wallet",
    label: "Wallet cards",
    path: "/shop/listing",
  },
  {
    id: "keychain",
    label: "Keychains",
    path: "/shop/listing",
  },
  {
    id: "mugs",
    label: "Mugs",
    path: "/shop/listing",
  },
  {
    id: "photoBook",
    label: "Mini Photo Book",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  valentine: "Valentine's day",
  wedding: "Wedding Gift",
  friends: "Friendship day",
  christmas: "Christmas",
  mother: "Mother's day",
  father: "Father's day",
};

export const filterOptions = {
  category: [
    { id: "frame", label: "Photo frame" },
    { id: "wallet", label: "Wallet cards" },
    { id: "keychain", label: "Keychains" },
    { id: "mugs", label: "Mugs" },
    { id: "photoBook", label: "Mini Photo Book" },
  ],
  occasion: [
    { id: "valentine", label: "Valentine's day" },
    { id: "wedding", label: "Wedding Gift" },
    { id: "friends", label: "Friendship day" },
    { id: "christmas", label: "Christmas" },
    { id: "mother", label: "Mother's day" },
    { id: "father", label: "Father's day" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];