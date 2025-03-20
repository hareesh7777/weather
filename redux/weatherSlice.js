import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentWeather, fetchDayWeather } from "./apiReducers";

const weatherSlice = createSlice({
  name: "Weather",
  initialState: {
    city: null,
    data: null,
    forecast: null,
    loading: false,
    error: null,
    dayForecast: null,
    dayCurrent: null,
    dayError: null,
    dayLoading: false,
  },
  reducers: {
    SET_CITY: (state, action) => {
      state.city = action.payload;
    },
    SET_DAY_FORECAST: (state, action) => {
      state.dayForecast = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentWeather.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentWeather.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.forecast = action.payload.forecast.forecastday;
      state.city = action.payload.location.name;
    });
    builder.addCase(fetchCurrentWeather.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error
        ? action.error.message
        : "An error occurred while fetching weather data.";
    });
    builder.addCase(fetchDayWeather.pending, (state)=>{
      state.dayLoading = true;
      state.dayError = null;
    });
    builder.addCase(fetchDayWeather.fulfilled, (state, action) =>{
      state.dayLoading = false;
      state.dayCurrent = action.payload.current;
      state.dayForecast = action.payload.forecast.forecastday;
      state.dayError = null;
    });
    builder.addCase(fetchDayWeather.rejected, (state, action) => {
      state.dayLoading = false;
      state.dayError = action.error
        ? action.error.message
        : "An error occurred while fetching day weather data.";
    });
  },
});

export default weatherSlice.reducer;
export const { SET_CITY, SET_DAY_FORECAST } = weatherSlice.actions;
