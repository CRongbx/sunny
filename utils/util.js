const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getYear = date => {
  const year = date.getFullYear()
  return year.toString()
}

const getMonth = date => {
  const month = date.getMonth() + 1
  return month.toString()
}

const getDay = date => {
  const day = date.getDate()
  return day.toString()
}

const getHour = date => {
  const hours = date.getHours()
  return hours.toString()
}

const getMinute = date => {
  const minute = date.getMinutes()
  return minute.toString()
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getYear: getYear,
  getMonth: getMonth,
  getDay: getDay,
  getHour: getHour,
  getMinute: getMinute,
}