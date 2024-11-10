import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
  },
  fullName: { type: String },
  bodyType: { type: String },
  sex: { type: String },
  diet: { type: String },
  howOftenShower: { type: String },
  heatingEnergySource: { type: String },
  transport: { type: String },
  vehicleType: { type: String },
  socialActivity: { type: String },
  monthlyGroceryBill: { type: Number },
  frequencyOfTravelingByAir: { type: String },
  vehicleMonthlyDistanceKm: { type: Number },
  wasteBagSize: { type: String },
  wasteBagWeeklyCount: { type: Number },
  howLongTvpCDailyHour: { type: Number },
  howManyNewClothesMonthly: { type: Number },
  howLongInternetDailyHour: { type: Number },
  energyEfficiency: { type: String },
  recycling: { type: [String] },
  cookingWith: { type: [String] },
  carbonEmission: {
    type: Number,
    default: null
  },
  friends: {
    type: [String],
    ref: 'User',
    default: []  // Empty array by default
  },
  friendRequestsSent: {
    type: [String],
    ref: 'User',
    default: []  // Empty array by default
  },
  friendRequestsReceived: {
    type: [String],
    ref: 'User',
    default: []  // Empty array by default
  }
});

const User = mongoose.model('User', userSchema);
export default User;