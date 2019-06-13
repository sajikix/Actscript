import React from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  HttpEvent,
  MotionActivityEvent,
  MotionChangeEvent,
  ProviderChangeEvent,
  ConnectivityChangeEvent,
} from 'react-native-background-geolocation'
import { setLocation, setMotion, lindaClient } from 'actscript-domains'

// import TaskManager from 'expo-task-manager'

interface Props {}
interface ReactState {
  sensing: boolean
}

class App extends React.Component<Props, ReactState> {
  constructor(props: Props) {
    super(props)
    this.state = { sensing: false }
    this.buttonPress = this.buttonPress.bind(this)
    this.onLocation = this.onLocation.bind(this)
    this.onActivityChange = this.onActivityChange.bind(this)
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners()
  }
  onLocation(location: Location) {
    const { latitude, longitude } = location.coords
    this.state.sensing && setLocation('saji', { lat: latitude, lon: longitude })
  }
  onError(error: LocationError) {
    console.warn('[location] ERROR -', error)
  }
  onActivityChange(event: MotionActivityEvent) {
    this.state.sensing && setMotion('saji', event.activity)
  }

  onHeartbeat(event: HeartbeatEvent) {
    console.log('heart beat')
  }

  buttonPress() {
    this.setState({ sensing: !this.state.sensing })
  }

  componentDidMount() {
    BackgroundGeolocation.onLocation(this.onLocation, this.onError)
    BackgroundGeolocation.onActivityChange(this.onActivityChange)
    BackgroundGeolocation.onHeartbeat(this.onHeartbeat)

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 20,
        stopTimeout: 1,
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      },
      state => {
        if (!state.enabled) {
          BackgroundGeolocation.start(function() {
            console.log('- Start success')
          })
        }
      },
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{'Sensor'}</Text>
        <TouchableOpacity
          style={[
            !this.state.sensing ? styles.buttonOn : styles.buttonOff,
            styles.button,
          ]}
          onPress={async () => {
            await this.buttonPress()
          }}
        >
          <Text style={styles.buttonText}>
            {!this.state.sensing ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
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
