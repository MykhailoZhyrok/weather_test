import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface WeatherResponse {
  latitude: number | null;
  longitude: number | null;
  generationtime_ms: number | null;
  utc_offset_seconds: number | null;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number | null;
  daily_units: {
    time: string;
    temperature_2m_max: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: (number | null)[];
  };
}

interface WeatherState {
  weather: WeatherResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  weather: null,
  loading: false,
  error: null,
};

export const fetchWeather = createAsyncThunk<WeatherResponse, { latitude: number; longitude: number }>(
  'weather/fetchWeather',
  async ({ latitude, longitude }) => {
    const response = await axios.get<WeatherResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max`
    );
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherResponse>) => {
        state.loading = false;
        state.weather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch weather';
      });
  },
});

export default weatherSlice.reducer;
