// import Navbar from "../components/Navbar";
// const Mosquitonet = () => {
//   return (
//     <div className="w-full flex flex-col items-center justify-center">
//       <Navbar />
//       <div className="w-full flex flex-col items-start justify-start p-4">
//         <h2 className="text-2xl pb-4">Mosquito Net</h2>
//         <div className="flex flex-col itesm-center justify-between space-y-2">
//           <img
//             className="w-full h-78 "
//             src="https://picsum.photos/200/300"
//             alt="Product"
//           />
//           <div className="flex flex-row gap-2">
//             <div>
//               <img
//                 className="w-20 h-20"
//                 src="https://picsum.photos/200/300"
//                 alt="Product"
//               />
//               <h2>Red</h2>
//               <h2>6 / 7 </h2>
//             </div>
//             <div>
//               <img
//                 className="w-20 h-20"
//                 src="https://picsum.photos/200/300"
//                 alt="Product"
//               />
//               <h2>Red</h2>
//               <h2>6 / 7 </h2>
//             </div>
//             <div>
//               <img
//                 className="w-20 h-20"
//                 src="https://picsum.photos/200/300"
//                 alt="Product"
//               />
//               <h2>Red</h2>
//               <h2>6 / 7 </h2>
//             </div>
//             <div>
//               <img
//                 className="w-20 h-20"
//                 src="https://picsum.photos/200/300"
//                 alt="Product"
//               />
//               <h2>Red</h2>
//               <h2>6 / 7 </h2>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Mosquitonet;

import { useState } from "react";
import Navbar from "../components/Navbar";

const Mosquitonet = () => {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Red");
  const [size, setSize] = useState("6 / 7");
  const [cartItems, setCartItems] = useState([]);

  // Order form state
  const [orderForm, setOrderForm] = useState({
    name: "",
    mobile: "",
    address: "",
    paymentMethod: "cash",
  });

  // Product variants data
  const variants = [
    {
      id: 1,
      color: "Red",
      size: "6 / 7",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      color: "Blue",
      size: "6 / 7",
      image: "https://picsum.photos/200/301",
    },
    {
      id: 3,
      color: "Green",
      size: "7 / 8",
      image: "https://picsum.photos/200/302",
    },
    {
      id: 4,
      color: "White",
      size: "8 / 9",
      image: "https://picsum.photos/200/303",
    },
  ];

  const handleAddToCart = () => {
    const newItem = {
      id: Date.now(),
      color,
      size,
      quantity,
      price: 1200, // Assuming fixed price
    };

    setCartItems([...cartItems, newItem]);
    alert(`${quantity}টি ${color} রংয়ের মশারি কার্টে যোগ করা হয়েছে!`);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("কার্টে কোনো আইটেম নেই!");
      return;
    }

    if (!orderForm.name || !orderForm.mobile || !orderForm.address) {
      alert("দয়া করে সব তথ্য পূরণ করুন!");
      return;
    }

    // Here you would typically send the order to a backend
    console.log("Order Details:", {
      customerInfo: orderForm,
      items: cartItems,
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    });

    alert(
      `অর্ডারটি পেয়েছি! মোবাইল: ${orderForm.mobile} - ঠিকানায় ডেলিভারি দেওয়া হবে।`,
    );

    // Reset form and cart
    setCartItems([]);
    setOrderForm({
      name: "",
      mobile: "",
      address: "",
      paymentMethod: "cash",
    });
  };

  // Calculate total
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Navbar />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 p-4">
        {/* Left side - Product details */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl pb-4">Mosquito Net</h2>

          <div className="flex flex-col items-center justify-between space-y-4">
            <img
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              src="https://picsum.photos/200/300"
              alt="Product"
            />

            <div className="flex flex-row gap-4 overflow-x-auto py-4">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all min-w-[120px] ${
                    color === variant.color && size === variant.size
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setColor(variant.color);
                    setSize(variant.size);
                  }}
                >
                  <img
                    className="w-20 h-20 object-cover rounded"
                    src={variant.image}
                    alt={variant.color}
                  />
                  <h2 className="font-semibold mt-2">{variant.color}</h2>
                  <h2 className="text-sm text-gray-600">{variant.size}</h2>
                </div>
              ))}
            </div>

            {/* Quantity selector and Add to Cart */}
            <div className="w-full p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold">পরিমাণ:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">৳ 1,200</p>
                  <p className="text-sm text-gray-500">প্রতি পিস</p>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  কার্টে যোগ করুন
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-700">
                  সিলেক্ট করা হয়েছে:{" "}
                  <span className="font-semibold">
                    {color} রং, সাইজ {size}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Cart and Order Form */}
        <div className="lg:w-1/2 space-y-6">
          {/* Cart Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b">
              আপনার কার্ট ({cartItems.length} আইটেম)
            </h3>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                কার্টে কোনো আইটেম নেই
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.color} রং - সাইজ {item.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          পরিমাণ: {item.quantity}, মূল্য: ৳{" "}
                          {item.price * item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 px-3 py-1"
                      >
                        মুছুন
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>মোট</span>
                    <span>৳ {totalAmount}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b">
              অর্ডার ফর্ম
            </h3>

            <form onSubmit={handleOrderSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderForm.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="পুরো নাম লিখুন"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={orderForm.mobile}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <textarea
                    name="address"
                    value={orderForm.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="বাড়ি নং, রাস্তা, এলাকা, জেলা"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    পেমেন্ট পদ্ধতি
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={orderForm.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      ক্যাশ অন ডেলিভারি
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={orderForm.paymentMethod === "bkash"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      বিকাশ
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                      cartItems.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    disabled={cartItems.length === 0}
                  >
                    {cartItems.length === 0
                      ? "কার্টে আইটেম যোগ করুন"
                      : `অর্ডার কনফার্ম করুন (৳ ${totalAmount})`}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2">দ্রষ্টব্য:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• ১, ২ বা ৩টি মশারি অর্ডার করতে পারবেন</li>
              <li>• ডেলিভারি চার্জ আপনার এলাকার ওপর নির্ভর করবে</li>
              <li>• ২৪ ঘন্টার মধ্যে ডেলিভারি</li>
              <li>• যেকোনো সমস্যায় কল করুন: ০১৭XX-XXXXXX</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mosquitonet;
