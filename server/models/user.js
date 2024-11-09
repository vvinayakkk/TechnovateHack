import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
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
  energyEfficiency: { type: Boolean },
  recycling: { type: [String] },
  cookingWith: { type: [String] },
  carbonEmission: { 
    type: Number ,   // This is still part of the model but won't be calculated
    default: null
}  
});

const User = mongoose.model('User', userSchema);
export default User;
