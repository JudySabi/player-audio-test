import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import soundList from "./assets/data.json";
export default function App() {
  const [data, setData] = useState([]);
  const [currentSoundData, setCurrentSoundData] = useState(null);
  const [sound, setSound] = useState(null);
  const [playingStatus, setPlayingStatus] = useState("nosound");
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numberSong, setNumberSong] = useState(1);
  useEffect(() => {
    const getData = () => {
      // on charge le tableau de musique json
      setData(soundList);
      setIsLoading(false);
      // setCurrentSoundData(data[0]);
    };
    getData();
  }, []);
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: currentSoundData.url,
        },
        {
          isLooping: false,
        },
        updateScreenForSoundStatus
      );
      setSound(sound);
    };
    currentSoundData && loadSound();
  }, [currentSoundData]);
  const togglePrevious = () => {};
  const togglePlay = () => {
    setPaused(!paused);
    playAndPause();
  };
  const toggleNext = () => {};
  const playAndPause = () => {
    if (playingStatus === "nosound") {
      playRecording();
    }
    if (playingStatus === "donepause" || playingStatus === "playing") {
      pauseAndPlayRecording();
    }
  };
  const playRecording = async () => {
    await sound.playAsync();
    setPlayingStatus("playing");
  };
  const pauseAndPlayRecording = async () => {
    if (sound) {
      console.log("sound exsiste");
      if (playingStatus === "playing") {
        console.log("le status est playing");
        await sound.pauseAsync();
        setPlayingStatus("donepause");
      } else {
        console.log("le status n'est pas playing");
        await sound.playAsync();
        setPlayingStatus("playing");
      }
    }
  };
}
const updateScreenForSoundStatus = (status) => {
//   console.log(status);
  if (status.isPlaying && playingStatus !== "playing") {
    setPlayingStatus("playing");
  } else if (!status.isPlaying && playingStatus === "playing") {
    setPlayingStatus("donepause");
  }
  if (status.didJustFinish) {
    setPlayingStatus("donepause");
  }
};
return isLoading ? (
  <Text>En cours de chargement</Text>
) : (
  <View style={styles.container}>
    {/* Playlist */}
    <Text>La Playlist</Text>
    <View style={styles.player}>
      {currentSoundData && (
        <View>
          <Text>{currentSoundData.title}</Text>
        </View>
      )}
      {/*  <TouchableOpacity style={styles.button} onPress={togglePrevious}>
               <AntDesign name="stepbackward" size={24} color="black" />
            </TouchableOpacity>
            */}
      <TouchableOpacity onPress={togglePlay}>
        {playingStatus === "donepause" ? (
          <FontAwesome name="play" size={40} />
        ) : (
          <FontAwesome name="pause" size={40} />
        )}
      </TouchableOpacity>
      {/*<TouchableOpacity style={styles.button} onPress={toggleNext}>
               <AntDesign name="stepforward" size={24} color="black" />
            </TouchableOpacity>
               */}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  player: {
    height: 200,
    width: 250,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 20,
  },
  playerButton: {
    marginRight: 10,
  },
  soundButton: {
    height: 45,
    width: 250,
    backgroundColor: "grey",
    marginTop: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
