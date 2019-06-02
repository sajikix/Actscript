import Place from './Place'
import { GeoLocation } from './interfaces'
import lindaClient from './utils/lindaClient'

// types
export type HumanState = {
  name: string
  id?: string
  location?: GeoLocation
  sleeping?: boolean
  eating?: boolean
  sitting?: boolean
  // 抽象的な場所の定義 ex:電車内　家
  place?: Place
}

// setter
export const setLocation = (name: string, location: GeoLocation) => {
  lindaClient.write({ name, _domainLayer: true, humanState: { location } })
}

// getter
export const getLocation = async (
  name: string,
): Promise<GeoLocation | null> => {
  const data = await lindaClient.read({
    name,
    _domainLayer: true,
    humanState: { location: {} },
  })
  return data._payload.humanState.location
}
