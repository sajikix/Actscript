import lindaWrite from './util/lindaWrite'

const notification = (title: string, mes: string) => {
  browser.notifications.create({
    type: 'basic',
    message: title,
    title: mes,
  })
}

setInterval(async () => {
  notification('aa', 'aa')
  if (!navigator.geolocation) {
    notification('error', 'この端末では位置情報が取得できます')
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      lindaWrite({
        name: 'saji',
        location: { lat: coords.latitude, lon: coords.longitude },
      })
      lindaWrite({
        name: 'saji',
        speed: coords.speed,
      })
      lindaWrite({
        name: 'saji',
        altitude: coords.altitude,
      })
    },
    err => {
      switch (err.code) {
        case 1: //PERMISSION_DENIED
          notification('error', '位置情報の利用が許可されていません')
          break
        case 2: //POSITION_UNAVAILABLE
          notification('error', '現在位置が取得できませんでした')
          break
        case 3: //TIMEOUT
          notification('error', 'タイムアウトになりました')
          break
        default:
          notification('error', 'その他のエラー(エラーコード:' + err.code + ')')
          break
      }
    },
    { enableHighAccuracy: true },
  )
}, 10000)
