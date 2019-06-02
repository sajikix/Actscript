import Position from './position'

const position = new Position()
position.getAndWrite()

export const switchSensor = (isOn: boolean) => {
  if (isOn) {
    position.setOn()
  } else {
    position.setOff()
  }
}
