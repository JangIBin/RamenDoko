import React from 'react'
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Carousel from "react-elastic-carousel";

import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";

import { FaAngleUp, FaAngleDown, FaTag, FaCompass } from "react-icons/fa";

import "../assets/css/Map.css";
import "../assets/css/reset.css";

function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCOVIadCWc7aJkhQakeh_A38FRwwsxByvo",
  });

  if(!isLoaded) return (
    <div style={{
      textAlign:'center',
      lineHeight:50
    }}>
      <div>...Loading</div>
    </div>
    
  );
  return <Map />;
}

// Map
const containerStyle = {
  width: '100%',
  height: '100vh',
};

const windowStyle = {
  width: '80%',
  height: '100vh',
  marginLeft: '20%'
}

function Map() {
  const [shop, setShop] = useState();
  const [selected, setSelected] = useState(null);

  const [mapRange, setMapRange] = useState(2);
  const [latLocate, setLatLocate] = useState();
  const [lngLocate, setLngLocate] = useState();
  
  const [windowSize, setWindowSize] = useState({
    winWidth: window.innerWidth,
  })

  const detectSize = () => {
    setWindowSize({
      winWidth: window.innerWidth,
    })
  }

  // ホットペッパー　api
  const KEY = '6fca1552a5354f20';

  // 현재 위치 불러오는 값
  // const center = useMemo(() => ({lat:parseFloat(latLocate), lng:parseFloat(lngLocate)}), [latLocate, lngLocate]);

  const center = useMemo(() => ({lat:35.669220, lng:139.761457}), []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  })

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
  }, []);

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 800, itemsToShow: 2 },
    { width: 1200, itemsToShow: 3 },
    { width: 1400, itemsToShow: 4 }
  ];
  
  useEffect(() =>{

    navigator.geolocation.getCurrentPosition((position) => {
      setLatLocate(position.coords.latitude);
      setLngLocate(position.coords.longitude);

      console.log(position)
    });

    const hotpepper = axios.create ({
      baseURL: '/hotpepper/gourmet/v1'
    })

    const fetchSearchData = async(mapRange, latLocate, lngLocate) =>{
      //大エリアコード=Z011(東京)のお店を検索
        return await hotpepper.get('',{
            params: {
                key:KEY,
                keyword: 'ラーメン',
                count: 100,
                lat: 35.669220,
                lng: 139.761457,
                // lat: parseFloat(latLocate),
                // lng: parseFloat(lngLocate),
                range: mapRange,
                format: 'json'
            }
        })
    }
    fetchSearchData(mapRange).then((res) => {
        setShop(res.data.results.shop);
        console.log(res.data.results.shop)
    })

    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
    }


  },[latLocate, lngLocate, mapRange]);

  console.log(shop);

  return (
    <div className='Map'>

      <div className='sideBar'>
        <div className='sideBar_title'>
          <img src={require('../assets/image/ramen.png')} alt="img" />
          <div className='title_text'>RamenDoko</div>
        </div>

        <div className='subMenu'>
          <label htmlFor="touch"><span>検索半径</span></label>
          <input type="checkbox" id="touch" /> 
          <ul className='slide'>
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

        <div className='subInfoMenu'>
          <label htmlFor="touchInfo"><span>ラーメン屋見る</span></label>               
          <input type="checkbox" id="touchInfo" /> 
          <ul className='slide'>
            <Carousel breakPoints={breakPoints} pagination={false} showArrows={false} >
              { shop !== null ? (
                shop && shop.map((item, index) => (
                  <div className='subInfoMenu_item' key={index}>
                    <Link to="/detail" state={{data: item }}>
                      <div className='subInfoMenu_title'>{item.name}</div>
                    </Link>
                    <div className='subInfoMenu_contents'>
                      <img src={item.photo.mobile.l} style={{width: 125, height: 125}} alt="img" />
                      <div className='subInfoMenu_text'>
                        <div className='subInfoMenu_text_title'>住所</div>
                        <div className='subInfoMenu_text_address'>{item.address}</div>
                        <div className='subInfoMenu_text_title'>営業時間</div>
                        <div className='subInfoMenu_text_address'>{item.open}</div>
                      </div>
                    </div>
                    <div className='subInfoMenu_access'>
                      <div className='subInfoMenu_access_title'>近隣の駅</div>
                      <div className='subInfoMenu_access_text'>{item.access}</div>
                    </div>
                  </div>
                ))
                ) : <>データなし</> 
              }
            </Carousel>
          </ul>
        </div>
        
      </div>

      <div className="container">
        <input id="dropdown" type="checkbox" />
        <label className="dropdownLabel" htmlFor="dropdown">
          <FaTag className='cartIcon' />
          <div className='dropdownLabel_text'>検索半径</div>
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
        mapContainerStyle={
          windowSize.winWidth >= 800 ? windowStyle : containerStyle
        }
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

        <MarkerClusterer

        >
        
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
              <Link to="/detail" state={{data: selected}}>
                <div className='window_title'>
                  <div>{selected.name}</div>
                </div>
              </Link>
              <div className='window_middle'>
                <img src={selected.photo.mobile.s} alt="img" />
                <div>
                  <div className='middle_title'>住所</div>
                  <p>{selected.address}</p>
                </div>
              </div>
              <div className='window_footer'>
                <div className='footer_subTitle'>営業時間</div>
                <p>{selected.open}</p>
              </div>
              <div className='window_footer'>
                <div className='footer_subTitle'>近隣の駅</div>
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
          <Carousel breakPoints={breakPoints} pagination={false} showArrows={false} >
            { shop !== null ? (
              shop && shop.map((item, index) => (
                <div className='item_wrap' key={index}>
                  <Link to="/detail" state={{data: item}}>
                    <div className='item_title'>{item.name}</div>
                  </Link>
                  <div className='item_contents'>
                    <img src={item.photo.mobile.l} style={{width: 125, height: 125}} alt="img" />
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
              ) : <>データなし</>
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
          console.log(position)
        }, 
        () => null, 
      );
    }}>
      <FaCompass className='locateIcon' />
    </button>
  );
}



export default Home;