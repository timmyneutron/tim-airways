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
      <div className="title-container">
        <h1 className="icon">✈️</h1>
        <h1 className="title">Tim Airways</h1>
        <h1 className="icon">✈️</h1>
      </div>
      <h3 className="tagline">Calculating the distance between two airports in the US in nautical miles since 2024</h3>
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
      {departureAirport && arrivalAirport &&
        <div className="distance-container">
          <div className="distance-text">The distance between </div>
          <div className="distance-text-bold">{departureAirport.name}</div>
          <div className="distance-text"> and </div>
          <div className="distance-text-bold">{arrivalAirport.name}</div>
          <div className="distance-text"> is </div>
          <div className="distance-text-bold">{haversineDistance(departureAirport, arrivalAirport).toFixed(2)} nautical miles</div>
        </div>}
      {isLoaded ? (
        <div className="map">
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
        </div>
    ) : <></>}
    </div>
  );
}

export default App;
