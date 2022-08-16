import React from "react";
import { useLocation } from 'react-router-dom';

import { FaMapMarkerAlt, FaGlobe, FaWifi, FaRegCreditCard } from "react-icons/fa";

import '../assets/css/Detail.css';

const Detail = () => {
    const location = useLocation();
    const data = location.state.data;
    console.log(data);

    return (
        <div className='Detail'>
            <div className='header'>
                <img src={require('../assets/image/ramen.png')} alt="img" />
                <div>{data.name}</div>
            </div>
            <div className='main_image'>
                <img src={data.photo.pc.l} alt="img" />
            </div>
            <div className='nav'>
                <div className='data_wrap'>
                    <FaMapMarkerAlt className='address_icon' />
                    <div className='address_text'>{data.address}</div>
                </div>
                <div className='data_wrap'>
                    <img src={require('../assets/image/time.png')} className='time_icon' alt="img" />
                    <div className='open_text'>{data.open}</div>
                </div>
                <div className='data_wrap'>
                    <FaGlobe className='urls_icon' />
                    <div className='urls_text'><a href={data.urls.pc}>{data.urls.pc}</a></div>
                </div>
            </div>
            <div className='subInfo'>
                <div className='subInfo_title'>詳細情報</div>
                <div className='subInfo_wrap'>
                    <div className='subInfo_data_wrap'>
                        <div>{data.wifi === 'あり' ? <FaWifi className='wifi_icon' /> : <img src={require('../assets/image/wifi_off.png')} className='subInfo_img' alt="img" />}</div>
                        <div>Wifi</div>
                    </div>
                    <div className='subInfo_data_wrap'>
                        <div>{data.card === '利用可' ? <FaRegCreditCard className='card_icon' /> : <img src={require('../assets/image/card.png')} className='subInfo_img' alt="img" /> }</div>
                        <div>Card</div>
                    </div>
                    <div className='subInfo_data_wrap'>
                        <div>{data.parking.includes('あり') === true ? <img src={require('../assets/image/parking.png')} className='subInfo_img' alt="img" /> : <img src={require('../assets/image/no-parking.png')} className='subInfo_img' alt="img" />}</div>
                        <div></div>
                        <div>Park</div>
                    </div>
                    <div className='subInfo_data_wrap'>
                        <div>{data.pet === '不可' ? <img src={require('../assets/image/no-pet.png')} className='subInfo_img' alt="img" /> : <img src={require('../assets/image/pet.png')} className='subInfo_img' alt="img" />}</div>
                        <div>Pet</div>
                    </div>
                </div>
                <div className='subInfo_footer'>
                    <div className='subInfo_title'>近隣の駅</div>
                    <div className='subInfo_access'>{data.access}</div>
                </div>
            </div>
        </div>
    )
}

export default Detail;