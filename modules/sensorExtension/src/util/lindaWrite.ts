import axios from 'axios'
import { Tuple } from '../interfaces'

const lindaWrite = async (tuple: Tuple) => {
  const writeOperation = {
    _payload: tuple,
    _where: 'saji',
    _type: 'write',
  }
  await axios.post('http://new-linda.herokuapp.com', writeOperation)
}

export default lindaWrite
