import { useState } from "react";
import Navbar from "../components/Navbar";

// API base URL - production এ পরিবর্তন করুন
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Mosquitonet = () => {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Red");
  const [size, setSize] = useState("6 / 7");
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Order form state
  const [orderForm, setOrderForm] = useState({
    name: "",
    mobile: "",
    address: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: "",
  });

  // Product variants data
  const variants = [
    {
      id: 1,
      color: "Red",
      size: "6 / 7",
      image: "https://picsum.photos/200/300",
      price: 1200,
      description: "প্রিমিয়াম কটন মশারি",
    },
    {
      id: 2,
      color: "Blue",
      size: "6 / 7",
      image: "https://picsum.photos/200/301",
      price: 1200,
      description: "প্রিমিয়াম কটন মশারি",
    },
    {
      id: 3,
      color: "Green",
      size: "7 / 8",
      image: "https://picsum.photos/200/302",
      price: 1400,
      description: "বড় সাইজ মশারি",
    },
    {
      id: 4,
      color: "White",
      size: "8 / 9",
      image: "https://picsum.photos/200/303",
      price: 1600,
      description: "কিং সাইজ মশারি",
    },
  ];

  const handleAddToCart = () => {
    const selectedVariant = variants.find(
      (v) => v.color === color && v.size === size,
    );
    const newItem = {
      id: Date.now(),
      color,
      size,
      quantity,
      price: selectedVariant?.price || 1200,
      variantId: selectedVariant?.id,
    };

    // Check if item already exists in cart with same color and size
    const existingItemIndex = cartItems.findIndex(
      (item) => item.color === color && item.size === size,
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
      alert(
        `${quantity}টি ${color} রংয়ের মশারি যোগ করা হয়েছে! মোট ${updatedCart[existingItemIndex].quantity}টি`,
      );
    } else {
      // Add new item
      setCartItems([...cartItems, newItem]);
      alert(`${quantity}টি ${color} রংয়ের মশারি কার্টে যোগ করা হয়েছে!`);
    }

    // Reset quantity to 1
    setQuantity(1);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(id);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedCart);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  // Submit order to backend API
  const submitOrderToAPI = async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "API error occurred");
      }

      return result;
    } catch (error) {
      console.error("Order submission error:", error);
      throw error;
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("কার্টে কোনো আইটেম নেই!");
      return;
    }

    if (!orderForm.name || !orderForm.mobile || !orderForm.address) {
      alert("দয়া করে সব তথ্য পূরণ করুন!");
      return;
    }

    // Validate mobile number
    const mobileRegex = /^(?:\+88|01)?(?:\d{11}|\d{13})$/;
    if (!mobileRegex.test(orderForm.mobile)) {
      alert("দয়া করে সঠিক মোবাইল নম্বর লিখুন!");
      return;
    }

    // If bKash selected, validate transaction ID
    if (
      orderForm.paymentMethod === "bkash" &&
      !orderForm.transactionId.trim()
    ) {
      alert("দয়া করে বিকাশ ট্রানজেকশন আইডি দিন!");
      return;
    }

    setIsSubmitting(true);
    setOrderSuccess(null);

    try {
      const orderData = {
        customerName: orderForm.name.trim(),
        mobileNumber: orderForm.mobile.trim(),
        address: orderForm.address.trim(),
        paymentMethod: orderForm.paymentMethod,
        transactionId: orderForm.transactionId.trim() || null,
        items: cartItems.map((item) => ({
          productColor: item.color,
          productSize: item.size,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        totalAmount: totalAmount,
        deliveryCharge: calculateDeliveryCharge(),
        notes: orderForm.notes.trim() || "",
      };

      console.log("Submitting order:", orderData);

      const result = await submitOrderToAPI(orderData);

      if (result.success) {
        setOrderSuccess({
          orderNumber: result.data.orderNumber,
          totalAmount: result.data.totalAmount,
          message: result.message,
        });

        // Reset form and cart
        setCartItems([]);
        setOrderForm({
          name: "",
          mobile: "",
          address: "",
          paymentMethod: "cash",
          transactionId: "",
          notes: "",
        });

        // Reset quantity and selection
        setQuantity(1);
        setColor("Red");
        setSize("6 / 7");

        // Success message
        alert(
          `✅ অর্ডার সফল!\nঅর্ডার নম্বর: ${result.data.orderNumber}\nমোট টাকা: ৳${result.data.totalAmount}\nআপনার মোবাইলে SMS পাঠানো হয়েছে।`,
        );
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      alert(`❌ অর্ডার ব্যর্থ: ${error.message}\nদয়া করে আবার চেষ্টা করুন।`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate delivery charge based on address (sample logic)
  const calculateDeliveryCharge = () => {
    // In real app, you would determine this based on address
    const dhakaAreas = ["ঢাকা", "ডিএনসিসি", "গাজীপুর", "নারায়ণগঞ্জ"];
    const isDhaka = dhakaAreas.some((area) =>
      orderForm.address.toLowerCase().includes(area.toLowerCase()),
    );

    return isDhaka ? 60 : 120;
  };

  // Calculate total including delivery
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const deliveryCharge = calculateDeliveryCharge();
  const grandTotal = totalAmount + deliveryCharge;

  // Get selected variant details
  const selectedVariant = variants.find(
    (v) => v.color === color && v.size === size,
  );

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 p-4 md:p-6">
        {/* Left side - Product details */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 pb-2">মশারি নেট</h2>
            <p className="text-gray-600 pb-6">
              প্রিমিয়াম কটন মশারি - সর্বোচ্চ সুরক্ষা
            </p>

            <div className="flex flex-col items-center justify-between space-y-6">
              <div className="relative w-full">
                <img
                  className="w-full h-96 object-cover rounded-xl shadow-md"
                  src={
                    selectedVariant?.image || "https://picsum.photos/200/300"
                  }
                  alt="Product"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Best Seller
                </div>
              </div>

              {/* Product variants */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-4">
                  রং এবং সাইজ সিলেক্ট করুন
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        color === variant.color && size === variant.size
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setColor(variant.color);
                        setSize(variant.size);
                      }}
                    >
                      <img
                        className="w-16 h-16 object-cover rounded-lg mb-2"
                        src={variant.image}
                        alt={variant.color}
                      />
                      <h2 className="font-semibold text-sm">{variant.color}</h2>
                      <h2 className="text-xs text-gray-600">{variant.size}</h2>
                      <h2 className="text-sm font-bold text-green-600 mt-1">
                        ৳ {variant.price}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected variant details */}
              <div className="w-full p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {selectedVariant?.color} রং - সাইজ {selectedVariant?.size}
                    </h3>
                    <p className="text-gray-600">
                      {selectedVariant?.description}
                    </p>
                    <p className="text-xl font-bold text-green-600 mt-2">
                      ৳ {selectedVariant?.price} / পিস
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold">পরিমাণ:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        className="px-4 py-2 hover:bg-gray-100 rounded-l-lg"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isSubmitting}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center">
                        {quantity}
                      </span>
                      <button
                        className="px-4 py-2 hover:bg-gray-100 rounded-r-lg"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={isSubmitting}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAddToCart}
                    disabled={isSubmitting}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    কার্টে যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Cart and Order Form */}
        <div className="lg:w-1/2 space-y-6">
          {/* Cart Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                আপনার কার্ট ({cartItems.length} আইটেম)
              </h3>
              {cartItems.length > 0 && (
                <button
                  onClick={() => setCartItems([])}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  disabled={isSubmitting}
                >
                  সব মুছুন
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-500">কার্টে কোনো আইটেম নেই</p>
                <p className="text-sm text-gray-400 mt-2">
                  উপরে থেকে পণ্য সিলেক্ট করে কার্টে যোগ করুন
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-700">
                              {item.color.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {item.color} রং - সাইজ {item.size}
                            </p>
                            <p className="text-sm text-gray-600">
                              ৳ {item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            className="px-2 py-1 hover:bg-gray-200"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isSubmitting}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 hover:bg-gray-200"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isSubmitting}
                          >
                            +
                          </button>
                        </div>

                        <p className="font-bold text-green-600 min-w-[80px] text-right">
                          ৳ {item.price * item.quantity}
                        </p>

                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={isSubmitting}
                          title="মুছুন"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>পণ্যের মূল্য</span>
                    <span>৳ {totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ডেলিভারি চার্জ</span>
                    <span>৳ {deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>মোট প্রদেয়</span>
                    <span className="text-green-600">৳ {grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 pb-4 border-b text-gray-800">
              অর্ডার ফর্ম
            </h3>

            <form onSubmit={handleOrderSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    আপনার পুরো নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderForm.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="পুরো নাম লিখুন"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={orderForm.mobile}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="01XXXXXXXXX"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <textarea
                    name="address"
                    value={orderForm.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="বাড়ি নং, রাস্তা, এলাকা, জেলা"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পেমেন্ট পদ্ধতি *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                        orderForm.paymentMethod === "cash"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={orderForm.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="mr-3"
                        disabled={isSubmitting}
                      />
                      <div>
                        <span className="font-medium">ক্যাশ অন ডেলিভারি</span>
                        <p className="text-xs text-gray-500 mt-1">
                          পণ্য পেয়ে টাকা দেবেন
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                        orderForm.paymentMethod === "bkash"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={orderForm.paymentMethod === "bkash"}
                        onChange={handleInputChange}
                        className="mr-3"
                        disabled={isSubmitting}
                      />
                      <div>
                        <span className="font-medium">বিকাশ</span>
                        <p className="text-xs text-gray-500 mt-1">
                          অগ্রিম পেমেন্ট
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {orderForm.paymentMethod === "bkash" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বিকাশ ট্রানজেকশন আইডি *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={orderForm.transactionId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      placeholder="TrxID123456"
                      required={orderForm.paymentMethod === "bkash"}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      বিকাশ নম্বর: 017XX-XXXXXX এ টাকা পাঠিয়ে TrxID দিন
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অতিরিক্ত নোট (যদি থাকে)
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="যেকোনো বিশেষ নির্দেশনা"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={cartItems.length === 0 || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      cartItems.length === 0 || isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        প্রসেসিং...
                      </div>
                    ) : cartItems.length === 0 ? (
                      "কার্টে আইটেম যোগ করুন"
                    ) : (
                      `অর্ডার কনফার্ম করুন (৳ ${grandTotal})`
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Order Success Message */}
          {orderSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">অর্ডার সফল!</h4>
                  <p className="text-sm text-green-600">
                    আপনার অর্ডার গ্রহণ করা হয়েছে
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">অর্ডার নম্বর:</span>
                    <span className="font-bold">
                      {orderSuccess.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">মোট টাকা:</span>
                    <span className="font-bold text-green-600">
                      ৳ {orderSuccess.totalAmount}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  আপনার মোবাইল নম্বরে একটি SMS পাঠানো হয়েছে। ২৪ ঘন্টার মধ্যে
                  ডেলিভারি পেয়ে যাবেন।
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              গুরুত্বপূর্ণ তথ্য
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  ডেলিভারি সময়: ঢাকার ভেতরে ২৪ ঘন্টা, অন্যান্য জেলা ২-৩
                  কার্যদিবস
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  ফেরত/বদল: পণ্য ত্রুটিপূর্ণ হলে ৩ দিনের মধ্যে ফেরত নেওয়া হবে
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  কাস্টমার সার্ভিস: ০৯৬৩৮-XXXXXX (সকাল ৯টা - রাত ১০টা)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>ওয়ারেন্টি: ১ বছর</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-800 text-white text-center py-4 mt-8">
        <p className="text-sm">
          © 2024 Mosquito Net Shop. সব অধিকার সংরক্ষিত।
          <a href="#" className="ml-2 text-green-300 hover:text-green-400">
            প্রাইভেসি পলিসি
          </a>{" "}
          |
          <a href="#" className="ml-2 text-green-300 hover:text-green-400">
            টার্মস অ্যান্ড কন্ডিশন
          </a>
        </p>
      </div>
    </div>
  );
};

export default Mosquitonet;
