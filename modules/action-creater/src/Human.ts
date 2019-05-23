import Subject from './Subject'

export default class Human extends Subject {
  name: string
  constructor(name: string) {
    super()
    this.name = name
  }
  wakeup(time: Date): Promise<void> {
    const actionData = {
      name: this.name,
      actionType: 'human/wakeup',
      details: {
        time,
      },
    }
    return new Promise((resolve, reject) => {
      this.action(actionData, () => {
        resolve()
      })
    })
  }
}
