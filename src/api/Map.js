import { useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

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
  });

  if(!isLoaded) return <div>...Loading</div>;
  return <Map />;
}

function Map() {
  const [shop, setShop] = useState();

  const center = useMemo(() => ({lat:35.652832, lng:139.839478}), []);

  useEffect(() =>{
    fetchSearchData().then((res) => {
        setShop(res.data.results.shop);
        console.log(res.data.results.shop)
        // console.log(res.data.results.shop)
    })
  },[])

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={containerStyle}
    >
      {/* {
        shop.map((index) => (
          <Marker key={index} position={{lat:shop.lat, lng:shop.lng}} />
        ))
      } */}
      <Marker position={center} />
    </GoogleMap>
  )
  
}

export default Home;