import React from 'react'
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';

import { GoogleMap, useLoadScript, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import usePlacesAutocomplete, {  getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import "../assets/css/Map.css";
import mapStyles from '../assets/css/mapStyles';

// ホットペッパー　api
const KEY = '6fca1552a5354f20';

const hotpepper = axios.create ({
  baseURL: '/hotpepper/gourmet/v1'
})

export const fetchSearchData = async() =>{
  //大エリアコード=Z011(東京)のお店を検索
    return await hotpepper.get('',{
        params: {
            key:KEY,
            // large_area:'Z011',
            keyword: 'ラーメン',
            count: 20,
            format: 'json'
        }
    })
}

// Map
const containerStyle = {
  width: '100%',
  height: '100vh'
};

function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCOVIadCWc7aJkhQakeh_A38FRwwsxByvo",
    libraries : ["places"],
  });

  if(!isLoaded) return <div>...Loading</div>;
  return <Map />;
}

function Map() {
  const [shop, setShop] = useState();
  const [selected, setSelected] = useState(null);
  const [markers, setMarkers] = React.useState([]);

  const center = useMemo(() => ({lat:35.652832, lng:139.839478}), []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  })

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(10);
  }, []);

  useEffect(() =>{
    fetchSearchData().then((res) => {
        setShop(res.data.results.shop);
        console.log(res.data.results)
        console.log(res.data.results.shop)
        // console.log(res.data.results.shop)
    })
  },[])

  return (
    <div>

      <Search panTo={panTo} />
      <Locate panTo={panTo} />

      <GoogleMap
        zoom={10}
        center={center}
        mapContainerStyle={containerStyle}
        onClick={(event) => {
          console.log(event);
        }}
        onLoad={onMapLoad}
      >
        { shop &&
          shop.map((item, index) => (
            <Marker
              key={index} 
              position={{lat:item.lat, lng:item.lng}} 
              onClick={() => {
                  setSelected(item);
                  console.log(item);
              }}
          />
          ))
        }
        <Marker 
          position={center}
          icon={{
            url: require('../assets/image/user.png'),
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
          }}
        />

        <Circle center={center} radius={10000} />

        {selected ? (
          <InfoWindow 
              position={{lat: selected.lat, lng: selected.lng}}
              onCloseClick={() => {
                  setSelected(null);
              }}
          >
          <div>
              <h2>{selected.access}</h2>
              <p>address : selected.address</p>
          </div>
          </InfoWindow>):null
        }
      </GoogleMap>
    </div>
  )
  
}

function Locate({ panTo }) {
  return (
    <button className="locate" onClick={() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        }, 
        () => null, 
      );
    }}>
      LocateMe!!!
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 35.652832, lng: () => 139.839478 },
      radius: 200 * 1000,
    },
  });

  return (
    <div className='search'>
      <Combobox 
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();

          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
          } catch (error) {
            console.log(error);
          }

          // console.log(address);
        }}
      >
        <ComboboxInput 
          value={value} 
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter an address" 
        />
        <ComboboxPopover>
          <ComboboxList>
            {status == "OK" && 
              data.map(({id, description}) => (
                <ComboboxOption key={id} value={description} />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
    
  );  
}

// const generateHouses = (position) => {
//   const _houses = [];
//   for (let i = 0; i < 100; i++) {
//       const direction = Math.random() < 0.5 ? -2 : 2;
//       _houses.push({
//           lat: position.lat + Math.random() / direction,
//           lng: position.lng + Math.random() / direction,
//       });
//   }
//   return _houses;
// };

export default Home;