# Bus Booking Mobile App

A full-featured mobile app for booking intercity buses. Users can register, search for routes, view stop locations on a map, check destination weather, and manage their bookings. Built with **React Native** and powered by **SQLite**, **Geolocation APIs**, and **Weather APIs**.

---

##  Features

###  Core Functionality
-  **User Registration & Login** – Secure local auth using AsyncStorage.
-  **Route Planner** – Select departure and destination stops using real GTFS route data.
-  **Stop Locations** – Uses **Geocoding APIs** to fetch coordinates and display stops on a map.
-  **Weather Forecast** – Fetches real-time weather for destination using **OpenWeatherMap API**.
-  **Trip Scheduling** – View and select available trips by time and duration.
-  **Booking Management** – View, update, or delete bookings.
-  **Payment Modal** – Simulated payment methods to confirm booking.
-  **Offline Support** – GTFS data and bookings stored locally using SQLite.

---

## API Integration

### Location API
Used to geocode bus stop names into latitude and longitude for map display.

- **API Used:** OpenCage Geocoding / Google Maps Geocoding API
- **Usage:**
  - User selects a stop
  - App sends API request with stop name
  - API returns coordinates
  - Coordinates are plotted on a map

### Weather API
Displays current weather and temperature at the **destination stop** upon route selection.

- **API Used:** OpenWeatherMap API
- **Usage:**
  - Get latitude & longitude of destination stop
  - Query weather API with coordinates
  - Show weather description and temperature in trip summary

---

## Tech Stack

| Area             | Technology                           |
|------------------|--------------------------------------|
| Framework        | React Native                         |
| Language         | TypeScript                           |
| Database         | SQLite (`react-native-sqlite-storage`) |
| UI Components    | React Native Paper, Vector Icons     |
| APIs             | OpenCage Geocoding / OpenWeatherMap  |
| Storage          | AsyncStorage                         |
| Navigation       | React Navigation                     |
| Maps (optional)  | `react-native-maps` or WebView Map   |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- React Native CLI
- Android Studio + Android Virtual Device (AVD)
- API keys for:
  - OpenWeatherMap: https://openweathermap.org/api
  - OpenCage (or Google Maps Geocoding): https://opencagedata.com/api

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bus-booking-app.git
cd bus-booking-app

# Install dependencies
npm install

# Link native dependencies
npx react-native link

# Run the app on Android
npx react-native run-android
