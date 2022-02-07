let fs = require('fs')
let path = require('path')
let levelling = require('../lib/levelling')
let tags = {
  'main': '🄼🄰🄸🄽',
  'game': '🄶🄰🄼🄴',
  'xp': '🄴🅇🄿 & 🄻🄸🄼🄸🅃',
  'sticker': '🅂🅃🄸🄲🄺🄴🅁',
  'kerang': '🄺🄴🅁🄰🄽🄶 🄰🄹🄰🄸🄱',
  'quotes': '🅀🅄🄾🅃🄴🅂',
  'admin': '🄰🄳🄼🄸🄽',
  'group': '🄶🅁🄾🅄🄿',
  'premium': '🄿🅁🄴🄼🄸🅄🄼',
  'internet': '🄸🄽🅃🄴🅁🄽🄴🅃',
  'anonymous': '🄰🄽🄾🄽🅈🄼🄾🅄🅂 🄲🄷🄰🅃',
  'nulis': '🄼🄰🄶🄴🅁 🄽🅄🄻🄸🅂 & 🄻🄾🄶🄾',
  'downloader': '🄳🄾🅆🄽🄻🄾🄰🄳🄴🅁',
  'tools': '🅃🄾🄾🄻🅂',
  'fun': '🄵🅄🄽',
  'database': '🄳🄰🅃🄰🄱🄰🅂🄴',
  'vote': '🅅🄾🅃🄸🄽🄶',
  'absen': '🄰🄱🅂🄴🄽',
  'quran': '🄰🄻 🅀🅄🅁 🄰🄽',
  'jadibot': '🄹🄰🄳🄸 🄱🄾🅃',
  'owner': '🄾🅆🄽🄴🅁',
  'host': '🄷🄾🅂🅃',
  'advanced': '🄰🄳🅅🄰🄽🄲🄴',
  'info': '🄸🄽🄵🄾',
  '': '🄽🄾 🄲🄰🅃🄴🄶🄾🅁🅈',
}
const defaultMenu = {
  before: `
╭─『 %me 』
│ Hai, %name!
│
│ Tersisa *%limit Limit*
│ Role *%role*
│ Level *%level (%exp / %maxexp)* [%xp4levelup lagi untuk levelup]
│ %totalexp XP in Total
│ 
│ Tanggal: *%week %weton, %date*
│ Tanggal Islam: *%dateIslamic*
│ Waktu: *%time*
│
│ Uptime: *%uptime (%muptime)*
│ Database: %rtotalreg of %totalreg
│ Script :
│ https://github.com/
│ Instagram :
│ https://instagram.com/ahmdlui
│ Server :
│ https://uptimerobot.com
╰────
%readmore`.trimStart(),
  header: '╭─「 %category 」',
  body: '│ • %cmd %islimit %isPremium',
  footer: '╰────\n',
  after: `
*%npmname@^%version*
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.DATABASE._data.users).length
    let rtotalreg = Object.values(global.DATABASE._data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      ucapan: ucapan(),
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      name, weton, week, date, dateIslamic, time, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let pp = await conn.getProfilePicture(conn.user.jid).catch(_ => path.join(__dirname, '../src/avatar_contact.png'))
    conn.sendButton(m.chat,text.trim(), author,  pp,  [
  ['Ping',  '/ping'],
  ['Info',  '/info'],
  ['Owner',  '/owner']
], { quoted: m}).catch(_ => conn.sendFile(m.chat, pp, 'menu.jpg', text.trim(), m)).catch(_ => conn.reply(m.chat, text.trim(), m))
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function ucapan() {
  const time = (new Date().getUTCHours() + 7) % 24
  res = "Woi. Pagi"
  if (time >= 4) {
    res = "Solat subuh gan"
  }
  if (time >= 12) {
    res = "Solat dhuhur gan"
  }
  if (time >= 15) {
    res = "Solat azhar gan"
  }
  if (time >= 18) {
    res = "Solat Maghrib gan"
  }
  if (time >= 19) {
    res = "Solat insya gan"
  }
  return res
}
