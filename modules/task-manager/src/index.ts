import LindaClient, { Tuple } from 'linda-client'
interface ActionTuple {
  id: string
  actionType: string
  name: string
  details: any
  [key: string]: any
}

interface TaskTuple {
  id: string
  type: string
  name: string
  expect: Tuple
}

const isValidAction = (actionTuple: Tuple): actionTuple is ActionTuple => {
  return (
    actionTuple.hasOwnProperty('id') &&
    actionTuple.hasOwnProperty('actionType') &&
    actionTuple.hasOwnProperty('name')
  )
}

class TaskManager {
  tasks: { [id: string]: TaskTuple }
  lindaClient: LindaClient
  constructor() {
    const lindaClient = new LindaClient()
    this.lindaClient = lindaClient
    this.lindaClient.connect('http://new-linda.herokuapp.com', 'saji')
    this.tasks = {}
  }

  async createTask() {
    this.lindaClient.watch({ type: 'action' }, resData => {
      // TODO:ここを充実・拡張させる
      if (isValidAction(resData._payload)) {
        const { actionType, name, id } = resData._payload

        switch (actionType) {
          case 'human/wakeup':
            const task = { type: 'task', name, expect: { wake: 'up' }, id }
            this.tasks[id] = task
            this.lindaClient.write(task)
            break
          case 'human/goto':
            break
          default:
            break
        }
      }
    })
  }

  watchTasks() {
    // TODO: 全watchは効率悪し
    this.lindaClient.watch({}, resData => {
      let matchedId = ''
      Object.keys(this.tasks).map(ele => {
        if (isMatch(resData._payload, this.tasks[ele].expect).isMatched) {
          matchedId = ele
        }
      })
      if (matchedId !== '') {
        console.log('match')
        this.lindaClient.write({ type: 'action_finished', id: matchedId })
        const copy = this.tasks
        delete copy[matchedId]
        this.tasks = copy
      }
    })
  }
}

interface IsMatchResponse {
  isMatched: boolean
  res: Tuple | null
}

const isMatch = (targetTuple: Tuple, searchTuple: Tuple): IsMatchResponse => {
  for (let operationKey in searchTuple) {
    if (!targetTuple[operationKey]) {
      return { isMatched: false, res: null }
    } else if (targetTuple[operationKey] !== searchTuple[operationKey]) {
      return { isMatched: false, res: null }
    }
  }
  return { isMatched: true, res: targetTuple }
}

const taskManager = new TaskManager()
taskManager.watchTasks()
taskManager.createTask()
