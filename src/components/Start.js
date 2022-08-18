import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/css/Start.css';
import '../assets/css/reset.css';   

const Start = () => {
    return (
        <div className='Start'>
            <div className='Wrap'>
                <img src={require('../assets/image/ramen_noodle.png')} alt="img" />
                <div className='start_wrap'>
                    <Link to="/map">
                        <button>ラーメン食べに行こう！</button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default Start;