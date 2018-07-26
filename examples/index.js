/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import Slider from '../src/components/Slider';

const rootEl = document.getElementById('app');

ReactDOM.render(
    <Slider 
        dynamic={false}
        onChange={(state) => {
            console.log(state);
        }}
        onChangeComplete={(state)=>{
            console.log(state);
        }}
    />,
    rootEl
);
