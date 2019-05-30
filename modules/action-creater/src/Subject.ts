import LindaClient from 'linda-client'
import uuidv4 from 'uuid/v4'

interface ActionData {
  name: string
  actionType: string
  details: any
}
interface ResData {
  state: string
  id: string
}

interface ErrorMes {
  error: string | null
}

export default class Subject {
  lindaClient: LindaClient
  constructor() {
    this.lindaClient = new LindaClient()
    this.lindaClient.connect('http://new-linda.herokuapp.com', 'saji')
  }
  action(
    actionData: ActionData,
    callback: (err: ErrorMes, res: ResData) => void,
  ) {
    const { name, actionType, details } = actionData
    const id = uuidv4()
    this.lindaClient.watch({ type: 'action_finished', id }, resData => {
      callback({ error: null }, { state: 'finished', id })
    })
    this.lindaClient.watch({ type: 'action_failed', id }, resData => {
      callback({ error: 'action_failed' }, { state: 'failed', id })
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
