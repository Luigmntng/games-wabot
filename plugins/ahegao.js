let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
   response = args.join(' ')
  if (!args) throw 'Masukkan Parameter'
  m.reply('Sedang Diproses...')
  let res = `https://api.lolhuman.xyz/api/random/nsfw/ahegao?apikey=HIRO`
  conn.sendFile(m.chat, res, 'ahegao.jpg', `wangy wangy wangy`, m, false)
}
handler.help = ['ahegao'].map(v => v + ' ')
handler.tags = ['dosa']

handler.command = /^(ahegao)$/i

handler.premium = true
handler.register = true

module.exports = handler

