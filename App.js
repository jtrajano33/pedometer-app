import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function App() {
  const [available, setAvailable] = useState(""); //checks if pedometer is available for the device
  const [stepCount, setStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);

  const fetchPedometerAvailability = async () => {
    let isPedometerAvailable = await Pedometer.isAvailableAsync();
    setAvailable(isPedometerAvailable)
  }

  const subscribePedometer = () => {
    const subscription = Pedometer.watchStepCount(res => {
      setStepCount(res.steps);

      let distanceCovered = res.steps/1408;
      let cal = distanceCovered * 60

      setDistance(distanceCovered.toFixed(3))
      setCalories(cal.toFixed(3))
    })
  }

  useEffect(() => {
    subscribePedometer();
    fetchPedometerAvailability();
  }, [])

  let dailyStep = 6000;
  let isDailyDone = false;

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
          inActiveStrokeColor={'#2ecc71'}
          inActiveStrokeOpacity={0.2}
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
