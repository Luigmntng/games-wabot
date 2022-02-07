let hmtai = require('hmtai')

let handler = async(m, { conn }) => {

let img = await hmtai.nsfw.blowjob()
await conn.sendFile(m.chat, img, '', '', m)

}
handler.help = ['blowjob']
handler.tags = ['dosa']

handler.command = /^(blowjob)$/i

handler.premium = true
handler.register = true

module.exports = handler