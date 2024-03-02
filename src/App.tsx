import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import "./index.css"
const App = () => {
  const [positions, setPositions] = useState([{ 'latlng': [23.022505, 72.571365], 'place': "Ahmedabad", 'description': "Ahmedabad Gujarat" }]);

  const locationIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Font_Awesome_5_solid_map-marker-alt.svg',
    iconSize: [30, 40],
  });

  const handleMapClick = async (event: any, areaName: any) => {
    const newPosition = { latlng: [event.latlng.lat, event.latlng.lng], place: areaName.areaName, description: areaName.description };
    setPositions([...positions, newPosition]);
  };

  const ClickHandler = ({ handleMapClick }: any) => {
    const formatCoordinates = (coord: any) => {
      return Number(coord).toFixed(6);
    };

    const handleReverseGeocoding = async (lat: any, lng: any) => {
      try {
        const formattedLat = formatCoordinates(lat);
        const formattedLng = formatCoordinates(lng);

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${formattedLat}&lon=${formattedLng}`);
        const data = await response.json();

        if (data && data.display_name) {
          return { areaName: data.display_name, description: `${data.address.state_district} - ${data.address.state}` };
        } else {
          return "Area not found";
        }
      } catch (error) {
        console.error("Error fetching area name:", error);
      }
    };

    useMapEvents({
      async click(event) {
        const areaName = await handleReverseGeocoding(event.latlng.lat, event.latlng.lng);
        handleMapClick(event, areaName);
      },
    });

    return null;
  };

  const changePlaceTitle = (e: string, index: number) => {
    const allPositions = positions
    console.log(allPositions,"EXISTING");
    allPositions[`${index}`][`place`] = e;
    console.log("CHANGE HAPPEN",e,index);
    setPositions([...allPositions]);
  }

  const changePlaceDescription = (e: string, index: number) => {
    const allPositions = positions
    allPositions[`${index}`][`description`] = e;
    setPositions([...allPositions]);
  }
  return (
    <>


      <MapContainer
        center={positions.length > 0 ? positions[0].latlng : [23.072151310102868, 432.59216308593756]}
        zoom={6}
        style={{ width: '100vw', height: '50vh', cursor: 'pointer' }}
        tap={true}
      >
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <ClickHandler handleMapClick={handleMapClick} />
        {positions.map((position, index) => (
          <Marker key={index} position={position.latlng} icon={locationIcon}>
            <Popup>
              <div>
                <h3>{position.place}</h3>
                <p>{position.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div>
        <p className='text-lg p-4 font-bold'>Please select your locations</p>
      </div>
      <div
        className={`bg-white mt-2 rounded-md divide-y divide-gray-200  shadow p-4 w-120`}
      >

        {
          positions && positions.length !== 0 &&
          positions.map((item: any, index: number) => (
            <div
              className='p-2 cursor-pointer hover:bg-gray-100 transition ease-in-out duration-200 flex flex-row justify-between align-center w-full'// onClick={() => { setSelectedItem(item) }}
            >
              <div>

                <input
                  value={item?.place}
                  className='w-full hover:bg-gray-100'
                  onChange={(e) => changePlaceTitle(e.target.value, index)}
                />
                <input value={item?.description}
                  className='w-full hover:bg-gray-100'
                  onChange={(e) => changePlaceDescription(e.target.value, index)}
                />
              </div>
              <button className='bg-[#070F2B] self-center text-[#9290C3] rounded-full px-4 py-1 m-1'>edit</button>
            </div>
          ))

        }
      </div>
      <button className='bg-[#9290C3] text-[#070F2B] rounded-full p-4 m-4'>Submit</button>
    </>
  );
}

export default App