/* eslint-disable no-console */
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Slider from '../src/components/Slider';

const rootEl = document.getElementById('app');

ReactDOM.render(
    <AppContainer>
        <Slider />
    </AppContainer>,
    rootEl
);

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept();
}