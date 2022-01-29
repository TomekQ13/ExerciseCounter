function randomString(len) {
    var buf = []
      , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      , charlen = chars.length;
  
    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
  
    return buf.join('');
}
  
function getRandomInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isDatetimeAfterNow(datetime) {
    const nowDatetime = new Date()
    return nowDatetime <= datetime
}

function todayPlusDays(days) {
    return () => {
        let date = new Date()
        date.setDate(date.getDate() + days)
        return date
    }
}

module.exports = {randomString, isDatetimeAfterNow, todayPlusDays}