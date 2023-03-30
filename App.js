import { API_KEY } from "@env";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const KEY = API_KEY;

    //console.log(KEY);
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    //console.log(latitude, longitude);
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    //console.log(location);
    setCity(location[0].city);

    // const response = await fetch(
    //   `api.openweathermap.org/data/2.5/forecast/daily?lat=44.34&lon=10.99&cnt=7&appid=${KEY}}`
    // );
    // const json = await response.json();
    // console.log(json);

    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${KEY}&units=metric`
    );
    const json = await response.json();
    //console.log(json.list[0].weather[0].description, json.list[0].main.temp);
    setDays(json.list);
  };

  useEffect(() => {
    getWeather();
  });

  //View는 container
  return (
    <View style={styles.container}>
      {!ok ? (
        <View style={styles.city}>
          <Text style={styles.cityName}>위치 찾을 수 없음</Text>
        </View>
      ) : (
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
      )}
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="black"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>
                {/* {day.main.temp} */}
                {parseFloat(day.main.temp).toFixed(1)}℃
              </Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={{ marginBottom: -70 }}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="black"></StatusBar>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// = const SCREEN_WIDTH = const Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "gold" },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 50,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 128,
  },
  description: {
    marginTop: 10,
    fontSize: 50,
  },
});
