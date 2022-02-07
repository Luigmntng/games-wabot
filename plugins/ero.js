let hmtai = require('hmtai')

let handler = async(m, { conn }) => {

let img = await hmtai.nsfw.ero()
await conn.sendFile(m.chat, img, '', '', m)

}
handler.help = ['ero']
handler.tags = ['dosa']

handler.command = /^(ero)$/i

handler.premium = true
handler.register = true

module.exports = handler