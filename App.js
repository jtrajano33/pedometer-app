import { useState, useEffect, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import SpriteSheet from 'rn-sprite-sheet';

function App() {
  const [available, setAvailable] = useState(""); //checks if pedometer is available for the device
  const [stepCount, setStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);

  let dailyStep = 6000;
  let isDailyDone = false;
  let sprite = null;

  const fetchPedometerAvailability = async () => {
    let isPedometerAvailable = await Pedometer.isAvailableAsync();
    setAvailable(isPedometerAvailable)
  }

  const subscribePedometer = () => {
    const subscription = Pedometer.watchStepCount(res => {
      setStepCount(res.steps);

      let distanceCovered = res.steps / 1408;
      let cal = distanceCovered * 60

      setDistance(distanceCovered.toFixed(3))
      setCalories(cal.toFixed(3))

    })

    fetchPedometerAvailability();
  }

  useEffect(() => {
    subscribePedometer();
  }, [])

  useEffect(() => {
    sprite.play({ type: 'walk', fps: 40 })
  }, [stepCount])

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.textStyle, marginBottom: 30 }}>
        Pedometer available on device: {String(available)}
      </Text>

      <View>
        <CircularProgress
          value={stepCount}
          maxValue={6000}
          radius={100}
          duration={250}
          inActiveStrokeColor={'#2ecc71'}
          inActiveStrokeOpacity={0.3}
          title={`${stepCount} / ${dailyStep}`}
          titleColor={'white'}
          titleStyle={{ fontWeight: 'bold' }}
          progressValueStyle={{ fontWeight: '100', color: '#fff' }}
          onAnimationComplete={() => {
            if (stepCount >= dailyStep && !isDailyDone) {
              alert(`Congratulations! You've reached ${dailyStep} steps`);
              isDailyDone = true;
            }
          }}
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textStyle}>
          Calories Burned: {calories} Kcal
        </Text>

        <Text style={styles.textStyle}>
          Distance Covered: {distance} Km
        </Text>
      </View>

      <View style={{flex:1}}>
        <SpriteSheet
          ref={ref => (sprite = ref)}
          source={require('./assets/spritesheets/spider_walking.png')}
          columns={6}
          rows={6}
          imageStyle={{ marginTop: 5 }}
          animations={{
            walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: 'column',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  }
});


export default memo(App);