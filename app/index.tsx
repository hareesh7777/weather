import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  Text,
  Button,
  ActivityIndicator,
  View,
  FlatList,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Theme from "@/utils/theme";
import { TextInput } from "react-native-paper";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import {
  apiKey,
  fetchCurrentWeather,
  fetchDayWeather,
  weatherURL,
} from "@/redux/apiReducers";
import { SET_CITY } from "@/redux/weatherSlice";
import { Link, useNavigation } from "expo-router";

const HomeScreen = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const { data, city, forecast, loading, error } = useSelector(
    (state: any) => state.weather
  );
  const [enteredCity, setEnteredCity] = useState("");
  const [searchCityList, setsearchCityList] = useState([]);
  const [searchdays, setsearchDays] = useState(3);
  useEffect(() => {
    !data ? dispatch(fetchCurrentWeather({ days: 3 })) : null;
  }, []);

  const handleSearchCity = async (cityName: string) => {
    setEnteredCity(cityName);
    try {
      const response = await axios.get(
        `${weatherURL}search.json?q=${cityName}&key=${apiKey}`
      );
      setsearchCityList(response.data);
    } catch (error) {}
  };
  const handleCityPress = (city: string) => {
    setEnteredCity(city);
    dispatch(SET_CITY(city));
    dispatch(fetchCurrentWeather({ days: 3, cityName: city }));
    setsearchCityList([]);
  };

  const handleDayForecast = (date: any) => {
    dispatch(fetchDayWeather({ cityName: city, date: date }));
    navigation.navigate("details" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={enteredCity}
        onChangeText={handleSearchCity}
        mode="outlined"
        outlineStyle={{ borderColor: Theme.colors.bgGrey, borderRadius: 10 }}
        right={
          <TextInput.Icon
            onPress={() => Keyboard.dismiss()}
            icon={() => <Ionicons name="search" size={24} color="black" />}
          />
        }
      />
      {!searchCityList && <ActivityIndicator size="large" color="#0000ff" />}
      {/* {searchError && <Text style={styles.error}>{searchError}</Text>} */}
      {searchCityList.length > 0 && (
        <FlatList
          data={searchCityList}
          renderItem={({ item }: any) => {
            return (
              <View style={styles.searchItem}>
                <Text
                  style={styles.searchItemText}
                  onPress={() => handleCityPress(item.name)}
                >
                  {item.name}, {item.region}, {item.country}
                </Text>
              </View>
            );
          }}
        />
      )}

      {loading && !data && <ActivityIndicator size="large" color="#0000ff" />}
      {/* {error && <Text style={styles.error}>{error}</Text>} */}
      {data && (
        <View style={styles.cityContainer}>
          {/* <ImageBackground source={{uri: `https:${data.current.condition.icon}`}} resizeMode="contain"> */}
          <View style={styles.rowView}>
            <Text style={styles.cityName}>{city}</Text>
            <Image
              source={{ uri: `https:${data.current.condition.icon}` }}
              height={50}
              width={50}
            />
          </View>
          <View style={styles.rowView}>
            <Text style={styles.condition}>{data.current.condition.text}</Text>
            <Text style={styles.temperature}>{data.current.temp_c}°C</Text>
          </View>

          {/* </ImageBackground> */}
        </View>
      )}
      {forecast && (
        <View>
          <Text style={styles.forecastTitle}>{searchdays}-Days Forecast</Text>
          {loading && !forecast && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          <FlatList
            data={forecast}
            keyExtractor={(item) => item.date}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity
                  style={styles.forecastItem}
                  onPress={() => {
                    handleDayForecast(item.date);
                  }}
                >
                  <View style={styles.rowView}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Image
                      source={{ uri: `https:${item.day.condition.icon}` }}
                      height={50}
                      width={50}
                    />
                  </View>

                  <View style={styles.rowView}>
                    <Text style={styles.condition}>
                      {item.day.condition.text}
                    </Text>
                    <Text style={styles.temperature}>
                      {item.day.maxtemp_c}°C / {item.day.mintemp_c}°C
                    </Text>
                  </View>
                </TouchableOpacity>
                <View></View>
              </>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      )}
      {searchdays >= 3 && searchdays < 14 && (
        <TouchableOpacity
          onPress={() => {
            setsearchDays(searchdays + 1);
            dispatch(
              fetchCurrentWeather({
                days: searchdays + 1,
                cityName: city,
              })
            );
          }}
          style={{ position: "absolute", bottom: 20, right: 20 }}
        >
          <Ionicons name="add-circle" size={60} color="black" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cityContainer: {
    backgroundColor: Theme.colors.skeletonbg,
    padding: 10,
    borderRadius: 10,
    gap: 5,
  },
  weatherContainer: {
    marginTop: 16,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 20,
    textAlign: "right",
  },
  condition: {
    fontSize: 16,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  forecastItem: {
    marginTop: 8,
    backgroundColor: Theme.colors.white,
    padding: 10,
    borderRadius: 10,
    gap: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 16,
  },
  searchItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchItemText: {
    fontSize: 16,
  },
});

export default HomeScreen;
