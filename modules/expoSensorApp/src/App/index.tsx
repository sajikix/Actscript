import React from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
// import { switchSensor } from '../sensors'
import { Permissions, Notifications, Location, TaskManager } from 'expo'
// import TaskManager from 'expo-task-manager'

interface Props {}
interface State {
  sensing: boolean
}

// タスク名
const GEOLOCATION_LOGGING = 'geolocationLogging'

// タスク定義
TaskManager.defineTask(GEOLOCATION_LOGGING, ({ data, error }) => {
  if (error) {
    console.error(error.message)
    return
  }
  if (data) {
    console.log(data)
  }
  // // ジオフェンス内に入ったイベントであれば、プッシュ通知を表示
  // if (eventType === Location.GeofencingEventType.Enter) {
  //   Notifications.presentLocalNotificationAsync({
  //     title: 'test geofence notification',
  //     body: 'geofence notification',
  //     data: {
  //       message: 'geofence notification message',
  //     },
  //   })
  // }
})

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { sensing: false }
    this.buttonPress = this.buttonPress.bind(this)
  }

  async buttonPress() {
    // await switchSensor(!this.state.sensing)
    this.onPressStartGeofencing()
    this.setState({ sensing: !this.state.sensing })
  }

  onPressStartGeofencing() {
    // Location.startGeofencingAsync(GEOFENCING_ON_ENTER, [
    //   {
    //     latitude: 35.661561,
    //     longitude: 139.707883,
    //     radius: 50,
    //     notifyOnEnter: true,
    //     notifyOnExit: false,
    //   },
    // ])
    Location.startLocationUpdatesAsync(GEOLOCATION_LOGGING, {
      accuracy: 4,
      //distanceInterval: 15,
    })
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
