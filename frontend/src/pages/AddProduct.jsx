// import { useState } from "react";
// import axios from "axios";

// export default function AddProduct() {
//   const [name, setName] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");

//   const [variants, setVariants] = useState([
//     { size: "", color: "", stock: "", price: "", images: [] },
//   ]);

//   const handleChange = (i, e) => {
//     const newVariants = [...variants];
//     newVariants[i][e.target.name] = e.target.value;
//     setVariants(newVariants);
//   };

//   const handleImages = (i, files) => {
//     const newVariants = [...variants];
//     newVariants[i].images = files;
//     setVariants(newVariants);
//   };

//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       { size: "", color: "", stock: "", price: "", images: [] },
//     ]);
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("category", category);
//     formData.append("description", description);
//     formData.append(
//       "variants",
//       JSON.stringify(
//         variants.map((v) => ({
//           size: v.size,
//           color: v.color,
//           stock: v.stock,
//           price: v.price,
//         })),
//       ),
//     );

//     variants.forEach((v, i) => {
//       for (let img of v.images) {
//         formData.append(`variantImages_${i}`, img);
//       }
//     });

//     await axios.post(
//       `${import.meta.env.VITE_BASE_URL}/api/products/create`,
//       formData,
//     );

//     alert("Product Created");
//   };

//   return (
//     <form onSubmit={submit}>
//       <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
//       <input
//         placeholder="Category"
//         onChange={(e) => setCategory(e.target.value)}
//       />
//       <textarea
//         placeholder="Description"
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       {variants.map((v, i) => (
//         <div key={i}>
//           <input
//             name="size"
//             placeholder="Size"
//             onChange={(e) => handleChange(i, e)}
//           />
//           <input
//             name="color"
//             placeholder="Color"
//             onChange={(e) => handleChange(i, e)}
//           />
//           <input
//             name="stock"
//             placeholder="Stock"
//             onChange={(e) => handleChange(i, e)}
//           />
//           <input
//             name="price"
//             placeholder="Price"
//             onChange={(e) => handleChange(i, e)}
//           />

//           <input
//             type="file"
//             multiple
//             onChange={(e) => handleImages(i, e.target.files)}
//           />
//         </div>
//       ))}

//       <button type="button" onClick={addVariant}>
//         + Add Variant
//       </button>

//       <button type="submit">Save</button>
//     </form>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { Upload, Plus, Trash2, Save } from "lucide-react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [variants, setVariants] = useState([
    { size: "", color: "", stock: "", price: "", images: [] },
  ]);

  const handleChange = (i, e) => {
    const newVariants = [...variants];
    newVariants[i][e.target.name] = e.target.value;
    setVariants(newVariants);
  };

  const handleImages = (i, files) => {
    const newVariants = [...variants];
    newVariants[i].images = Array.from(files);
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", color: "", stock: "", price: "", images: [] },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  const removeImage = (variantIndex, imageIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter(
      (_, i) => i !== imageIndex,
    );
    setVariants(newVariants);
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !category || !description) {
      alert("দয়া করে নাম, ক্যাটাগরি এবং বিবরণ পূরণ করুন");
      return;
    }

    for (const variant of variants) {
      if (!variant.size || !variant.color || !variant.stock || !variant.price) {
        alert("সব ভ্যারিয়েন্টের তথ্য পূরণ করুন");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append(
        "variants",
        JSON.stringify(
          variants.map((v) => ({
            size: v.size,
            color: v.color,
            stock: Number(v.stock),
            price: Number(v.price),
          })),
        ),
      );

      variants.forEach((v, i) => {
        v.images.forEach((img) => {
          formData.append(`variantImages_${i}`, img);
        });
      });

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("✅ পণ্য সফলভাবে যোগ করা হয়েছে!");

      // Reset form
      setName("");
      setCategory("");
      setDescription("");
      setVariants([{ size: "", color: "", stock: "", price: "", images: [] }]);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ পণ্য যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              নতুন পণ্য যোগ করুন
            </h1>
            <p className="text-green-100 mt-2">
              পণ্যের বিস্তারিত তথ্য এবং ভ্যারিয়েন্ট যোগ করুন
            </p>
          </div>

          <form onSubmit={submit} className="p-6 md:p-8">
            {/* Basic Info Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                মৌলিক তথ্য
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পণ্যের নাম *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="উদাহরণ: প্রিমিয়াম মশারি"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ক্যাটাগরি *
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="উদাহরণ: মশারি, বেডশিট"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিবরণ *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>
            </div>

            {/* Variants Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  ভ্যারিয়েন্ট সংযোজন
                </h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Plus size={18} />
                  নতুন ভ্যারিয়েন্ট
                </button>
              </div>

              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-white transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700">
                        ভ্যারিয়েন্ট #{index + 1}
                      </h3>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          সাইজ *
                        </label>
                        <input
                          name="size"
                          value={variant.size}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="6/7, 5/6"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          রং *
                        </label>
                        <input
                          name="color"
                          value={variant.color}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="লাল, নীল, সবুজ"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          স্টক *
                        </label>
                        <input
                          name="stock"
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          মূল্য (৳) *
                        </label>
                        <input
                          name="price"
                          type="number"
                          min="0"
                          value={variant.price}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="1200"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        ছবি যোগ করুন
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {/* Image Preview */}
                        {variant.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${imgIndex + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, imgIndex)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {/* Upload Button */}
                        <label className="cursor-pointer">
                          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">আপলোড</span>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              handleImages(index, e.target.files)
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        একাধিক ছবি নির্বাচন করতে পারবেন
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[200px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    সংরক্ষণ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    পণ্য সংরক্ষণ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
