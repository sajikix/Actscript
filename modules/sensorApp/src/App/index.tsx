import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { switchSensor } from '../sensors'

const App = () => {
  const [sensing, setSensing] = useState(true)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Sensor'}</Text>
      <TouchableOpacity
        style={[!sensing ? styles.buttonOn : styles.buttonOff, styles.button]}
        onPress={() => {
          setSensing(!sensing)
          switchSensor(sensing)
        }}
      >
        <Text style={styles.buttonText}>{!sensing ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
  },
  button: {
    borderRadius: 10,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOn: {
    backgroundColor: '#41ce00',
  },
  buttonOff: {
    backgroundColor: '#c41300',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
  },
})

export default App
