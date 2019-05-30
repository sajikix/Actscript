import Subject from './Subject'
interface Place {
  lat: number
  lon: number
}

interface ActionData {
  name: string
  actionType: string
  details: { [key: string]: any }
}

export default class Human extends Subject {
  name: string
  constructor(name: string) {
    super()
    this.name = name
  }

  private createAction(actionData: ActionData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.action(actionData, (err, res) => {
        if (err.error) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }

  public wakeup(time: Date): Promise<void> {
    const actionData = {
      name: this.name,
      actionType: 'human/wakeup',
      details: {
        time,
      },
    }
    return this.createAction(actionData)
  }

  public leave(place: Place) {
    const actionData = {
      name: this.name,
      actionType: 'human/leave',
      details: {
        place,
      },
    }
    return this.createAction(actionData)
  }

  public goto(place: Place) {
    const actionData = {
      name: this.name,
      actionType: 'human/goto',
      details: {
        place,
      },
    }
    return this.createAction(actionData)
  }
}
