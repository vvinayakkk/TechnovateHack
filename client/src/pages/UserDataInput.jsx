import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';

const UserDataInput = () => {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex font-bold justify-center items-center h-screen">
        <h1 className="text-5xl text-green-600 motion-preset-oscillate">Loading...</h1>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    heatingEnergySource: '',
    transport: '',
    vehicleType: '',
    monthlyGroceryBill: '',
    frequencyTravelingByAir: '',
    wasteBagSize: '',
    wasteBagWeeklyCount: '',
    energyEfficiency: false,
    recycling: '',
    cookingDevices: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="max-w-2xl mt-10 mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-xl dark:from-gray-900 dark:to-gray-800 transition-all">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700 dark:text-green-400">Carbon Footprint Details</h2>
                                                                 
      <form className="space-y-6">
        {/* Form Fields */}
        {[
          {
            id: 'heatingEnergySource',
            label: 'Heating Energy Source',
            options: ['Select an option', 'Electricity', 'Gas', 'Oil', 'Wood'],
          },
          {
            id: 'transport',
            label: 'Preferred Transport',
            options: ['Select an option', 'Car', 'Public Transport', 'Bike', 'Walking'],
          },
          {
            id: 'vehicleType',
            label: 'Vehicle Type (Fuel)',
            options: ['Select an option', 'Petrol', 'Diesel', 'Electric', 'Hybrid'],
          },
          {
            id: 'wasteBagSize',
            label: 'Waste Bag Size',
            options: ['Select an option', 'Small', 'Medium', 'Large'],
          },
        ].map((field) => (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.id} className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <select
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              className="mt-2 p-3 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
            >
              {field.options.map((option, index) => (
                <option key={index} value={option.toLowerCase()}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Input fields */}
        {[
          {
            id: 'monthlyGroceryBill',
            label: 'Monthly Grocery Bill (USD)',
            type: 'number',
            placeholder: 'e.g. 300',
          },
          {
            id: 'frequencyTravelingByAir',
            label: 'Frequency of Traveling by Air (per month)',
            type: 'number',
            placeholder: 'e.g. 2',
          },
          {
            id: 'wasteBagWeeklyCount',
            label: 'Waste Bag Weekly Count',
            type: 'number',
            placeholder: 'e.g. 3',
          },
        ].map((input) => (
          <div key={input.id} className="flex flex-col">
            <label htmlFor={input.id} className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {input.label}
            </label>
            <input
              type={input.type}
              id={input.id}
              name={input.id}
              value={formData[input.id]}
              onChange={handleChange}
              placeholder={input.placeholder}
              className="mt-2 p-3 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        ))}

        {/* Checkbox and Textareas */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="energyEfficiency"
            name="energyEfficiency"
            checked={formData.energyEfficiency}
            onChange={handleChange}
            className="h-5 w-5 text-green-600 rounded border-gray-300 dark:border-gray-600 focus:ring-green-500"
          />
          <label htmlFor="energyEfficiency" className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Do you prefer energy-efficient devices?
          </label>
        </div>

        {[
          { id: 'recycling', label: 'What types of waste do you recycle?', placeholder: 'e.g. Paper, Plastic, Glass' },
          { id: 'cookingDevices', label: 'What devices do you use for cooking?', placeholder: 'e.g. Stove, Microwave' },
        ].map((textarea) => (
          <div key={textarea.id} className="flex flex-col">
            <label htmlFor={textarea.id} className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {textarea.label}
            </label>
            <textarea
              id={textarea.id}
              name={textarea.id}
              value={formData[textarea.id]}
              onChange={handleChange}
              placeholder={textarea.placeholder}
              className="mt-2 p-3 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-8 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserDataInput;
