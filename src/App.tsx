import "./App.css";
import { useState } from "react";
import AirportInput from "./AirportInput";
import { Airport } from "./types";
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF } from '@react-google-maps/api';
import { haversineDistance } from "./utils";

function App() {
  const [departureAirport, setDepartureAirport] = useState<Airport | null>(null);
  const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "",
  })

  return (
    <div className="App">
      <div className="input-box">
        <AirportInput
          label="departure"
          selectedAirport={departureAirport}
          setSelectedAirport={setDepartureAirport}
        />
        <AirportInput
          label="arrival"
          selectedAirport={arrivalAirport}
          setSelectedAirport={setArrivalAirport}
        />
      </div>
      {departureAirport && arrivalAirport && <p className="distance-text">The distance between <span className="distance-text-bold">{departureAirport.name}</span> and <span className="distance-text-bold">{arrivalAirport.name}</span> is <span className="distance-text-bold">{haversineDistance(departureAirport, arrivalAirport).toFixed(2)} nautical miles</span>.</p>}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{width: "100%", height: "500px"}}
          center={{ lat: 50, lng: -110}}
          zoom={window.innerWidth < 700 ? 2 : 3}
        >
          {departureAirport &&
            <MarkerF
              position={{
                lat:parseFloat(departureAirport.latitude),
                lng: parseFloat(departureAirport.longitude) }}
            />}
          {arrivalAirport &&
            <MarkerF
              position={{
                lat: parseFloat(arrivalAirport.latitude),
                lng: parseFloat(arrivalAirport.longitude) }}
            />}
          {departureAirport && arrivalAirport &&
            <PolylineF
              path={[
                { lat: parseFloat(departureAirport.latitude), lng: parseFloat(departureAirport.longitude) },
                { lat: parseFloat(arrivalAirport.latitude), lng: parseFloat(arrivalAirport.longitude) }
              ]}
            />}
        </GoogleMap>
    ) : <></>}
    </div>
  );
}

export default App;
