import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, DollarSign, Leaf, Car, Train, Bus, Globe, CalendarDays, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Components/CarbonScore.jsx
const CarbonScore = ({ score }) => {
  const maxLeaves = 5;
  return (
    <div className="flex space-x-1">
      {[...Array(maxLeaves)].map((_, i) => (
        <Leaf
          key={i}
          className={`w-4 h-4 ${i < score
            ? 'text-emerald-500'
            : 'text-gray-300 dark:text-gray-600'
            }`}
        />
      ))}
    </div>
  );
};

const calculateCarbonScore = (transport) => {
  const scores = {
    car: 2,
    bus: 4,
    train: 5,
    bicycle: 5
  };
  return scores[transport] || 3;
};

// Components/EventCard.jsx
const EventCard = ({ event, onClick, isDarkMode }) => {
  const isEcoEvent = event.isEcoFriendly;

  return (
    <Card
      onClick={() => onClick(event)}
      className={`
        hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer
        transform hover:-translate-y-1
        ${isEcoEvent
          ? 'border-2 border-emerald-500 hover:border-emerald-400'
          : 'border-2 border-gray-300 hover:border-gray-400'}
        ${isDarkMode ? 'bg-slate-800/90 text-white' : 'bg-white text-black'}
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold truncate">{event.title}</h3>
          {isEcoEvent ? (
            <Globe className="w-5 h-5 text-emerald-500" />
          ) : (
            <CalendarDays className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className={`w-4 h-4 mr-2 ${isEcoEvent ? 'text-emerald-500' : 'text-gray-500'}`} />
          <span className="truncate">{event.location?.address}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className={`w-4 h-4 mr-2 ${isEcoEvent ? 'text-emerald-500' : 'text-gray-500'}`} />
          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <DollarSign className={`w-4 h-4 mr-2 ${isEcoEvent ? 'text-emerald-500' : 'text-gray-500'}`} />
          <span>{event.price === 0 ? "Free" : `$${event.price}`}</span>
        </div>
        {isEcoEvent && (
          <div className="mt-4 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Carbon Impact: <CarbonScore score={calculateCarbonScore(event.transport)} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Components/EventModal.jsx
const EventModal = ({ event, onClose, onRegister, loading }) => {
  const isEcoEvent = event.isEcoFriendly;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`p-8 rounded-lg w-11/12 sm:w-3/4 md:w-1/2 max-w-3xl 
            ${isEcoEvent
              ? 'bg-emerald-900/95 text-white'
              : 'bg-slate-900/95 text-white'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src="/event1.jpeg"
              alt="Event"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            {isEcoEvent ? (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm">
                Eco-Friendly Event
              </div>
            ) : (
              <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                Standard Event
              </div>
            )}
          </div>

          <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
          <p className="text-sm mb-4">{event.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm">
              <MapPin className={`w-4 h-4 mr-2 ${isEcoEvent ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span>{event.location?.address}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className={`w-4 h-4 mr-2 ${isEcoEvent ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className={`w-4 h-4 mr-2 ${isEcoEvent ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span>{event.price === 0 ? "Free" : `$${event.price}`}</span>
            </div>
          </div>

          {isEcoEvent && (
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">
                Sustainable Transportation Options
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Train className="w-4 h-4 mr-2 text-emerald-500" />
                  <span className="text-sm text-black">Train</span>
                </div>
                <div className="flex items-center">
                  <Bus className="w-4 h-4 mr-2 text-emerald-500" />
                  <span className="text-sm text-black">Bus</span>
                </div>
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-2 text-emerald-500" />
                  <span className="text-sm text-black">Carpool</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Carbon Impact: <CarbonScore score={calculateCarbonScore(event.transport)} />
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={() => onRegister(event._id)}
              className={`flex-1 ${isEcoEvent
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-gray-500 hover:bg-gray-600'
                } text-white`}
              disabled={loading}
            >
              {loading ? <>
                <Loader2 className="animate-spin" />
                <p>Please wait</p>
              </> : <p>Register Now</p>}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${isEcoEvent
                ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-50'
                : 'border-gray-500 text-gray-500 hover:bg-gray-50'
                }`}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main EventPage component
export default function EventPage() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [filter, setFilter] = useState('all'); // 'all', 'eco', 'standard'
  const [loading, setLoading] = useState(false);
  const userID = user?.id;

  useEffect(() => {
    axios.get(`${SERVER_URL}/event/get-events`)
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
      });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      event.location?.address?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'eco') return matchesSearch && event.isEcoFriendly;
    if (filter === 'standard') return matchesSearch && !event.isEcoFriendly;
    return matchesSearch;
  });

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleRegister = async (eventId) => {
    const event = events.find(e => e._id === eventId);
    setLoading(true);
    const response = await axios.post(`${SERVER_URL}/event/register`, {
      eventID: event.eventID,
      userID: userID,
      email: user.primaryEmailAddress.emailAddress
    });

    if (response.status !== 200) {
      setLoading(false);
      return toast.error(`Failed to register for the event. Please try again later.`);
    }

    setLoading(false);
    toast.success(`Successfully registered for ${event.title}!`, {
      description: event.isEcoFriendly
        ? 'Thank you for joining this carbon-conscious event!'
        : 'Thank you for registering!'
    });
  };

  return (
    <div className="container mx-auto p-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4"
      >
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Community Events
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Discover and join local events - from eco-friendly gatherings to standard meetups
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6"
      >
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events"
          className="w-full"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className="min-w-[100px]"
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('eco')}
            variant={filter === 'eco' ? 'default' : 'outline'}
            className="min-w-[100px] bg-emerald-500"
          >
            Eco-Friendly
          </Button>
          <Button
            onClick={() => setFilter('standard')}
            variant={filter === 'standard' ? 'default' : 'outline'}
            className="min-w-[100px]"
          >
            Standard
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EventCard
              event={event}
              onClick={handleCardClick}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={closeModal}
          onRegister={handleRegister}
          loading={loading}
        />
      )}
    </div>
  );
}