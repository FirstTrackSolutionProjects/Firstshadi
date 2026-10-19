import React, { useState } from 'react';
import { motherTongues } from '../data/motherTongues';

const Regone = () => {
  const [formData, setFormData] = useState({
    prefix: 'Mr',
    name: '',
    dob: '',
    motherTongue: '',
    religion: '',
    caste: '',
    maritalStatus: '',
    height: '',
  });

  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
  const castes = ['Brahmin', 'Rajput', 'Yadav', 'SC', 'ST', 'OBC', 'Other'];
  const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Separated'];
  const heights = [
    '4ft 6in', '4ft 8in', '5ft 0in', '5ft 2in', '5ft 4in',
    '5ft 6in', '5ft 8in', '5ft 10in', '6ft 0in', '6ft 2in'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 space-y-6">
      <img
        src="./image/s23.jpg"
        alt="Banner"
        className="w-full max-w-md h-105 object-cover rounded-md shadow-md"
      />

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-lg text-center font-semibold mb-6 text-red-800">
          Complete your profile now
        </h2>

        <form className="space-y-4">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-1 text-red-800">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Mother Tongue */}
          <div>
            <label className="block text-sm font-medium mb-1 text-red-800">
              Mother Tongue <span className="text-red-500">*</span>
            </label>
            <select
              name="motherTongue"
              value={formData.motherTongue}
              onChange={handleChange}
              required
              className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Mother Tongue</option>
              {motherTongues.map((lang, index) => (
                <option key={index} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-sm font-medium mb-1 text-red-800">
              Religion <span className="text-red-500">*</span>
            </label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              required
              className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Religion</option>
              {religions.map((rel, index) => (
                <option key={index} value={rel}>{rel}</option>
              ))}
            </select>
          </div>

          {/* Caste */}
          <div>
            <label className="block text-sm font-medium mb-1 text-red-800">
              Caste <span className="text-red-500">*</span>
            </label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              required
              className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Caste</option>
              {castes.map((cast, index) => (
                <option key={index} value={cast}>{cast}</option>
              ))}
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-red-800">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
              className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Marital Status</option>
              {maritalStatuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-1 text-red-800">
              Height <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter height"
                required
                className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full border border-yellow-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Choose</option>
                {heights.map((h, index) => (
                  <option key={index} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-red-800">
              You can either type your height or select from the list.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-900 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Regone;
