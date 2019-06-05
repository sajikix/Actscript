// import Position from './position'
import { setLocation } from 'actscript-domains'
import { TaskManager, Location } from 'expo'

const LOCATION_TASK_NAME = 'background-location-task'

// const position = new Position()
// position.getAndWrite()

export const switchSensor = async (isOn: boolean) => {
  if (isOn) {
    // position.setOn()
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    })
  } else {
    // position.setOff()
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return
  }
  if (data) {
    // do something with the locations captured in the background
    const { locations } = data
    console.log(locations)
    // setLocation('saji', { lat: locations.latitude, lon: locations.longitude })
  }
})
