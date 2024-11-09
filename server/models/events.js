import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventID: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  hostUserID: {
    type: String,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  maxAttendees: {
    type: Number,
    required: true
  },
  registeredAttendees: [{
    userID: {
      type: String,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    ticketNumber: {
      type: String,
      unique: true
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    email: String
  }],
  price: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  }
},{collection: 'events'});

const Event = mongoose.model('Event', eventSchema);
export default Event;