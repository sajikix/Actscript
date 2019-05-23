import Human from '../src/Human'
const saji = new Human('saji')
const main = async () => {
  await saji.wakeup(new Date())
  await console.log('finish')
  await process.exit(1)
}

main()
