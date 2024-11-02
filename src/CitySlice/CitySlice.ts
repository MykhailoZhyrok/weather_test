import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface GeocodeResult {
    address_components: AddressComponent[];
}

interface GeocodeResponse {
    results: GeocodeResult[];
    status: string;
}

interface CityResponse {
    country: string;
    city: string;
}

interface CityState {
    data: CityResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: CityState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchCity = createAsyncThunk<CityResponse, { latitude: number; longitude: number }>(
    'city/fetchCity', 
    async ({ latitude, longitude }) => {
        const response = await axios.get<GeocodeResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=APY`
        );
        
        const { results } = response.data;
        return {
            country: results[0]?.address_components.find((component: AddressComponent) => component.types.includes('country'))?.long_name || '',
            city: results[0]?.address_components.find((component: AddressComponent) => component.types.includes('locality'))?.long_name || '',
        };
    }
);



const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCity.fulfilled, (state, action: PayloadAction<CityResponse>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch city data';
            });
    },
});

export default citySlice.reducer;
