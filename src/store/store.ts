import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../WeatherSlice/WeatherSlice'
import cityReduser from '../CitySlice/CitySlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    city: cityReduser
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;