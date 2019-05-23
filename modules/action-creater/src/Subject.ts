import LindaClient from 'linda-client'
import uuidv4 from 'uuid/v4'

interface ActionData {
  name: string
  actionType: string
  details: any
}

export default class Subject {
  lindaClient: LindaClient
  constructor() {
    this.lindaClient = new LindaClient()
    this.lindaClient.connect('http://new-linda.herokuapp.com', 'saji')
  }
  action(actionData: ActionData, callback: () => void) {
    const { name, actionType, details } = actionData
    const id = uuidv4()
    this.lindaClient.watch({ type: 'action_finished', id }, resData => {
      callback()
    })
    this.lindaClient.write({
      type: 'action',
      name: name,
      actionType,
      details,
      id,
    })
  }
}
