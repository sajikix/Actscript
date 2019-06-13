import Human from '../src/Human'
const saji = new Human('saji')
let done = false
const main = async () => {
  const clear = setInterval(async () => {
    const hour = new Date(Date.now()).getHours()
    if (hour > 10 && !done) {
      done = true
      console.log('wake up task start')
      await saji.wakeup(new Date())
      await console.log('finish')
      await process.exit(1)
    }
  }, 1000)
}

main()
