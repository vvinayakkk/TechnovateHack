import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from 'sonner';

export default function EventPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Ensure theme is applied on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const registeredEvents = [
    {
      _id: "1",
      title: "Film Festival",
      eventDescription: "Showcasing independent films from around the world",
      location: "Los Angeles, CA",
      eventDate: "2024-06-01",
      registrationFee: "$100.00",
      maxAttendees: 500,
      eventFormat: "Offline",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyvetnLOz5AF4JPJGxqw0EJpwpBHl9swwqww&s"
    },
    {
      _id: "2",
      title: "Comic Con",
      eventDescription: "Annual gathering for comic and pop culture fans",
      location: "San Diego, CA",
      eventDate: "2024-07-23",
      registrationFee: "$150.00",
      maxAttendees: 1000,
      eventFormat: "Offline",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyvetnLOz5AF4JPJGxqw0EJpwpBHl9swwqww&s"
    },
  ];

  const filteredRegistrationEvents = registeredEvents.filter(event =>
    event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    event.eventDescription.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const EventCards = ({ events }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {events.map((event, index) => (
        <Card
          key={event._id}
          onClick={() => handleCardClick(event)}
          className={`hover:shadow-xl transition-shadow border-2 border-dashed border-orange-500 duration-300 ease-in-out cursor-pointer relative ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
        >
          {index < 3 && (
            <span className="absolute top-2 right-2 text-xl">🔥</span>
          )}
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 truncate">{event.eventDescription}</h3>
            <p className="text-sm text-muted-foreground mb-4">{event.eventFormat === "online" ? "Online" : "Offline"}</p>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(event.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{event.registrationFee === "Free" ? "Free" : event.registrationFee}</span>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              <strong>Max Attendees:</strong> {event.maxAttendees}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const Modal = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`p-8 rounded-lg w-11/12 sm:w-3/4 md:w-1/2 max-w-3xl ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-black'}`}>
        <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
        <p className="text-sm mb-4">{event.eventDescription}</p>
        <div className="mb-4">
          <img src={event.image} alt={event.title} className="w-full h-60 object-cover rounded-lg" />
        </div>
        <div className="flex items-center mb-2 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center mb-2 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm mb-4">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>{event.registrationFee}</span>
        </div>
        <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="container mx-auto p-3">
        <Toaster richColors />
        <div className="text-center mt-4">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Explore Events</h2>
          <p className="mt-2 text-muted-foreground">Discover and register for upcoming events</p>
        </div>
        <div className="flex justify-center items-center mt-6">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events"
            className="w-full"
          />
          <Button className="ml-2 bg-orange-500 hover:bg-orange-400">
            <Search className="w-4 h-4 mr-1" />
            Search
          </Button>
        </div>
        <div className="mt-8">
          <h2 className={`text-2xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Registered Events</h2>
          <EventCards events={filteredRegistrationEvents} />
        </div>
        {selectedEvent && <Modal event={selectedEvent} onClose={closeModal} />}
      </div>
    </>
  );
}
