import {
  Platform,
  PermissionsAndroid,
  GeolocationReturnType,
} from 'react-native'
import { setLocation } from 'actscript-domains'

async function getCurrentPosition(
  timeoutMillis = 10000,
): Promise<GeolocationReturnType> {
  if (Platform.OS === 'android') {
    const ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
    if (!ok) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        // TODO ユーザーにGPS使用許可がもらえなかった場合の処理
        throw new Error()
      }
    }
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: timeoutMillis,
    })
  })
}

export default class Position {
  isOn: boolean
  constructor() {
    this.isOn = false
  }
  getAndWrite() {
    setInterval(async () => {
      const { coords } = await getCurrentPosition()
      const locationData = {
        lon: coords.longitude,
        lat: coords.latitude,
      }
      if (this.isOn) {
        await setLocation('saji', locationData)
      }
    }, 20000)
  }

  setOn() {
    this.isOn = true
  }
  setOff() {
    this.isOn = false
  }
}
