import React from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
// import { switchSensor } from '../sensors'
// import { Notifications } from 'expo'
import { setLocation } from 'actscript-domains'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import * as TaskManager from 'expo-task-manager'
// import TaskManager from 'expo-task-manager'

interface Props {}
interface State {
  sensing: boolean
}

// タスク名
const GEOLOCATION_LOGGING = 'geolocationLogging'

// タスク定義
TaskManager.defineTask(
  GEOLOCATION_LOGGING,
  ({ data, error }: { data: { [key: string]: any }; error: any }) => {
    if (error) {
      console.error(error.message)
      return
    }
    if (data.locations[0].coords) {
      const coords = data.locations[0].coords
      console.log(coords)
      setLocation('saji', { lat: coords.latitude, lon: coords.longitude })
    }
  },
)

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { sensing: false }
    this.buttonPress = this.buttonPress.bind(this)
    this.onPressStartGeofencing = this.onPressStartGeofencing.bind(this)
  }

  async buttonPress() {
    // await switchSensor(!this.state.sensing)
    // setLocation('saji', { lon: 11, lat: 11 })
    await this.setState({ sensing: !this.state.sensing })
    await this.onPressStartGeofencing()
  }

  onPressStartGeofencing() {
    if (this.state.sensing) {
      Location.startLocationUpdatesAsync(GEOLOCATION_LOGGING, {
        accuracy: 4,
        distanceInterval: 15,
        timeInterval: 15000,
        showsBackgroundLocationIndicator: true,
      })
    } else {
      Location.stopLocationUpdatesAsync(GEOLOCATION_LOGGING)
    }
  }

  async componentDidMount() {
    const locationPermissionStatus = await Permissions.getAsync(
      Permissions.LOCATION,
    )
    if (locationPermissionStatus.status !== 'granted') {
      // (iOS向け) 位置情報利用の許可をユーザーに求める
      await Permissions.askAsync(Permissions.LOCATION)
    }
    await console.log(locationPermissionStatus)

    const notificationPermissionStatus = await Permissions.getAsync(
      Permissions.NOTIFICATIONS,
    )
    if (notificationPermissionStatus.status !== 'granted') {
      // (iOS向け) 通知の許可をユーザーに求める
      await Permissions.askAsync(Permissions.NOTIFICATIONS)
    }
    await console.log(notificationPermissionStatus)
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
