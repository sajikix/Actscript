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
import { setLocation, lindaClient } from 'actscript-domains'

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
  }

  componentWillMount() {}

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners()
  }
  onLocation(location: Location) {
    console.log('[location] -', location)
    const { latitude, longitude } = location.coords
    this.state.sensing && setLocation('saji', { lat: latitude, lon: longitude })
  }
  onError(error: LocationError) {
    console.warn('[location] ERROR -', error)
  }
  onActivityChange(event: MotionActivityEvent) {
    console.log('[activitychange] -', event) // eg: 'on_foot', 'still', 'in_vehicle'
    lindaClient.write({ type: 'MotionActivity', data: event.activity })
  }
  onProviderChange(provider: ProviderChangeEvent) {
    console.log('[providerchange] -', provider.enabled, provider.status)
  }

  buttonPress() {
    this.setState({ sensing: !this.state.sensing })
  }

  componentDidMount() {
    ////
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError)

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(this.onActivityChange)

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(this.onProviderChange)

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready(
      {
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // // HTTP / SQLite config
        // // url: 'http://yourserver.com/locations',
        // batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        // autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      },
      state => {
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        )

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function() {
            console.log('- Start success')
          })
        }
      },
    )
  }

  render() {
    //const [sensing, setSensing] = useState(false)
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
