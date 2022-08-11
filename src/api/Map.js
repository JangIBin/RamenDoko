import React from 'react'
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';

import { GoogleMap, useLoadScript, Marker, InfoWindow, Circle, MarkerClusterer } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import "@reach/combobox/styles.css";
import "../assets/css/Map.css";

function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCOVIadCWc7aJkhQakeh_A38FRwwsxByvo",
    libraries : ["places"],
  });

  if(!isLoaded) return <div>...Loading</div>;
  return <Map />;
}

// Map
const containerStyle = {
  width: '100%',
  height: '100vh'
};

function Map() {
  const [shop, setShop] = useState();
  const [selected, setSelected] = useState(null);
  const [ mapRange, setMapRange ] = useState(2);

  // ホットペッパー　api
  const KEY = '6fca1552a5354f20';

  const center = useMemo(() => ({lat:35.669220, lng:139.761457}), []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  })

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(14);
  }, []);

  useEffect(() =>{

    const hotpepper = axios.create ({
      baseURL: '/hotpepper/gourmet/v1'
    })

    const fetchSearchData = async(mapRange) =>{
      //大エリアコード=Z011(東京)のお店を検索
        return await hotpepper.get('',{
            params: {
                key:KEY,
                // large_area:'Z011',
                keyword: 'ラーメン',
                count: 100,
                lat: 35.669220,
                lng: 139.761457,
                range: mapRange,
                format: 'json'
            }
        })
    }

    fetchSearchData(mapRange).then((res) => {
        setShop(res.data.results.shop);
        console.log(res.data.results.shop)
    })

    // fetchDirections();
  },[mapRange])

  return (
    <div>

      <Search panTo={panTo} />
      <Locate panTo={panTo} />
      <button 
        onClick={() => {
          if(mapRange !== 1) {
            setMapRange(1);
          }
          console.log(mapRange);
      }}>300m</button>
      <button onClick={() => {
          if(mapRange !== 2) {
            setMapRange(2);
          }
          console.log(mapRange);
      }}>500m</button>
      <button onClick={() => {
          if(mapRange !== 3) {
            setMapRange(3);
          }
          console.log(mapRange);
      }}>1000m</button>
      <button onClick={() => {
          if(mapRange !== 4) {
            setMapRange(4);
          }
          console.log(mapRange);
      }}>2000m</button>
      <button onClick={() => {
          if(mapRange !== 5) {
            setMapRange(5);
          }
          console.log(mapRange);
      }}>3000m</button>

      {/* <SearchEx shop={shop} /> */}

      <GoogleMap
        zoom={14}
        center={center}
        mapContainerStyle={containerStyle}
        onClick={(event) => {
          console.log(event);
        }}
        onLoad={onMapLoad}
      >

        <MarkerClusterer>
          {(clusterer) => 
             shop &&
              shop.map((item, index) => (
                <Marker
                  key={index} 
                  position={{lat:item.lat, lng:item.lng}} 
                  onClick={() => {
                      setSelected(item);
                      console.log(item);
                      // console.log(directions);
                  }}
                  clusterer={clusterer}
                />
              ))
          }

        </MarkerClusterer>

        <Marker 
          position={center}
          icon={{
            url: require('../assets/image/user.png'),
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
          }}
        />

        <Circle center={center} radius={1000} />

        {selected ? (
          <InfoWindow 
              position={{lat: selected.lat, lng: selected.lng}}
              onCloseClick={() => {
                  setSelected(null);
              }}
          >
          <div>
              <h2>{selected.name}</h2>
              <img src={selected.photo.mobile.l} alt="img" />
              <p>address : {selected.address}</p>
              <p>open : {selected.open}</p>
          </div>
          </InfoWindow>) : null
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
      location: { lat: () => 0, lng: () => 0 },
      // radius: 200 * 1000,
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
            {status === "OK" && 
              data.map(({id, description}) => (
                <ComboboxOption key={id} value={description} />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
    
  );  
}



export default Home;