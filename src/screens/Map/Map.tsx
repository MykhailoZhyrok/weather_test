import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import { fetchCity } from '../../CitySlice/CitySlice';
import { useAppDispatch } from '../../store/store';
import { fetchWeather } from '../../WeatherSlice/WeatherSlice';
import Routes from '../../Routes';
import { useRegion } from '../../MyContext';

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export default function Map():React.JSX.Element {

    const { region, setCityCoord, cityCoord} = useRegion();
    
    const [cityName, setCityName] = useState('');

    const { weather, error } = useSelector((state: RootState) => state.weather);
    const { data } = useSelector((state: RootState) => state.city);

    const dispatch = useAppDispatch();

    const navigation = useNavigation()

    const handleMarkerPress = () => {
        navigation.navigate(Routes.search)
    }
    const handlePress = async (event: any) => {

        console.log('click')
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setCityCoord({ latitude, longitude });
        console.log(cityCoord)
        await dispatch(fetchCity({latitude, longitude}));
        await dispatch(fetchWeather({latitude, longitude}));
        console.log(data)
    };
   
    return (
        <SafeAreaView style={styles.container}>

            <MapView
                style={styles.map}
                region={region}
                onPress={(e) => {
                    console.log('Натиснуто на карту');
                    handlePress(e);
                }}>

                {data && cityCoord.latitude && cityCoord.longitude &&
                    <Marker
                        coordinate={{ latitude: cityCoord.latitude, longitude: cityCoord.longitude }}
                        title={data.city}
                        description={weather?`${weather.daily.temperature_2m_max[0]}`:''}
                        image={require('./icon/pointer.png')}
                    >
                    </Marker>}
            </MapView>

            {data&&<View>
                <TouchableOpacity style={styles.modalCont} onPress={handleMarkerPress}>
                    <Text style={styles.modalText}>{data.city}</Text>
                    {weather&&<Text style={styles.modalText}>{weather.daily.temperature_2m_max[0]}</Text>}
                </TouchableOpacity>
            </View>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    modalCont: {
        zIndex: 100,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 100,
        borderWidth: 1

    },
    modalText: {
        fontSize: 18
    }
});
