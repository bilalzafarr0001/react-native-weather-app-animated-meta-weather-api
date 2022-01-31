import React, {useState, createContext, useEffect} from 'react';

export const WeatherContext = createContext(null);

export const WeatherProvider = ({children}) => {
  const [weather, setWeather] = useState([]);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        setWeather,
      }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherProvider;
