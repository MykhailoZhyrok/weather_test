import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/store';
import { fetchWeather } from '../../WeatherSlice/WeatherSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../MyContext';
import { fetchCity } from '../../CitySlice/CitySlice';

interface City {
  name: string;
  country: string; 
  lat: number;
  lng: number;
}

export default function Search() {
  const { setRegion, region, setCityCoord } = useRegion();
  const dispatch = useAppDispatch();
  const [city, setCity] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [cityTitle, setCityTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { weather, error } = useSelector((state: RootState) => state.weather);
  const { data } = useSelector((state: RootState) => state.city);

  useEffect(() => {
    if (city) {
      fetchCities(city);
      
    } else {
      setSuggestions([]);
    }
  }, [city]);

  const fetchCities = async (input: string) => {
    setLoading(true);
    const apiKey = 'APY'; 
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${apiKey}`);
      const data = await response.json();
      const placeIds = data.predictions.map((prediction: any) => prediction.place_id);
      const coordinates = await Promise.all(placeIds.map(fetchCoordinates(apiKey)));
      setSuggestions(coordinates);
      console.log(suggestions)
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinates = (apiKey: string) => async (placeId: string) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`);
    const data = await response.json();
    const location = data.result.geometry.location;
    const addressComponents = data.result.address_components;

    const country = addressComponents.find((component: any) => component.types.includes('country'))?.long_name || '';
   



    return {
      name: data.result.name,
      country: country, 
      lat: location.lat,
      lng: location.lng,
    };
  };

  const getWeather = async (item: City) => {
    setCityTitle(`${item.name}, ${item.country}`); 
    const { lat, lng } = item;
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
  })
  setCityCoord({
    latitude: lat,
    longitude: lng,
  })

  await dispatch(fetchCity({latitude:lat, longitude:lng}));
  console.log(region)
    dispatch(fetchWeather({ latitude: lat, longitude: lng }));
    setCity('');
    setSuggestions([]);
  };

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }; 
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View>
      <View style={styles.inputCont}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder={data?`${data?.city}, ${data?.country}`:"Введіть місто"||cityTitle ? cityTitle : "Введіть місто"}
          
        />
        <TouchableOpacity 
          style={styles.buttonGlasss} 
          onPress={() => suggestions.length > 0 && getWeather(suggestions[0])}
          disabled={loading}
        >
          <FontAwesomeIcon size={30} icon={faMagnifyingGlass} />
        </TouchableOpacity>
      </View>
      <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
        style={styles.suggestionContainer}
          data={suggestions}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => getWeather(item)}>
              <Text  style={styles.suggestion}>{`${item.name}, ${item.country}`}</Text> 
            </TouchableOpacity>
          )}
        />
      )}
    </View>
      <View>
        {weather && weather.daily.time.map((item, index) => (
          <View style={styles.weatherItem} key={index}>
            <Text style={styles.weatherTitle}>{formattedDate(item)}</Text>
            <Text style={styles.weatherTemp}>{weather.daily.temperature_2m_max[index]}</Text>
          </View>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    flex: 1,
    fontSize: 25,
    height: 60,
  },
  buttonGlasss: {
    paddingVertical: 10,
    width: 100,
    height: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: 'rgba(93, 89, 230, 0.38)',
  },
  inputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 20
  },
  cityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  weatherTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
  },
  weatherTemp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
  },
  weatherItem: {
    backgroundColor: 'rgba(93, 89, 230, 0.38)',
    padding: 10,
    margin: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  suggestionContainer: {
    position: 'absolute', 
    zIndex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 10,
    elevation: 5, 
    width: '100%'
  },
});
