import React from 'react'
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import Carousel from "re-carousel";

import { GoogleMap, useLoadScript, Marker, InfoWindow, Circle, MarkerClusterer } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import { FaAngleUp, FaAngleDown, FaTag, FaCompass } from "react-icons/fa";

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
  height: '100vh',
};

function Map() {
  const [shop, setShop] = useState();
  const [selected, setSelected] = useState(null);
  const [mapRange, setMapRange] = useState(2);
  const [latLocate, setLatLocate] = useState();
  const [lngLocate, setLngLocate] = useState();

  // ホットペッパー　api
  const KEY = '6fca1552a5354f20';

  // 현재 위치 불러오는 값
  // const center = useMemo(() => ({lat:latLocate, lng:lngLocate}), [latLocate, lngLocate]);

  const center = useMemo(() => ({lat:35.669220, lng:139.761457}), []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  })

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
  }, []);

  useEffect(() =>{

    navigator.geolocation.getCurrentPosition((position) => {
      setLatLocate(position.coords.latitude);
      setLngLocate(position.coords.longitude);

      console.log(position)
    });

    const hotpepper = axios.create ({
      baseURL: '/hotpepper/gourmet/v1'
    })

    const fetchSearchData = async(mapRange) =>{
      //大エリアコード=Z011(東京)のお店を検索
        return await hotpepper.get('',{
            params: {
                key:KEY,
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


  },[latLocate, lngLocate, mapRange])

  return (
    <div className='Map'>

      {/* <Search panTo={panTo} /> */}

      <div className="container">
        <input id="dropdown" type="checkbox" />
        <label className="dropdownLabel" htmlFor="dropdown">
          <FaTag className='cartIcon' />
          <div>検索半径</div>
          <FaAngleDown className="caretIcon" />
        </label>
        <div className="content">
          <ul>
            <li>
              <button 
                  onClick={() => {
                    if(mapRange !== 1) {
                      setMapRange(1);
                    }
                    console.log(mapRange);
                  }}>300m</button>
            </li>
            <li>
              <button onClick={() => {
                    if(mapRange !== 2) {
                      setMapRange(2);
                    }
                    console.log(mapRange);
                }}>500m</button>
            </li>
            <li>
              <button onClick={() => {
                    if(mapRange !== 3) {
                      setMapRange(3);
                    }
                    console.log(mapRange);
                }}>1000m</button>
            </li>
            <li>
              <button onClick={() => {
                    if(mapRange !== 4) {
                      setMapRange(4);
                    }
                    console.log(mapRange);
                }}>2000m</button>
            </li>
            <li>
              <button onClick={() => {
                    if(mapRange !== 5) {
                      setMapRange(5);
                    }
                    console.log(mapRange);
                }}>3000m</button>
            </li>
          </ul>
        </div>
      </div>
      
      <Locate panTo={panTo} className='locate' />

      <GoogleMap
        zoom={16}
        center={center}
        mapContainerStyle={containerStyle}
        onClick={(event) => {
          console.log(event);
          setSelected(null);
        }}
        onLoad={onMapLoad}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: false,
          streetViewControl: false,
        }}  
      >

        <MarkerClusterer>
          {(clusterer) => 
             shop &&
              shop.map((item, index) => (
                <Marker
                  key={index} 
                  position={{lat:item.lat, lng:item.lng}} 
                  icon={{
                    url: require('../assets/image/ramen.png'),
                    scaledSize: new window.google.maps.Size(35, 35),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                  }}
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

        {selected ? (
          <InfoWindow 
              position={{lat: selected.lat, lng: selected.lng}}
              onCloseClick={() => {
                  setSelected(null);
              }}
          >
          <div className='window_wrap'>
            <div className='window_title'>
              <div>{selected.name}</div>
            </div>
            <div className='window_middle'>
              <img src={selected.photo.mobile.s} alt="img" />
              <div>
                <b>住所</b>
                <p>{selected.address}</p>
              </div>
            </div>
            <div>
              <b>営業時間</b>
              <p>{selected.open}</p>
            </div>
            <div>
              <b>近隣の駅</b>
              <p>{selected.access}</p>
            </div>
          </div>
          </InfoWindow>) : null
        }

      </GoogleMap>

      <div className='simplePage'>
        <input type="checkbox" id="toggleBtn" />
        <label htmlFor='toggleBtn' className='toggleBtn'>
          <FaAngleUp className='simple_icon' />
        </label>
        <div className='simple_content'>
          <Carousel auto={false} axis="x" fool={true}>
            {
              shop && shop.map((item, index) => (
                <div className='item_wrap' key={index}>
                  <div className='item_title'>{item.name}</div>
                  <div className='item_contents'>
                    <img src={item.photo.mobile.l} style={{width: 125, height: 125}} />
                    <div className='item_text'>
                      <div className='item_text_title'>住所</div>
                      <div className='item_text_address'>{item.address}</div>
                      <div className='item_text_title'>営業時間</div>
                      <div className='item_text_address'>{item.open}</div>
                    </div>
                  </div>
                  <div className='item_access'>
                    <div className='item_access_title'>近隣の駅</div>
                    <div className='item_access_text'>{item.access}</div>
                  </div>
                </div>
              ))
            }
          </Carousel>
        </div>  
      </div>

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
          console.log(panTo)
          console.log(position)
        }, 
        () => null, 
      );
    }}>
      <FaCompass className='locateIcon' />
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