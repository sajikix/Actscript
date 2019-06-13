// import { setLocation } from 'actscript-domains'
import axios from 'axios'

browser.notifications.create({
  type: 'basic',
  message: 'aaaa',
  title: 'test',
})

setInterval(async () => {
  const tuple = { test: 'test' }
  let writeOperation = {
    _payload: tuple,
    _where: 'saji',
    _type: 'write',
  }
  const res = await axios.post('http://new-linda.herokuapp.com', writeOperation)
  browser.notifications.create({
    type: 'basic',
    message: 'aaaa',
    title: 'test',
  })
  console.log('aaaa')
}, 10000)
