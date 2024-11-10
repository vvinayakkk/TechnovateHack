import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const UserDataInput = () => {
  // const navigate = useNavigate();
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex font-bold justify-center items-center h-screen">
        <h1 className="text-5xl text-green-600 motion-preset-oscillate">Loading...</h1>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    userID: user.id, // Add the user ID
    bodyType: '', // String type
    sex: '', // String type
    diet: '', // String type
    howOftenShower: '', // String type
    heatingEnergySource: '', // String type
    transport: '', // String type
    vehicleType: '', // String type
    socialActivity: '', // String type
    monthlyGroceryBill: '', // Number type
    frequencyOfTravelingByAir: '', // Number type
    vehicleMonthlyDistanceKm: '', // Number type
    wasteBagSize: '', // String type
    wasteBagWeeklyCount: '', // Number type
    howLongTvpCDailyHour: '', // Number type
    howManyNewClothesMonthly: '', // Number type
    howLongInternetDailyHour: '', // Number type
    energyEfficiency: '', // String type
    recycling: [], // Array type
    cookingWith: [], // Array type
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle checkboxes for recycling and cookingDevices fields
      setFormData((prevData) => {
        const newSelections = checked
          ? [...prevData[name], value] // Add value if checked
          : prevData[name].filter((item) => item !== value); // Remove value if unchecked

        return { ...prevData, [name]: newSelections };
      });
    } else if (type === 'radio') {
      setFormData({
        ...formData,
        [name]: value, // For radio buttons, set the value of the selected option
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // List of predefined values for random fields
    const randomBodyTypes = ['overweight', 'obese', 'underweight', 'normal'];
    const randomSex = ['female', 'male'];
    const randomDiet = ['pescatarian', 'vegetarian', 'omnivore', 'vegan'];
    const randomShowerFrequency = ['daily', 'less frequently', 'more frequently', 'twice a day'];
    const randomSocialActivity = ['often', 'never', 'sometimes'];
    const randomEnergyEfficiency = ['No', 'Sometimes', 'Yes'];

    const getRandomBetween1And30 = () => Math.floor(Math.random() * 30) + 1;

    const randomData = {
      bodyType: randomBodyTypes[Math.floor(Math.random() * randomBodyTypes.length)],
      sex: randomSex[Math.floor(Math.random() * randomSex.length)],
      diet: randomDiet[Math.floor(Math.random() * randomDiet.length)],
      howOftenShower: randomShowerFrequency[Math.floor(Math.random() * randomShowerFrequency.length)],
      socialActivity: randomSocialActivity[Math.floor(Math.random() * randomSocialActivity.length)],
      energyEfficiency: formData.energyEfficiency || randomEnergyEfficiency[Math.floor(Math.random() * randomEnergyEfficiency.length)],
      recycling: formData.recycling.length ? formData.recycling : ['Plastic'],
      cookingWith: formData.cookingWith.length ? formData.cookingWith : ['Stove'],
      wasteBagWeeklyCount: formData.wasteBagWeeklyCount || getRandomBetween1And30(),
      howLongTvpCDailyHour: formData.howLongTvpCDailyHour || getRandomBetween1And30(),
      howManyNewClothesMonthly: formData.howManyNewClothesMonthly || getRandomBetween1And30(),
      howLongInternetDailyHour: formData.howLongInternetDailyHour || getRandomBetween1And30(),
    };

    const dataToSubmit = {
      ...formData,
      ...randomData, // Merge user input with generated random data
    };

    // Ensure the data is in the specified order
    const orderedData = {
      userID: dataToSubmit.userID,
      bodyType: dataToSubmit.bodyType,
      sex: dataToSubmit.sex,
      diet: dataToSubmit.diet,
      howOftenShower: dataToSubmit.howOftenShower,
      heatingEnergySource: dataToSubmit.heatingEnergySource,
      transport: dataToSubmit.transport,
      vehicleType: dataToSubmit.vehicleType,
      socialActivity: dataToSubmit.socialActivity,
      monthlyGroceryBill: dataToSubmit.monthlyGroceryBill,
      frequencyOfTravelingByAir: dataToSubmit.frequencyOfTravelingByAir,
      vehicleMonthlyDistanceKm: dataToSubmit.vehicleMonthlyDistanceKm,
      wasteBagSize: dataToSubmit.wasteBagSize,
      wasteBagWeeklyCount: dataToSubmit.wasteBagWeeklyCount,
      howLongTvpCDailyHour: dataToSubmit.howLongTvpCDailyHour,
      howManyNewClothesMonthly: dataToSubmit.howManyNewClothesMonthly,
      howLongInternetDailyHour: dataToSubmit.howLongInternetDailyHour,
      energyEfficiency: dataToSubmit.energyEfficiency,
      recycling: dataToSubmit.recycling,
      cookingWith: dataToSubmit.cookingWith,
      fullName: user.fullName,
      imageURL: user.imageUrl,
    };

    console.log('Submitting form:', orderedData);

    try {
      const response = await axios.post(`${SERVER_URL}/user/create`, orderedData);
      console.log('Form submitted successfully:', response.data);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 overflow-hidden">
      {/* Top left corner */}
      {/* <motion.div
        className="absolute top-4 left-4 text-green-800 text-xl font-bold"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        initial="hidden"
        animate="show"
      >
        Carbon Footprint Details
      </motion.div> */}

      {/* Form Section */}
      <div className="mt-10 flex justify-center items-center min-h-screen px-4">
        <div className="max-w-2xl w-full p-6 bg-white bg-opacity-90 shadow-2xl rounded-xl dark:bg-gray-900 dark:bg-opacity-90 transition-all">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-center text-green-800 dark:text-green-400 mb-6">
            Enter More Details
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Dropdown Select Fields */}
            {[
              {
                id: 'heatingEnergySource',
                label: 'Heating Energy Source',
                options: ['Select an option', 'coal', 'natural gas', 'wood', 'electricity'],
              },
              {
                id: 'transport',
                label: 'Preferred Transport',
                options: ['Select an option', 'walk/bicycle', 'private', 'public'],
              },
              {
                id: 'vehicleType',
                label: 'Vehicle Type (Fuel)',
                options: ['Select an option', 'petrol', 'diesel', 'electric', 'lpg', 'hybrid'],
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

            {/* Number Inputs for Vehicle Monthly Distance and Frequency of Travel by Air */}
            <div className="flex flex-col mb-6">
              <label htmlFor="vehicleMonthlyDistanceKm" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vehicle Monthly Distance (km)
              </label>
              <input
                type="number"
                id="vehicleMonthlyDistanceKm"
                name="vehicleMonthlyDistanceKm"
                value={formData.vehicleMonthlyDistanceKm}
                onChange={handleChange}
                className="mt-2 p-3 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="frequencyOfTravelingByAir" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency of Traveling by Air (times per month)
              </label>
              <input
                type="number"
                id="frequencyOfTravelingByAir"
                name="frequencyOfTravelingByAir"
                value={formData.frequencyOfTravelingByAir}
                onChange={handleChange}
                className="mt-2 p-3 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            {/* Energy Efficiency Dropdown */}
            <div className="flex flex-col mb-6">
              <label htmlFor="energyEfficiency" className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Do you prefer energy-efficient devices?
              </label>
              <select
                id="energyEfficiency"
                name="energyEfficiency"
                value={formData.energyEfficiency}
                onChange={handleChange}
                className="mt-2 p-3 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Select an option</option>
                {['No', 'Sometimes', 'Yes'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
      </div>

      {/* Floating Elements (e.g., leaves) */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-500"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          🍃
        </motion.div>
      ))}
    </div>
  );
};

export default UserDataInput;
