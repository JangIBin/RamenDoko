import React from 'react'
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
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
            large_area:'Z011',
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

  const center = useMemo(() => ({lat:35.652832, lng:139.839478}), []);

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

      <Search />

      <GoogleMap
        zoom={10}
        center={center}
        mapContainerStyle={containerStyle}
        onClick={(event) => {
          console.log(event);
        }}
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

function Search() {
  const {
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggetions
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 35.652832, lng: () => 139.839478 },
      radius: 200 * 1000,
    },
  });

  return (
    <div className='search'>
      <Combobox onSelect={(address) => {
        console.log(address);
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
          {status == "OK" && 
            data.map(({id, description}) => (
              <ComboboxOption key={id} value={description} />
          ))}
        </ComboboxPopover>
      </Combobox>
    </div>
    
  );
    
}

export default Home;