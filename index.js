/**
 * @format
 */
/* eslint-disable prettier/prettier */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {WeatherProvider} from './src/context/WeatherContext';

const ReduxApp = () => (
  <WeatherProvider>
    <App />
  </WeatherProvider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
