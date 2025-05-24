import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import RowItem from "@/components/RowItem";

const details = () => {
  const navigation = useNavigation();
  const { dayLoading, dayForecast, dayCurrent, dayError, city } = useSelector(
    (state: any) => state.weather
  );
  const [weatherJSON = {}] = dayForecast || [];
  const { astro, date, hour } = weatherJSON;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
        <Ionicons
          name="arrow-back"
          size={42}
          style={styles.back}
          onPress={() => navigation.navigate("index" as never)}
        />
        <Text style={styles.cityName}>Details</Text>
      </View>
      {dayLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {astro && (
        <View style={styles.cityContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.cityName}>{city}</Text>
            <Image
              source={{ uri: `https:${dayCurrent.condition.icon}` }}
              width={50}
              height={50}
              style={{ alignSelf: "flex-end" }}
            />
          </View>
          <RowItem leftText="Condition" rightText={dayCurrent.condition.text} />
          <RowItem
            leftText={"Temperature: °C/°F"}
            rightText={`${dayCurrent.temp_c}/${dayCurrent.temp_f}`}
          />
          <RowItem leftText={"Sun rise:"} rightText={astro.sunrise} />
          <RowItem leftText={"Sun set:"} rightText={astro.sunset} />
          <RowItem leftText={"Moon rise:"} rightText={astro.moonrise} />
          <RowItem leftText={"Moon set:"} rightText={astro.moonset} />
        </View>
      )}
      <FlatList
        data={hour}
        renderItem={({ item }) => {
          return (
            <View style={styles.forecastItem}>
              <View style={styles.risesetView}>
                <Text style={styles.date}>{item.time}</Text>
                <Image
                  source={{ uri: `https:${item.condition.icon}` }}
                  width={50}
                  height={50}
                />
              </View>
              <RowItem leftText={"Humidity:"} rightText={item.humidity} />
              <RowItem
                leftText={"Temperature: °C/°F"}
                rightText={`${item.temp_c}/${item.temp_f}`}
              />
              <RowItem leftText={"Humidity:"} rightText={item.humidity} />
              <RowItem
                leftText={"Condition:"}
                rightText={item.condition.text}
              />
              <RowItem
                leftText={"Chance of rain:"}
                rightText={`${item.chance_of_rain} %`}
              />
              <RowItem
                leftText={"Chance of snow:"}
                rightText={`${item.chance_of_snow} %`}
              />
              <RowItem leftText={"Cloud:"} rightText={item.cloud} />
              <RowItem
                leftText={"Dew point: °C/°F"}
                rightText={`${item.dewpoint_c}/${item.dewpoint_f}`}
              />
              <RowItem
                leftText={"Heat index: °C/°F"}
                rightText={`${item.heatindex_c}/${item.heatindex_f}`}
              />
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <Text style={styles.forecastTitle}>Hourly Temperature</Text>
        )}
        stickyHeaderHiddenOnScroll={true}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  risesetView: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: 'center'
  },
  back: {},
  cityContainer: {
    backgroundColor: Theme.colors.skeletonbg,
    padding: 10,
    borderRadius: 10,
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  weatherContainer: {
    marginTop: 16,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    width: '50%'
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
    marginTop: 10,
    backgroundColor: Theme.colors.starBorder,
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

export default details;
