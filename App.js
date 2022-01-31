import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
var {width, height} = Dimensions.get('window');

import {getWeather, getImageBackgroundSrc} from './src/helpers/weatherHelper';
import SearchInput from './src/components/SearchInput';
import {WeatherContext} from './src/context/WeatherContext';
import LottieView from 'lottie-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
    fontWeight: 'bold',
  },
  textStyle1: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: '#222',
    fontWeight: 'bold',
  },
  textStyle2: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 20,
    letterSpacing: 0.6,
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: '#666',
    color: 'white',
    height: 40,
    width: 300,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },

  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '',
    paddingHorizontal: 25,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: 'dimgray',
    width: width,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  item: {
    padding: 8,
    backgroundColor: '#00C853',
    width: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});
class App extends React.Component {
  static contextType = WeatherContext;

  constructor(props) {
    super(props);

    this.state = {
      location: '',
      weathers: '',
      temperature: '',
      imageBackground: '',
      humidity: '',
      visibility: '',
      predictability: '',
      air_pressure: '',
      predict: [{}],
      loading: true,
      error: false,
      ifExists: false,
    };
  }

  async componentDidMount() {
    await this.firstCall(`Lahore`);
  }

  firstCall = async text => {
    this.state.loading = true;
    let data = await getWeather(text);
    if (data) {
      this.setState({
        location: text,
        weather: data.weatherStateName,
        temperature: Number(data.temperature.toFixed(1)),
        imageBackground: getImageBackgroundSrc(data.weatherStateAbbr),
        humidity: data.humidity,
        visibility: Number(data.visibility.toFixed(1)),
        predictability: data.predictability,
        air_pressure: data.air_pressure,

        error: false,
        loading: false,
        predict: data.predict.filter(function (v, i) {
          return i != 0;
        }),
      });
      const {weather, setWeather} = this.context;
      Object.assign(this.state.predict[0], {name: this.state.location});
      weather.push(this.state.predict);
      setWeather(weather);
      console.log(
        'weather data array length is in mount function ',
        weather.length,
      );
    }
  };

  onSubmit = async text => {
    const {weather, setWeather} = this.context;
    console.log('ON SUBMIT HANDLER WEATHER IS ');
    var isCheck = false;
    weather.map(value => {
      value.map(val => {
        if (val.name === text) {
          this.setState({
            ifExists: true,
            error: false,
            loading: false,
            location: text,
            weather: val.weatherStateName,
            temperature: Number(val.the_temp.toFixed(1)),
            imageBackground: getImageBackgroundSrc(val.weather_state_abbr),
            humidity: val.humidity,
            visibility: Number(val.visibility.toFixed(1)),
            predictability: val.predictability,
            air_pressure: val.air_pressure,
            predict: value.filter(function (v, i) {
              return i != 0;
            }),
          });
          isCheck = true;
          console.log('*********  CITY EXISTS  IN CONTEXT API  **********');
          console.log('WEATHER ARRAY LENGTH IS :', weather.length);

          return;
        }
      });
    });
    if (isCheck) return;

    console.log(
      '*********** CITY NOT EXISTS IN CONTEXT API  ************************',
      text,
    );
    this.state.loading = true;
    let data = await getWeather(text);
    if (data) {
      this.setState({
        ifExists: false,
        location: text,
        weather: data.weatherStateName,
        temperature: Number(data.temperature.toFixed(1)),
        imageBackground: getImageBackgroundSrc(data.weatherStateAbbr),
        humidity: data.humidity,
        visibility: Number(data.visibility.toFixed(1)),
        predictability: data.predictability,
        air_pressure: data.air_pressure,
        predict: data.predict.filter(function (v, i) {
          return i != 0;
        }),

        error: false,
        loading: false,
      });

      Object.assign(this.state.predict[0], {name: this.state.location});
      weather.push(this.state.predict);
      setWeather(weather);
      console.log('weather data array length is ', weather.length);
    } else {
      this.setState({
        ifExists: false,
        error: true,
        loading: false,
        location: text,
        weathers: `Could not load weather`,
        temperature: `0`,
        humidity: '',
        visibility: '',
        predictability: '',
        air_pressure: '',
        predict: [],
        applicable_data: '',
        imageBackground: getImageBackgroundSrc('c'),
      });
    }
  };

