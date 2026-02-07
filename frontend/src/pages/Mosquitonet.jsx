import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Mosquitonet = () => {
  const [product, setProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [orderForm, setOrderForm] = useState({
    name: "",
    mobile: "",
    address: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: "",
  });

  const id = "6987720bc2d4ff6b5b211a38";

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/${id}`).then((res) => {
      setProduct(res.data);
      const firstVariant = res.data.variants[0];
      setActiveImage(firstVariant.images[0]);
      // Initialize with all variants having quantity 0
      const initialItems = res.data.variants.map((variant) => ({
        variantId: variant._id,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
        quantity: 0,
        image: variant.images[0],
      }));
      setSelectedItems(initialItems);
    });
  }, []);

  if (!product) return <p>Loading...</p>;

  // Handle quantity change for specific variant
  const handleQuantityChange = (variantId, change) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.variantId === variantId) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 0 && newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }),
    );
  };

  // Calculate total quantities and prices
  const selectedVariants = selectedItems.filter((item) => item.quantity > 0);
  const totalItems = selectedVariants.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const subtotal = selectedVariants.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const calculateDeliveryCharge = () => {
    const dhakaAreas = ["ঢাকা", "ডিএনসিসি", "গাজীপুর", "নারায়ণগঞ্জ"];
    const isDhaka = dhakaAreas.some((area) =>
      orderForm.address.toLowerCase().includes(area.toLowerCase()),
    );
    return isDhaka ? 60 : 120;
  };

  const deliveryCharge = calculateDeliveryCharge();
  const grandTotal = subtotal;

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  // Submit order
  const submitOrderToAPI = async (orderData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "API Error");
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Check if any item is selected
    if (selectedVariants.length === 0) {
      return alert("দয়া করে কমপক্ষে একটি পণ্য সিলেক্ট করুন!");
    }

    if (!orderForm.name || !orderForm.mobile || !orderForm.address) {
      return alert("সব তথ্য পূরণ করুন!");
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: orderForm.name,
        mobileNumber: orderForm.mobile,
        address: orderForm.address,
        paymentMethod: orderForm.paymentMethod,
        transactionId: orderForm.transactionId || null,
        items: selectedVariants.map((item) => ({
          productColor: item.color,
          productSize: item.size,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        totalAmount: subtotal,
        deliveryCharge: deliveryCharge,
        notes: orderForm.notes || "",
      };

      const result = await submitOrderToAPI(orderData);
      if (result.success) {
        // Reset form
        setOrderForm({
          name: "",
          mobile: "",
          address: "",
          paymentMethod: "cash",
          transactionId: "",
          notes: "",
        });

        // Reset quantities to 0
        setSelectedItems((prevItems) =>
          prevItems.map((item) => ({ ...item, quantity: 0 })),
        );

        alert(
          `✅ অর্ডার সফল!\nঅর্ডার নম্বর: ${result.data.orderNumber}\nমোট আইটেম: ${totalItems}\nমোট টাকা: ৳${result.data.totalAmount}\nডেলিভারি চার্জ: ৳${deliveryCharge}`,
        );
      } else throw new Error(result.message);
    } catch (err) {
      alert(`❌ অর্ডার ব্যর্থ: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen font-kalpurush">
      <Navbar />
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 p-4 md:p-6">
        {/* Left - Product */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold pb-2">{product.name}</h2>
          <p className="text-gray-600 pb-6 text-justify">
            {product.description}
          </p>

          <div className="relative">
            <img
              src={activeImage}
              alt="Main product"
              className="w-full h-96 object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              রং, সাইজ এবং পরিমাণ সিলেক্ট করুন
            </h3>
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.variantId}
                  className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                    item.quantity > 0
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Left: Image and Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.color}
                      className="w-20 h-20 object-cover rounded-lg"
                      onClick={() => setActiveImage(item.image)}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.color}
                      </h3>
                      <p className="text-sm text-gray-600">{item.size}</p>
                      <p className="text-sm font-bold text-green-600">
                        ৳ {item.price}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity Selector */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.variantId, -1)}
                        disabled={isSubmitting || item.quantity === 0}
                        className="px-4 py-2 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.variantId, 1)}
                        disabled={isSubmitting || item.quantity >= item.stock}
                        className="px-4 py-2 rounded-r-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    {item.quantity > 0 && (
                      <p className="text-sm font-semibold text-green-700">
                        ৳ {item.price * item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">সিলেক্টেড আইটেম</p>
                <p className="text-sm text-gray-600">
                  {totalItems} টি পণ্য | {selectedVariants.length} টি
                  ভ্যারিয়েন্ট
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700">সাবটোটাল</p>
                <p className="text-xl font-bold text-green-600">৳ {subtotal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Order Form & Summary */}
        <div className="lg:w-1/2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">অর্ডার বিস্তারিত</h3>

            {selectedVariants.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                কোন পণ্য সিলেক্ট করা হয়নি
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {selectedVariants.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {item.color} / {item.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ৳ {item.price}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ৳ {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>পণ্যের মূল্য:</span>
                    <span>৳ {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ:</span>
                    <span>৳ 0</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>সর্বমোট:</span>
                    <span className="text-green-600">৳ {grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">গ্রাহকের তথ্য</h3>
            <form onSubmit={handleOrderSubmit}>
              <input
                type="text"
                name="name"
                placeholder="পুরো নাম"
                value={orderForm.name}
                onChange={handleInputChange}
                className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="মোবাইল নম্বর"
                value={orderForm.mobile}
                onChange={handleInputChange}
                className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                required
              />
              <textarea
                name="address"
                placeholder="পূর্ণ ঠিকানা"
                value={orderForm.address}
                onChange={handleInputChange}
                className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                rows="3"
                required
              />

              <div className="mb-3">
                <label className="block mb-2 font-semibold">
                  পেমেন্ট পদ্ধতি
                </label>
                <select
                  name="paymentMethod"
                  value={orderForm.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="cash">ক্যাশ অন ডেলিভারি</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>

              {orderForm.paymentMethod !== "cash" && (
                <input
                  type="text"
                  name="transactionId"
                  placeholder="ট্রানজেকশন আইডি"
                  value={orderForm.transactionId}
                  onChange={handleInputChange}
                  className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                  required={orderForm.paymentMethod !== "cash"}
                />
              )}

              <textarea
                name="notes"
                placeholder="অতিরিক্ত তথ্য (ঐচ্ছিক)"
                value={orderForm.notes}
                onChange={handleInputChange}
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                rows="2"
              />

              <button
                type="submit"
                disabled={isSubmitting || selectedVariants.length === 0}
                className={`w-full py-3 rounded-lg font-bold text-white ${
                  isSubmitting || selectedVariants.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting
                  ? "অর্ডার করা হচ্ছে..."
                  : `অর্ডার কনফার্ম করুন (৳ ${grandTotal})`}
              </button>

              {selectedVariants.length === 0 && (
                <p className="text-red-600 text-center mt-2">
                  কমপক্ষে একটি পণ্য সিলেক্ট করুন
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mosquitonet;
