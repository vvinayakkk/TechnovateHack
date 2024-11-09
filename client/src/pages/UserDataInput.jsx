import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import axios from 'axios';

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
    recycling: [], // Use an array for multiple selections
    cookingDevices: [], // Use an array for multiple selections
  });

  // Handle input changes for all types of fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'energyEfficiency') {
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else {
        // Handle checkbox arrays (multi-select options)
        setFormData((prevData) => {
          const newSelections = checked
            ? [...prevData[name], value]
            : prevData[name].filter((item) => item !== value);

          return { ...prevData, [name]: newSelections };
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form data you want to send
    const dataToSubmit = {
      ...formData,
      userId: user.id, // Optionally add the user ID if needed
    };

    try {
      const response = await axios.post('/api/submit-form', dataToSubmit);
      console.log('Form submitted successfully:', response.data);
      // Optionally handle the success response, e.g., show a success message
    } catch (error) {
      console.error('Error submitting form:', error);
      // Optionally handle the error response, e.g., show an error message
    }
  };

  return (
    <div className="max-w-2xl mt-10 mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-xl dark:from-gray-900 dark:to-gray-800 transition-all">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700 dark:text-green-400">Carbon Footprint Details</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Dropdown Select Fields */}
        {[
          {
            id: 'heatingEnergySource',
            label: 'Heating Energy Source',
            options: ['Select an option', 'Electricity', 'Gas', 'Oil', 'Wood'],
          },
          {
            id: 'transport',
            label: 'Preferred Transport',
            options: ['Select an option', 'Walking/Bicycle', 'Private', 'Walking'],
          },
          {
            id: 'vehicleType',
            label: 'Vehicle Type (Fuel)',
            options: ['Select an option', 'Petrol', 'Diesel', 'Electric', 'LPG', 'Hybrid'],
          },
          {
            id: 'wasteBagSize',
            label: 'Waste Bag Size',
            options: ['Select an option', 'Small', 'Medium', 'Large', 'Extra Large'],
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
                <option key={index} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Input Fields */}
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

        {/* Checkbox and Multiple Select Options */}
        {[
          {
            id: 'recycling',
            label: 'What types of waste do you recycle?',
            options: ['Paper', 'Plastic', 'Glass', 'Metal'],
          },
          {
            id: 'cookingDevices',
            label: 'What devices do you use for cooking?',
            options: ['Stove', 'Oven', 'Microwave', 'Grill', 'Airfryer'],
          },
        ].map((checkboxGroup) => (
          <div key={checkboxGroup.id} className="flex flex-col mb-6">
            <label htmlFor={checkboxGroup.id} className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {checkboxGroup.label}
            </label>
            <div className="flex flex-col space-y-2">
              {checkboxGroup.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${checkboxGroup.id}-${option}`}
                    name={checkboxGroup.id}
                    value={option}
                    checked={formData[checkboxGroup.id]?.includes(option)} // Check if the option is selected
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-green-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:ring-green-500"
                  />
                  <label
                    htmlFor={`${checkboxGroup.id}-${option}`}
                    className="ml-2 text-gray-700 dark:text-gray-300"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Energy Efficiency Checkbox */}
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
