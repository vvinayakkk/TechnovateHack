import User from '../../models/user.js';

const createUser = async (req, res) => {
  try {

    const {
      userID,
      bodyType,
      sex,
      diet,
      howOftenShower,
      heatingEnergySource,
      transport,
      vehicleType,
      socialActivity,
      monthlyGroceryBill,
      frequencyOfTravelingByAir,
      vehicleMonthlyDistanceKm,
      wasteBagSize,
      wasteBagWeeklyCount,
      howLongTvpCDailyHour,
      howManyNewClothesMonthly,
      howLongInternetDailyHour,
      energyEfficiency,
      recycling,
      cookingWith
    } = req.body;
  
    
    const newUser = new User({
      userID,
      bodyType,
      sex,
      diet,
      howOftenShower,
      heatingEnergySource,
      transport,
      vehicleType,
      socialActivity,
      monthlyGroceryBill,
      frequencyOfTravelingByAir,
      vehicleMonthlyDistanceKm,
      wasteBagSize,
      wasteBagWeeklyCount,
      howLongTvpCDailyHour,
      howManyNewClothesMonthly,
      howLongInternetDailyHour,
      energyEfficiency,
      recycling,
      cookingWith
    });

    
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create user',
      error: error.message
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userID } = req.body;
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User found',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

export { createUser, getUser };