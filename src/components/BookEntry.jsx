
import React, { useState } from "react";
import {
  Upload,
  ImagePlus,
  ChevronDown,
} from "lucide-react";

function BookEntry() {
  const [bookImage, setBookImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBookImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book entry submitted");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[#faf9f5]">

      {/* Main Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl px-5 py-7 sm:px-7 sm:py-6">

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#064b38] mb-1">
            Add New Book Entry
          </h1>

          <p className="text-sm sm:text-base text-gray-600">
            Fill in the details below to add a new book to the digital library
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Book Name */}
          <div>
            <label
              htmlFor="bookName"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Book Name
            </label>

            <input
              type="text"
              id="bookName"
              placeholder="Enter full book title (e.g., Stories of the Prophets)"
              required
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
            />
          </div>

          {/* Book Price */}
          <div>
            <label
              htmlFor="bookPrice"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Book Price
            </label>

            <div className="flex h-10 border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#086048] focus-within:ring-2 focus-within:ring-[#086048]/10">
              <span className="flex items-center px-3 bg-gray-100 border-r border-gray-300 text-sm sm:text-base whitespace-nowrap">
                ₹ / Rs.
              </span>

              <input
                type="number"
                id="bookPrice"
                placeholder="Enter book price (e.g., 250)"
                min="0"
                required
                className="w-full min-w-0 px-3 text-sm sm:text-base outline-none"
              />
            </div>
          </div>

          {/* Book Quantity */}
          <div>
            <label
              htmlFor="bookQuantity"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Book Quantity
            </label>

            <input
              type="number"
              id="bookQuantity"
              placeholder="Enter available stock / quantity (e.g., 50)"
              min="0"
              required
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
            />
          </div>

          {/* Book Image */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Book Image
            </label>

            <label
              htmlFor="bookImage"
              className="min-h-[76px] w-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-3 py-3 cursor-pointer hover:border-[#086048] hover:bg-green-50/50 transition"
            >
              <input
                type="file"
                id="bookImage"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex items-center justify-center gap-2 text-center flex-wrap">
                {bookImage ? (
                  <>
                    <ImagePlus size={21} className="text-[#064b38]" />
                    <span className="text-sm text-gray-800 break-all">
                      {bookImage.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={21} className="text-[#064b38] shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900">
                      Drag and drop book cover image here, or{" "}
                      <strong className="text-[#064b38]">
                        browse files
                      </strong>
                    </span>
                  </>
                )}
              </div>

              <span className="text-xs sm:text-sm text-gray-500">
                Supports JPG, PNG (Max 5MB)
              </span>
            </label>
          </div>

          {/* Class */}
          <div>
            <label
              htmlFor="bookClass"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Class
            </label>

            <div className="relative">
              <select
                id="bookClass"
                required
                defaultValue=""
                className="w-full h-10 appearance-none px-3 pr-10 border border-gray-300 rounded-lg bg-white text-sm sm:text-base text-gray-600 outline-none cursor-pointer focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
              >
                <option value="" disabled>
                  Select Class / Grade (e.g., Class 1, Class 2, Class 3...)
                </option>

                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={19}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">

            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-[#07543e] hover:bg-[#063e2f] text-white font-semibold text-sm sm:text-base transition-colors"
            >
              Submit Book Entry
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="h-10 px-5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm sm:text-base transition-colors"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default BookEntry;
