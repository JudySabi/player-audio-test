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
import soundList from "./assets/data.json";
import { AntDesign } from "@expo/vector-icons";
export default function App() {
  const [data, setData] = useState([]);
  const [currentSoundData, setCurrentSoundData] = useState(0);
  const [sound, setSound] = useState(null);
  const [playingStatus, setPlayingStatus] = useState("nosound");
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numberSong, setNumberSong] = useState(0);

  useEffect(() => {
    // permet de récupérer la soundList (data.json) et le mettre dans le state data
    const getData = () => {
      setData(soundList);
      setCurrentSoundData(soundList[numberSong]); // nous récupérons le numberSong pour le rank (pouvoir utilisé une playlist et changer son  ordre)
      setPlayingStatus("donepause");
      setIsLoading(false);
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

  //  PLAYER MUSIC :
  const togglePlay = () => {
    setPaused(!paused);
    playAndPause();
  };

  const togglePrevious = () => {
    const newRank = numberSong - 1;
    setNumberSong(newRank);
    setCurrentSoundData(data[numberSong - 1]);
  };

  const playAndPause = () => {
    if (playingStatus === "nosound") {
      playRecording();
    }
    if (
      playingStatus === "donepause" ||
      playingStatus === "playing" ||
      playingStatus === "finished"
    ) {
      pauseAndPlayRecording();
    }
  };

  const toggleNext = () => {
    const newRank = numberSong + 1;
    setNumberSong(newRank);
    setCurrentSoundData(data[numberSong + 1]);
  };

  const playRecording = async () => {
    await sound.playAsync();
    setPlayingStatus("playing");
  };

  const pauseAndPlayRecording = async () => {
    if (sound) {
      if (playingStatus === "playing") {
        await sound.pauseAsync();
        setPlayingStatus("donepause");
      } else if (playingStatus === "finished") {
        await sound.replayAsync();
        setPlayingStatus("playing");
      } else {
        await sound.playAsync();
        setPlayingStatus("playing");
      }
    }
  };

  const updateScreenForSoundStatus = (status) => {
    // console.log(status);
    if (status.isPlaying && playingStatus !== "playing") {
      setPlayingStatus("playing");
    } else if (!status.isPlaying && playingStatus === "playing") {
      setPlayingStatus("donepause");
    }
    if (status.didJustFinish) {
      setPlayingStatus("finished");
    }
  };

  return isLoading ? (
    <Text>En cours de chargement</Text>
  ) : (
    <View style={styles.container}>
      {/*----------------------------  PLAYLIST --------------------------- */}
      <Text>La Playlist</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => setCurrentSoundData(item)}
            >
              <Text style={{ fontSize: 20, color: "white" }}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => String(item.id)}
      />

      {/*---------------------------- PLAYER --------------------------- */}
      <View style={styles.player}>
        {currentSoundData && (
          <View>
            <Text>{currentSoundData.title}</Text>
          </View>
        )}
        <View style={styles.containerPlay}>
          {currentSoundData !== data[0] ? (
            <TouchableOpacity style={styles.button} onPress={togglePrevious}>
              <AntDesign name="stepbackward" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <View style={styles.button}>
              <AntDesign name="stepbackward" size={24} color="grey" />
            </View>
          )}

          <TouchableOpacity onPress={togglePlay}>
            {playingStatus === "donepause" ||
            playingStatus === "finished" ||
            playingStatus === "nosound" ? (
              <FontAwesome name="play" size={28} />
            ) : (
              <FontAwesome name="pause" size={28} />
            )}
          </TouchableOpacity>
          {currentSoundData !== data[data.length - 1] ? (
            <TouchableOpacity style={styles.button} onPress={toggleNext}>
              <AntDesign name="stepforward" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <View style={styles.button}>
              <AntDesign name="stepforward" size={24} color="grey" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
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
    justifyContent: "center",
    alignItems: "center",
  },
  containerPlay: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerButton: {
    marginRight: 10,
  },
  button: {
    padding: 20,
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
