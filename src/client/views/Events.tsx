import React, { useEffect, useState } from 'react';
import axios from 'axios';

import EventsList from '../components/events-view/EventsList';

type GeoPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type Location = {
  latitude: null | number;
  longitude: null | number;
};

type EventData = {
  id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  address: string;
  description: string;
  venue_id: number;
  created_by: number;
  chatroom_id: number;
  createdAt: Date;
  updatedAt: Date;
};

function Events() {
  // The latitude and longitude of the user will be stored in state on page load
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  // Events the user can attend will be stored in state on page load
  const [events, setEvents] = useState<EventData[]>([]);

  const getGeoLocation = () => {
    const success = (position: GeoPosition) => {
      const { latitude, longitude } = position.coords;

      setLocation({ latitude, longitude });
    };

    const error = () => {
      console.error('Unable to retrieve your location');
    };

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const getEvents = () => {
    axios
      .get('/api/event')
      .then(({ data }) => {
        setEvents(data);
      })
      .catch((err: unknown) => {
        console.error('Failed to getEvents:', err);
      });
  };

  useEffect(() => {
    getGeoLocation();
    getEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 content-center">
      <h1 className="text-2xl font-bold text-center">Events In Your Area</h1>
      <EventsList events={events} />
      <h1 className="text-2xl font-bold text-center">Events Attending</h1>
    </div>
  );
}

export default Events;
