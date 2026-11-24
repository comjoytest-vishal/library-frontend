
import React from "react";
import {
  UserRound,
  GraduationCap,
  Hash,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";

function StudentEntry() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student entry submitted");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[#faf9f5]">

      {/* Main Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl px-5 py-7 sm:px-7 sm:py-6">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-full bg-green-50 text-[#064b38] flex items-center justify-center mx-auto mb-3">
            <GraduationCap size={27} />
          </div>

          <h1 className="text-2xl sm:text-[28px] font-bold text-[#064b38] mb-1">
            Add New Student Entry
          </h1>

          <p className="text-sm sm:text-base text-gray-600">
            Fill in the details below to register a new student
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Student Name */}
          <div>
            <label
              htmlFor="studentName"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Student Name
            </label>

            <div className="relative">
              <UserRound
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                id="studentName"
                placeholder="Enter student's full name"
                required
                className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
              />
            </div>
          </div>

          {/* Class */}
          <div>
            <label
              htmlFor="studentClass"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Class
            </label>

            <div className="relative">
              <GraduationCap
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <select
                id="studentClass"
                defaultValue=""
                required
                className="w-full h-11 appearance-none pl-10 pr-10 border border-gray-300 rounded-lg bg-white text-sm sm:text-base text-gray-600 outline-none cursor-pointer focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
              >
                <option value="" disabled>
                  Select Class / Grade
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

          {/* Roll Number */}
          <div>
            <label
              htmlFor="rollNumber"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Roll Number
            </label>

            <div className="relative">
              <Hash
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="number"
                id="rollNumber"
                placeholder="Enter student's roll number"
                min="1"
                required
                className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="studentPhone"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="tel"
                id="studentPhone"
                placeholder="Enter 10-digit phone number"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="studentAddress"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Address
            </label>

            <div className="relative">
              <MapPin
                size={19}
                className="absolute left-3 top-4 text-gray-400"
              />

              <textarea
                id="studentAddress"
                rows={3}
                placeholder="Enter student's full address"
                required
                className="w-full min-h-[90px] resize-y pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none focus:border-[#086048] focus:ring-2 focus:ring-[#086048]/10 transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">

            <button
              type="submit"
              className="flex-1 h-11 rounded-lg bg-[#07543e] hover:bg-[#063e2f] text-white font-semibold text-sm sm:text-base transition-colors"
            >
              Submit Student Entry
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="h-11 px-5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm sm:text-base transition-colors"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default StudentEntry;
