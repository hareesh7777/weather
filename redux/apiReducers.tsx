import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import axios from "axios";
import dayjs from "dayjs";

export const weatherURL = "https://api.weatherapi.com/v1/";
export const apiKey = "a262b2f4de214062b5e154800251903";

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrent",
  async (
    { days = 3, cityName }: { days?: number; cityName?: string },
    { rejectWithValue }
  ) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      const response = await axios.get(
        `${weatherURL}forecast.json?q=${
          cityName ? cityName : `${latitude},${longitude}`
        }&days=${days}&alerts=Enable&aqi=Enable&key=${apiKey}`
      );

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch weather data:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDayWeather = createAsyncThunk(
  "weather/fetchDay",
  async (
    {
      days = 3,
      cityName,
      date,
    }: { days?: number; cityName?: string; date: Date },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${weatherURL}forecast.json?q=${cityName}&days=${days}&dt=${date}&alerts=Enable&aqi=Enable&key=${apiKey}`
      );

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch weather data:", error);
      return rejectWithValue(error.message);
    }
  }
);