  render() {
    let {
      location,
      weathers,
      temperature,
      humidity,
      imageBackground,
      visibility,
      loading,
      predictability,
      air_pressure,
      predict,
    } = this.state;

    if (!imageBackground) {
      imageBackground = getImageBackgroundSrc('c');
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        {loading ? (
          //<ActivityIndicator color="black" size="large" />
          <LottieView source={require('./assets/loader.json')} autoPlay loop />
        ) : (
          <>
            <ImageBackground
              source={imageBackground}
              style={{backgroundColor: '#222'}}>
              <View style={styles.detailsContainer}>
                <Text style={[styles.largeText, styles.textStyle]}>
                  {location}
                </Text>
                <Text style={[styles.smallText, styles.textStyle]}>
                  {weathers ? weathers : ''}
                </Text>

                <Text style={[styles.largeText, styles.textStyle]}>
                  {temperature}°
                </Text>

                <Text style={[styles.smallText, styles.textStyle]}>
                  Humidity : {humidity}%
                </Text>

                <SearchInput
                  searchPlaceHoder={'Search any city'}
                  onSubmit={this.onSubmit}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                  }}>
                  <Text style={[styles.smallText, styles.textStyle2]}>
                    Visibility
                  </Text>
                  <Text style={[styles.smallText, styles.textStyle2]}>
                    Predictability
                  </Text>
                  <Text style={[styles.smallText, styles.textStyle2]}>
                    Air Pressure
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#222',
                      width: 100,
                      height: 70,
                      borderRadius: 20,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        paddingVertical: 17,
                        fontSize: 20,
                      }}>
                      {visibility}km
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#222',
                      width: 100,
                      height: 70,
                      borderRadius: 20,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        paddingVertical: 17,
                        fontSize: 20,
                      }}>
                      {predictability}%
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#222',
                      width: 100,
                      height: 70,
                      borderRadius: 20,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        paddingVertical: 19,
                        fontSize: 20,
                      }}>
                      {air_pressure} at
                    </Text>
                  </View>
                </View>
                <View>
                  <FlatList
                    data={predict}
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          flex: 0.5,
                          height: 200,
                          width: 150,
                          backgroundColor: '#fff',
                          margin: 10,
                          marginTop: 50,
                          marginLeft: 15,
                        }}>
                        <ImageBackground
                          source={getImageBackgroundSrc(
                            item.weather_state_abbr,
                          )}
                          style={{
                            height: 200,
                            marginBottom: 30,
                          }}
                          resizeMode="cover">
                          <View
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#222',
                                marginTop: 22,
                                fontWeight: 'bold',
                                fontSize: 30,
                              }}>
                              {item.the_temp.toFixed(1)}°
                            </Text>
                            <Text
                              style={{
                                color: '#222',
                                marginTop: 10,
                                fontWeight: 'bold',
                                fontSize: 17,
                                fontStyle: 'italic',
                              }}>
                              {item.weather_state_name}
                            </Text>
                            <View
                              style={{
                                paddingHorizontal: 8,
                                paddingTop: 30,
                                backgroundColor: '#fff',
                                borderRadius: 24,
                                height: 150,
                                marginTop: 10,
                              }}>
                              <Text
                                style={{
                                  color: '#222',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                }}>
                                Humidity {item.humidity} %
                              </Text>
                              <Text
                                style={{
                                  color: '#222',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                }}>
                                Visibility {item.visibility.toFixed(1)} km
                              </Text>
                              <Text
                                style={{
                                  color: '#222',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                }}>
                                Predictability {item.predictability}
                              </Text>
                              <Text
                                style={{
                                  color: '#222',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                }}>
                                Wind Direction {item.wind_direction_compass}
                              </Text>
                            </View>
                          </View>
                        </ImageBackground>
                      </View>
                    )}
                  />
                </View>
              </View>
            </ImageBackground>
          </>
        )}
      </KeyboardAvoidingView>
    );
  }
}

export default App;
