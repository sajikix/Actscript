export type LindaOperation = {
  _payload: Tuple
  _where: string
  _type: 'read' | 'write' | 'watch' | 'take'
  _from?: string
}

export type LindaResponse = {
  _payload: Tuple
  _where: string
  _time: number
  _id?: number | any
  _isMuched?: boolean
  _from?: string
}

export type Tuple = {
  [key: string]: number | string | boolean | Tuple
}
