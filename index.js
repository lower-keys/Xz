/**
  * Script 
  * Created By NathanaeL
  * https://wa.me/6289652948525
**/

const { default: WAConnection, useMultiFileAuthState, generateWAMessageFromContent, getContentType, downloadContentFromMessage, makeCacheableSignalKeyStore, extractImageThumb } = require('@adiwajshing/baileys');
const pino = require('pino');
const fetch = require('node-fetch');
const axios = require('axios');
const dl = require('@bochilteam/scraper');
const cheerio = require('cheerio');
const chalk = require('chalk');
const { JSDOM } = require('jsdom');
const clph = require('caliph-api');
const yts = require('yt-search');
const moment = require('moment-timezone');
const formData = require('form-data');
const ffmpeg = require('fluent-ffmpeg');
const xfar = require('xfarr-api');
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs')
const _ = require('lodash')
const { format, util } = require('util');
const { PassThrough } = require('stream');
const { watchFile } = require('fs');
const { exec } = require('child_process');
const fakeThumb = fs.readFileSync('./fakeThumb.jpeg');
const menu = fs.readFileSync('./menu.jpeg');
const { parseRes } = require("./parseres.js");
const resolveDesuUrl = require('./resolve-desu-url.js');
const { clockString } = require('./lib/myfunc');
const getRandom = (arr = []) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
const resolveBufferStream = require('./resolve-buffer-stream.js'); 
const { googleImage } = require('@bochilteam/scraper');
const PDFDocument = require('pdfkit') ;
let { webp2png } = require('./lib/webp2mp4');
const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

const start = async () => {
const { state, saveCreds } = await useMultiFileAuthState('session')
      
const level = pino({ level: 'silent' })
const sock = WAConnection({
  logger: level,
  printQRInTerminal: true,
  browser: ['Yanfei', 'Firefox', '3.0.0'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, level),
  }
});

sock.ev.on('connection.update', v => {
  const { connection, lastDisconnect } = v;
  if (connection === 'close') {
    if (lastDisconnect.error.output.statusCode !== 401) {
      start();
    } else {
      exec('rm -rf session');
      console.error('Scan QR!');
      start();
    }
  } else if (connection === 'open') {
    console.log('Bot connected!');
  }
});

sock.ev.on('creds.update', saveCreds);

sock.ev.on('messages.upsert', async m => {
const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
      new mongoDB(opts['db']) :
      new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    group: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    donate: {},
    others: {},
    sticker: {},
    anonymous: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
  }, 30 * 1000)

loadDatabase()
const { ownerNumber, ownerName, botName, otakudesuUrl, xcoders } = require('./config.json');

global.db.data = JSON.parse(fs.readFileSync('./database.json'))
if (global.db.data) global.db.data = {
    users: {},
    group: {},
    chats: {},
    database: {},
    settings: {},
    donate: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
}

if (!m.messages) return;

const msg = m.messages[0];
const from = msg.key.remoteJid;
const type = getContentType(msg.message);
const quotedType = getContentType(msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null;

if (type === 'ephemeralMessage') {
  if (msg && msg.message && msg.message.ephemeralMessage && msg.message.ephemeralMessage.message) {
    msg.message = msg.message.ephemeralMessage.message;
    if (msg.message.viewOnceMessage) {
      msg.message = msg.message.viewOnceMessage;
    }
  }
}

if (type === 'viewOnceMessage') {
  if (msg && msg.message && msg.message.viewOnceMessage) {
    msg.message = msg.message.viewOnceMessage.message;
  }
}

const body =
  type === 'imageMessage' || type === 'videoMessage'
    ? msg.message[type].caption
    : type === 'conversation'
    ? msg.message[type]
    : type === 'extendedTextMessage'
    ? msg.message[type].text
    : '';

const isGroup = from.endsWith('@g.us');
const sender = msg.key.fromMe ? (sock.user.id.split(':')[0]+'@s.whatsapp.net' || sock.user.id) : (msg.key.participant || msg.key.remoteJid)
const senderName = msg.pushName;
const senderNumber = sender.split('@')[0];
const groupMetadata = isGroup ? await sock.groupMetadata(from) : null;
const participants = isGroup ? await groupMetadata.participants : '';
const groupName = groupMetadata?.subject || '';
const botNumber = sock.user.id.split(':')[0]
const groupMembers = groupMetadata?.participants || [];
const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id);
const isGroupAdmins = groupAdmins.includes(sender);
const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id;
const isBotGroupAdmins = groupMetadata && groupAdmins.includes(botId);
const isOwner = ownerNumber.includes(sender);
const isBot = botNumber.includes(senderNumber)
const isCmd = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\\\©^]/.test(body);
const prefix = isCmd ? body[0] : '';
const args = body.trim().split(/ +/).slice(1);
let q = args.join(' ');
const text = q = args.join(" ")
const pushname = msg.pushName || `${senderNumber}`;
const mentionUser = [...new Set([...(msg.mentionedJid || []), ...(msg.quoted ? [msg.quoted.sender] : [])])]
const nomorOwner = [`6282384888024`];
const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY');
const wib = moment.tz('Asia/Jakarta').format('HH : mm : ss');
const wit = moment.tz('Asia/Jayapura').format('HH : mm : ss');
const wita = moment.tz('Asia/Makassar').format('HH : mm : ss');

const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
if(time2 < "23:59:00"){
var ucapanWaktu = 'Good Night 🏙️'
}
if(time2 < "19:00:00"){
var ucapanWaktu = 'Good Night 🌆'
}
if(time2 < "18:00:00"){
var ucapanWaktu = 'Good Afternoon 🌇'
}
if(time2 < "15:00:00"){
var ucapanWaktu = 'Good Afternoon 🌤️'
}
if(time2 < "10:00:00"){
var ucapanWaktu = 'Good Morning 🌄'
}
if(time2 < "05:00:00"){
var ucapanWaktu = 'Good Morning 🌆'
}
if(time2 < "03:00:00"){
var ucapanWaktu = 'Good Night 🌃'
}


const reply = (teks) => {
  sock.sendMessage(from, { text: teks }, { quoted: msg });
};

const fakeSend = async (teks, judul, isi, msg) => {
  sock.sendMessage(from, {
    text: teks,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: judul,
        body: isi,
        mediaType: 3,
        thumbnail: fakeThumb,
        sourceUrl: 'https://'
      }
    }
  }, {
    sendEphemeral: true,
    quoted: msg
  });
}

const fgif = {
    key: {
participant: `0@s.whatsapp.net`,
...(from ? {
  remoteJid: "status@broadcast"
} : {})
    },
    message: {
"videoMessage": {
  "title": `Xz`,
  "h": `Xz`,
  'seconds': '359996400',
  'gifPlayback': 'true',
  'caption': `${ucapanWaktu}`,
  'jpegThumbnail': fakeThumb,
}
    }
}
const ftroli = {
    key: {
fromMe: false,
"participant": "0@s.whatsapp.net",
"remoteJid": "status@broadcast"
    },
    "message": {
orderMessage: {
  itemCount: 505,
  status: 200,
  thumbnail: fakeThumb,
  surface: 200,
  message: `Xz`,
  orderTitle: 'Xz',
  sellerJid: '0@s.whatsapp.net'
}
    },
    contextInfo: {
"forwardingScore": 999,
"isForwarded": true
    },
    sendEphemeral: true
}


let command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : '';

let { chat, fromMe, id, isBaileys } = q
const isImage = type === 'imageMessage';
const isVideo = type === 'videoMessage';
const isAudio = type === 'audioMessage';
const isSticker = type === 'stickerMessage';
const isContact = type === 'contactMessage';
const isLocation = type === 'locationMessage';

const isQuoted = type === 'extendedTextMessage';
const isQuotedImage = isQuoted && quotedType === 'imageMessage';
const isQuotedVideo = isQuoted && quotedType === 'videoMessage';
const isQuotedAudio = isQuoted && quotedType === 'audioMessage';
const isQuotedSticker = isQuoted && quotedType === 'stickerMessage';
const isQuotedContact = isQuoted && quotedType === 'contactMessage';
const isQuotedLocation = isQuoted && quotedType === 'locationMessage';

let mediaType = type;
let stream;
if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
  mediaType = quotedType;
  msg.message[mediaType] = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[mediaType];
  stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', '')).catch(console.error);
}

async function searchWattpad(q) {
  try {
    const response = await axios.get(`http://xyros.my.id/api/wattpad?keyword=${q}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function funcArtiNama(name) {
  try {
    const response = await fetch(`http://xyros.my.id/api/artinama?keyword=${name}`);
    const result = await response.json();
    return result.arti;
  } catch (error) {
    console.error('Terjadi kesalahan dalam mendapatkan result arti nama:', error);
    return 'Terjadi kesalahan dalam mendapatkan result arti nama.';
  }
}

async function youtubeSearch(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await yts(query);
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}
//data
async function getBuffer(url, options) {
  try {
    options = options || {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    });
    return res.data;
  } catch (e) {
    return reply(`Error: ${e}`);
  }
}

async function getFile(PATH, returnAsFilename) {
	try {
        let res, filename
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data
        }
    } catch (x) {
    	return reply('Error')
    }
   }
   
async function instagram(url) {
  let res = await axios('https://indown.io/');
  let _$ = cheerio.load(res.data);
  let referer = _$('input[name=referer]').val();
  let locale = _$('input[name=locale]').val();
  let _token = _$('input[name=_token]').val();
  let { data } = await axios.post(
    'https://indown.io/download',
    new URLSearchParams({
      link: url,
      referer,
      locale,
      _token
    }),
    {
      headers: {
        cookie: res.headers['set-cookie'].join('; ')
      }
    }
  );
  let $ = cheerio.load(data);
  let result = [];
  let __$ = cheerio.load($('#result').html());
  __$('video').each(function () {
    let $$ = $(this);
    result.push({
      type: 'video',
      thumbnail: $$.attr('poster'),
      url: $$.find('source').attr('src')
    });
  });
  __$('img').each(function () {
    let $$ = $(this);
    result.push({
      type: 'image',
      url: $$.attr('src')
    });
  });

  return result;
}

async function zoro(q) {
 const res = await axios.get(`https://zoro.to/search?keyword=${q}`)
 const $ = cheerio.load(res.data)
 const arrays = []
     $("div.flw-item").each(function () {
        const title = $(this).find("div.film-detail > h3 > a").attr("title")
        const type = $(this).find("div.film-detail > div.fd-infor > span:nth-child(1)").text()
        const duration = $(this).find("div.film-detail > div.fd-infor > span.fdi-item.fdi-duration").text()
        const link = "https://zoro.to" + $(this).find("div.film-detail > h3 > a").attr("href")
        arrays.push({title, type, duration, link})
     })
return arrays
}

async function getBase64(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const data = Buffer.from(res.data, 'binary').toString('base64');
    return data;
  } catch (err) {
    console.error(err);
  }
}

try {
let isNumber = x => typeof x === 'number' && !isNaN(x)
let user = global.db.data.users[sender]
  if (typeof user !== 'object') global.db.data.users[sender] = {}
  if (user) {
if (!isNumber(user.afkTime)) user.afkTime = -1
if (!('afkReason' in user)) user.afkReason = ''
  } else global.db.data.users[sender] = {
afkTime: -1,
afkReason: '',
  }
  let chats = global.db.data.chats[from]
  if (typeof chats !== 'object') global.db.data.chats[from] = {}
  if (chats) {
if (!('mute' in chats)) chats.mute = false
if (!('antilink' in chats)) chats.antilink = false
if (!('antilinkv2' in chats)) chats.antilinkv2 = false
  } else global.db.data.chats[from] = {
mute: false,
antilink: false,
antilinkv2: false
  }
  let setting = global.db.data.settings[isBot]
if (typeof setting !== 'object') global.db.data.settings[isBot] = {}
if (setting) {
if (!isNumber(setting.status)) setting.status = 0
if (!('autoread' in setting)) setting.autoread = false
} else global.db.data.settings[isBot] = {
status: 0,
autoread: false
}
} catch (err) {
console.error(err)
}
  
async function fetchJson(url, options) {
  try {
    options = options || {};
    const res = await axios.get(url, options);
    return res.data;
  } catch (error) {
    return error.message;
  }
}

const parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

function isUrl(url) {
  const regexp =
    /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.){1,1}(?:\S+(?::\S*)?@)?(?:localhost|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-?)*[a-zA-Z\u00a1-\uffff0-9]+){1,1}(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-?)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/;
  return regexp.test(url);
}

async function shortlink(url) {
  const res = await axios.get(`https://tinyurl.com/api-create.php?url=${url}`);
  return res.data;
}

async function scheduleFunction(func, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(func());
      } catch (e) {
        reject(e);
      }
    }, ms);
  });
}

for (let jid of mentionUser) {
let user = global.db.data.users[jid]
if (!user) continue
let afkTime = user.afkTime
if (!afkTime || afkTime < 0) continue
let reason = user.afkReason || ''
fakeSend(` Don't Tag Him!
 He's AFK ${reason ? 'With Reason: ' + reason : 'No Reason'}
 During ${clockString(new Date - afkTime)}
`.trim())
}

if (db.data.users[sender].afkTime > -1) {
let user = global.db.data.users[sender]
fakeSend(`
 You Quit AFK${user.afkReason ? ' After: ' + user.afkReason : ''}
 During ${clockString(new Date - user.afkTime)}
`.trim())
user.afkTime = -1
user.afkReason = ''
}

function parseMs(ms) {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  let days = Math.floor(ms / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds: ms % 1000
  };
}

  if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'))
  if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
  if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
  if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
  
  //func game
  
//

    switch (command) {
  case 'menu':
  case '?':
  case 'hixz': {
  	let xxxx = `
    
         *_HI! ${pushname}_*
         *${ucapanWaktu}*
         *${hariini}*
    
    *_Downloader Feature_*
   _${prefix}igdl_
   _${prefix}igstory_
   _${prefix}mediafire_
   _${prefix}tiktok_
   _${prefix}twitter_
   _${prefix}ytmp3_
   _${prefix}ytmp4_
   _${prefix}ytsearch_
   _${prefix}bookdl_
   
    *_Group Feature_*
   _${prefix}add_
   _${prefix}close_
   _${prefix}closetime_
   _${prefix}demote_
   _${prefix}hidetag_
   _${prefix}kick_
   _${prefix}open_
   _${prefix}opentime_
   _${prefix}promote_
   _${prefix}setdescgroup_
   _${prefix}setnamegroup_
   
    *_Maker Feature_*
   _${prefix}woi_
   _${prefix}bajingan_
   _${prefix}joebiden_
   _${prefix}tolol_
   _${prefix}runner-logo_
   _${prefix}comic-logo_
   _${prefix}style-logo_
   _${prefix}water-logo_
   _${prefix}starwars-logo_
   _${prefix}kertas_
   _${prefix}ledrun_
   
    *_Other_*
   _${prefix}tsunami_
   _${prefix}ssweb_
   _${prefix}artinama_
   _${prefix}cuaca_
   _${prefix}infogempa_
   _${prefix}get_
   _${prefix}owner_
   _${prefix}shortlink_
   _${prefix}sticker_
   _${prefix}waifu_
   _${prefix}gimage_
   
      
      Type ${prefix}guide to get instructions

      
  -_-
`
sock.sendMessage(from, { caption: xxxx, image: menu, contextInfo:{forwardingScore: 999999, isForwarded: true, "externalAdReply": {"title": `Xz`,"body": `${ucapanWaktu} `, "previewType": "PHOTO","thumbnail": fakeThumb,"sourceUrl": `https://`}}}, { quoted: ftroli})}
break;
 case 'guide': {
owned = `${nomorOwner}@s.whatsapp.net`
let anu = `

        *${botName}* 
   
          Guide Menu:
  
  • *DOWNLOADER*
    › ${prefix}igdl - Mengunduh video dari Instagram.
    › ${prefix}igstory - Mengunduh story Instagram.
    › ${prefix}mediafire - Mengunduh file dari MediaFire.
    › ${prefix}tiktok - Mengunduh video dari TikTok.
    › ${prefix}twitter - Mengunduh video dari Twitter.
    › ${prefix}ytmp3 - Mengunduh audio dari YouTube.
    › ${prefix}ytmp4 - Mengunduh video dari YouTube.
    ›${prefix}bookdl - mengunduh video dari Facebook
    › ${prefix}ytsearch - Mencari video di YouTube.
   
  • *GROUPS*
    › ${prefix}add - Menambahkan anggota ke grup.
    › ${prefix}close - Menutup grup.
    › ${prefix}closetime - Mengatur waktu penutupan grup.
    › ${prefix}demote - Menurunkan jabatan anggota grup.
    › ${prefix}hidetag - Menyembunyikan tag.
    › ${prefix}kick - Mengeluarkan anggota dari grup.
    › ${prefix}opentime - Mengatur waktu pembukaan grup.
    › ${prefix}open - Membuka grup.
    › ${prefix}promote - Menaikkan jabatan anggota grup.
    › ${prefix}setdescgroup - Mengatur deskripsi grup.
    › ${prefix}setnamegroup - Mengatur nama grup.
    
  • *MAKER*
    › ${prefix}comic-logo - Membuat logo menggunakan nama kamu.
    › ${prefix}runner-logo - Membuat logo menggunakan nama kamu.
    › ${prefix}starwars-logo - Membuat logo menggunakan nama kamu.
    › ${prefix}style-logo - Membuat logo menggunakan nama kamu.
    › ${prefix}water-logo - Membuat logo menggunakan nama kamu.
    › ${prefix}tolol - Membuat teks "Sertifikat Tolol" menggunakan nama kamu.
    › ${prefix}kertas - Membuat gambar menggunakan kertas dari teks atau nama kamu.
    › ${prefix}bajingan - Membuat gambar "Bajingan Lo" dari teks atau nama kamu.
    › ${prefix}woi - Membuat gambar "WOI" dari teks atau nama kamu.
    › ${prefix}joebiden - Membuat teks dari polosan postingan Twitter Joe Biden menggunakan nama dan isi teks kamu.
    › ${prefix}ledrun - Membuat video berjalan menggunakan teks kamu.
    
  • *OTHERS*
    › ${prefix}artinama - Mencari informasi dan arti dari nama kamu.
    › ${prefix}cuaca - Menampilkan informasi cuaca.
    › ${prefix}get - Menampilkan informasi link.
    › ${prefix}infogempa - Menampilkan informasi gempa terkini.
    › ${prefix}owner - Menampilkan informasi pemilik bot.
    › ${prefix}shortlink - Memperpendek tautan URL.
    › ${prefix}ssweb - Mengambil tangkapan layar dari situs web.
    › ${prefix}sticker - Mengubah gambar menjadi stiker.
    › ${prefix}tsunami - Mencari informasi tsunami.
    › ${prefix}waifu - Mengirim gambar waifu acak.`
    sock.sendMessage(from, {
    text: anu,
    contextInfo: { 
      externalAdReply: {
showAdAttribution: true, 
title: `${ucapanWaktu}`,
body: "Xz",
thumbnail: menu,
sourceUrl: "https://",
mediaType: 1,
renderLargerThumbnail: true
      }
    }
   })
}
break;
  /* Downloader */
case 'igdl':
case 'instagram':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  instagram(q)
    .then((data) => {
      for (let i of data) {
        if (i.type === "video") {
          sock.sendMessage(from, { video: { url: i.url }}, { quoted: msg });
        } else if (i.type === "image") {
          sock.sendMessage(from, { caption: `🥰`, image: { url: i.url }}, { quoted: msg });
        }
      }
    })
    .catch(() => reply(`Maaf, terjadi kesalahan`));
  break;
  case 'bookdl': 
  if (!q) { 
  	    return fakeSend(`Contoh :\n${prefix + command} URL`);
  }
  reply(`tunggu sebentar ${pushname}`);
     dl.savefrom(q).then(data => {
  	sock.sendMessage(from, { video: { url: data[0].url[0].url }, caption: `   *Done*`}, { quoted: fgif});
  })
  .catch(() => reply(`Maaf, link tidak valid / video bersifat pribadi`));
  break;
case 'mediafire':
  if (!q) {
    return reply(`Example:\n${prefix + command} URL`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  dl.mediafiredl(q)
    .then((data) => {
      reply(`*${data.filename}*\n*Ukuran: ${data.filesize}*`);
      sock.sendMessage(from, { document: { url: data.url }, mimetype: 'zip', fileName: data.filename });
    });
  break;
case 'tiktok':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  dl.savefrom(q).then(data => {
    fakeSend(`\nTunggu sebentar..\n`);
    sock.sendMessage(from, {
      video: {
        url: data[0].url[0].url
      },
      caption: data[0].meta.title
    });
  });
  break;
case 'igstory':
case 'igs':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} natgxcoders`);
  } else {
    fakeSend(`\nTunggu sebentar..\n`);
    var storis = `https://instagram.com/stories/` + q;
    instagram(storis.replace('@', ''))
      .then((data) => {
        for (let i of data) {
          if (i.type === "video") {
            sock.sendMessage(from, { video: { url: i.url }}, { quoted: msg });
          } else if (i.type === "image") {
            sock.sendMessage(from, { image: { url: i.url }}, { quoted: msg });
          }
        }
      })
      .catch(() => reply(`Maaf, terjadi kesalahan`));
  }
  break;
case 'twitter':
case 'twt':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  var url = q;
  dl.savefrom(url)
    .then(data => {
      fakeSend(`\nTunggu sebentar..\n`);
      if (data[0].url[0].type === "mp4") {
        sock.sendMessage(from, { video: { url: data[0].url[0].url } });
      } else if (data[0].url[0].type === "jpg") {
        sock.sendMessage(from, { image: { url: data[0].url[0].url } });
      }
    })
    .catch(e => {
      reply(String(e));
    });
  break;
case 'ytmp3':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  var url = q;
  var yt = await dl.youtubedl(url).catch(async () => await dl.youtubedl(url));
  var dl_url = await yt.audio['128kbps'].download();
  sock.sendMessage(from, { image: { url: yt.thumbnail }, caption: `*${yt.title}*` }, { quoted: msg });
  sock.sendMessage(from, { document: { url: dl_url }, fileName: yt.title + `.mp3`, mimetype: 'audio/mp4', caption: `Xz.mp3` }, { quoted: msg });
  break;
case 'ytmp4':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  var url = q;
  var yt = await dl.youtubedl(url).catch(async () => await dl.youtubedl(url));
  var dl_url = await yt.video['480p'].download();
  setTimeout(() => {
    sock.sendMessage(from, { video: { url: dl_url }, caption: `*${yt.title}*` });
  }, 3000);
  break;
case 'yts':
case 'ytsearch':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Lil Budi`);
  }
  try {
    const results = await youtubeSearch(q);
    if (results && results.videos.length > 0) {
      const video = results.videos[0];
      const response = `Hasil Pencarian YouTube:
        Judul: ${video.title}
        Deskripsi: ${video.description}
        Link: ${video.url}`;
      reply(response);
    } else {
      reply("Tidak ada hasil yang ditemukan.");
    }
  } catch (error) {
    console.error("Error saat melakukan pencarian YouTube:", error);
    reply("Terjadi kesalahan saat melakukan pencarian YouTube.");
  }
  break;
  /* Groups */
case 'add':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!msg.message.extendedTextMessage) return reply('Reply targetnya!');
  add = msg.message.extendedTextMessage.contextInfo.participant;
  await sock.groupParticipantsUpdate(from, [add], 'add');
  break;
case 'close':
  if (!isGroup) return reply('Hanya untuk digunakan di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  await sock.groupSettingUpdate(from, 'announcement');
  reply('Success.');
  break;
case 'closetime':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!args[1]) {
    return reply(`*Options:*\ndetik\nmenit\njam\nhari\n\n*Contoh:*\n${prefix + command} 20 detik`);
  }
  let closeTimer;
  switch (args[1]) {
    case 'detik':
      closeTimer = args[0] * 1000;
      break;
    case 'menit':
      closeTimer = args[0] * 60000;
      break;
    case 'jam':
      closeTimer = args[0] * 3600000;
      break;
    case 'hari':
      closeTimer = args[0] * 86400000;
      break;
    default:
      return reply(`*Options:*\ndetik\nmenit\njam\nhari\n\n*Contoh:*\n${prefix + command} 20 detik`);
  }
  reply(`${q} dari sekarang`);
  setTimeout(() => {
    sock.groupSettingUpdate(from, 'announcement');
    reply(`Success ${command} ${q}`);
  }, closeTimer);
  break;
case 'demote':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!msg.message.extendedTextMessage) return reply('Reply targetnya!');
  demote = msg.message.extendedTextMessage.contextInfo.participant;
  await sock.groupParticipantsUpdate(from, [demote], 'demote');
  reply('Success.');
  break;
case 'hidetag':
  if (!q) return reply(`Contoh:\n${prefix + command} Hidetag dari admin`);
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  let mem = participants.map(i => i.id);
  sock.sendMessage(from, { text: q ? q : '', mentions: mem }, { quoted: msg });
  break;
case 'kick':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!msg.message.extendedTextMessage) return reply('Reply targetnya!');
  remove = msg.message.extendedTextMessage.contextInfo.participant;
  await sock.groupParticipantsUpdate(from, [remove], 'remove');
  break;
case 'opentime':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!args[1]) {
    return reply(`*Options:*\ndetik\nmenit\njam\nhari\n\n*Contoh:*\n${prefix + command} 20 detik`);
  }
  let openTimer;
  switch (args[1]) {
    case 'detik':
      openTimer = args[0] * 1000;
      break;
    case 'menit':
      openTimer = args[0] * 60000;
      break;
    case 'jam':
      openTimer = args[0] * 3600000;
      break;
    case 'hari':
      openTimer = args[0] * 86400000;
      break;
    default:
      return reply(`*Options:*\ndetik\nmenit\njam\nhari\n\n*Contoh:*\n${prefix + command} 20 detik`);
  }
  reply(`${q} dimulai dari sekarang`);
  setTimeout(() => {
    sock.groupSettingUpdate(from, 'not_announcement');
    reply(`Success ${command} ${q}`);
  }, openTimer);
  break;
case 'open':
  if (!isGroup) return reply('Hanya untuk digunakan di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  await sock.groupSettingUpdate(from, 'not_announcement');
  reply('Success.');
  break;
case 'promote':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!msg.message.extendedTextMessage) return reply('Reply targetnya!');
  promote = msg.message.extendedTextMessage.contextInfo.participant;
  await sock.groupParticipantsUpdate(from, [promote], 'promote');
  reply('Success.');
  break;
case 'setdescgroup':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!q) return reply(`Contoh:\n${prefix + command} Admin berkuasa`);
  await sock.groupUpdateDescription(from, q)
    .then(() => reply('Success.'))
    .catch(() => reply('Maaf, terjadi kesalahan'));
  break;
case 'setnamegroup':
  if (!isGroup) return reply('Hanya untuk di dalam grup!');
  if (!isGroupAdmins) return reply('Hanya untuk admin grup!');
  if (!isBotGroupAdmins) return reply('Jadikan bot sebagai admin grup!');
  if (!q) return reply(`Contoh:\n${prefix + command} Yanfei WhatsApp Bot`);
  await sock.groupUpdateSubject(from, q)
    .then(() => reply('Success.'))
    .catch(() => reply('Maaf, terjadi kesalahan'));
  break;
  case 'join': {
if (!isOwner) return reply('Hanya untuk owner')
if (!q) return fakeSend(`Contoh: ${prefix+command} linkgc`)
if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return fakeSend('Link Invalid!')
let result = args[0].split('https://chat.whatsapp.com/')[1]
await sock.groupAcceptInvite(result).then((res) => reply(`berhasil join`))
}
break;

case '>x':
textsz = `         *ON*          `
sock.sendMessage(from, { text: textsz, contextInfo:{forwardingScore: 999999, isForwarded: true}}, { quoted: ftroli })
break;

  /* Maker */
case 'comic-logo':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei`);
  }
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=comics-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${q}`
    }
  }, { quoted: msg });
  break;
case 'runner-logo':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${q}`
    }
  }, { quoted: msg });
  break;
case 'starwars-logo':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=star-wars-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${q}`
    }
  }, { quoted: msg });
  break;
case 'style-logo':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=style-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${q}`
    }
  }, { quoted: msg });
  break;
case 'tolol':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://tolol.ibnux.com/img.php?nama=${q}`
    }
  }, { quoted: msg });
  break;
case 'kertas':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Love You`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://mfarels.my.id/api/kertas?text=${q}`
    }
  }, { quoted: msg });
  break;
case 'bajingan':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Wahyu`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://mfarels.my.id/api/bajinganlo?text=${q}`
    }
  }, { quoted: msg });
  break;
case 'woi':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Woi Dek`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://mfarels.my.id/api/woi?text=${q}`
    }
  }, { quoted: msg });
  break;
case 'joebiden':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei WhatsApp Bot`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://api-xcoders.site/api/maker/biden?text=${q}&apikey=${xcoders}`
    }
  }, { quoted: msg });
  break;
case 'water-logo':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    image: {
      url: `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${q}`
    }
  }, { quoted: msg });
  break;
case 'ledrun':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yanfei WhatsApp Bot`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    caption: q,
    video: {
      url: `https://mfarels.my.id/api/led-runningtext?text=${q}`
    }
  }, { quoted: msg });
  break;
  /* Others */
case 'artinama':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Nathanael`);
  }
  const name = q;
  const artiNama = await funcArtiNama(name);
  const resultss = `Arti nama dari ${name}: ${artiNama}`;
  reply(resultss);
  break;
case 'cuaca':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} Yogyakarta`);
  }
  await fakeSend(`\nTunggu sebentar..\n`);
  var { status, data: resultInfo } = await clph.search.cuaca(q);
  if (status != 200) {
    return reply(`Daerah ${q} tidak ditemukan!`);
  }
  reply(
    parseRes(resultInfo, {
      title: "Cuaca Hari Ini",
    })
  );
  break
case 'get':
case 'fetch':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} https://github.com/erhabot`);
  }
  if (!/^https?:\/\//.test(q)) {
    return reply("URL is Invalid!");
  }
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  if (body.match(/(mp4)/gi)) {
    fetch(`${q}`, requestOptions)
      .then((res) => sock.sendMessage(from, { video: { url: `${q}` }, mimetype: "video/mp4", caption: "Success" }, { quoted: msg }))
      .catch((error) => reply("Error", error));
  } else if (body.match(/(mp3)/gi)) {
    fetch(`${q}`, requestOptions)
      .then((res) => sock.sendMessage(from, { audio: { url: `${q}` }, mimetype: "audio/mp4", fileName: "Audio" }, { quoted: msg }))
      .catch((error) => reply("error", error));
  } else if (body.match(/(png)/gi)) {
    fetch(`${q}`, requestOptions)
      .then((res) => sock.sendMessage(from, { image: { url: `${q}` }, caption: "Success" }, { quoted: msg }))
      .catch((error) => reply("Error", error));
  } else if (body.match(/(jpg)/gi)) {
    fetch(`${q}`, requestOptions)
      .then((res) => sock.sendMessage(from, { image: { url: `${q}` }, caption: "Success" }, { quoted: msg }))
      .catch((error) => reply("Error", error));
  } else if (body.match(/(jpeg)/gi)) {
    fetch(`${q}`, requestOptions)
      .then((res) => sock.sendMessage(from, { image: { url: `${q}` }, caption: "Success" }, { quoted: msg }))
      .catch((error) => reply("Error", error));
  } else {
    fetch(`${q}`, requestOptions)
      .then((response) => response.text())
      .then((result) => reply(result))
      .catch((error) => reply("Error", error));
  }
  break;
case 'infogempa':
  const { result } = await clph.info.gempa();
  const image = {
    url: result.image
  };
  delete result.image;
  sock.sendMessage(from, {
    image,
    caption: parseRes(result, {
      title: "Info Gempa"
    })
  });
  break;
  case 'apakah': 
 if (!q) return reply(`Contoh ${prefix + command} pandji gumilang pedofil`)
 sock.sendMessage(from, { text: `${getRandom(['Ya', 'Mungkin iya', 'Mungkin', 'Mungkin tidak', 'Tidak', 'Tidak mungkin'])}`}, { quoted: ftroli })
 break
 
case 'owner':
  const vcard =
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    `FN:${ownerName}\n` +
    `ORG:${botName};\n` +
    `X-ABLabel: Kyoto\n`+
    `X-ABLabel: Dim\n`+
    `TEL;type=MSG;type=CELL;type=VOICE;waid=${ownerNumber[ownerNumber.length - 1].split('@')[0]}:+${ownerNumber[ownerNumber.length - 1].split('@')[0]}\n` +
    'END:VCARD';
  sock.sendMessage(from, {
    contacts: {
      displayName: ownerName,
      contacts: [{ vcard }]
    }
  });
  break;
case 'shortlink':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  const shortUrl = await shortlink(q);
  const urlqr = await axios.get(`http://xyros.my.id/api/qrgen?keyword=${shortUrl}`)
  sock.sendMessage(from, {
    image: { url: urlqr.data.result },
    caption: `${shortUrl}`
  }) 
  break;
case 'ssweb':
  if (!q) {
    return reply(`Contoh:\n${prefix + command} URL`);
  }
  fakeSend(`\nTunggu sebentar..\n`);
  sock.sendMessage(from, {
    image: { url: `https://image.thum.io/get/width/1900/crop/1000/fullpage/${q}` },
    caption: `🥰`
  }, { quoted: msg });
  break;
case 'gimage':
if (!q) return reply(` x ${prefix}gimage walter white`)
    const xzzx = await googleImage(q)
    await sock.sendMessage(from, { image: { url: `${getRandom(xzzx)}`, caption: `Nih`}},{ quoted: ftroli })
    break;
case 'sticker':
case 'stiker':
case 's':
  if (!(isImage || isQuotedImage || isVideo || isQuotedVideo)) {
    return reply('Reply media!');
  }
  let stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', ''));
  let stickerStream = new PassThrough();
  if (isImage || isQuotedImage) {
    ffmpeg(stream)
      .on('start', function (cmd) {
        console.log(`Started: ${cmd}`);
      })
      .on('error', function (err) {
        console.log(`Error: ${err}`);
      })
      .on('end', function () {
        console.log('Finish');
      })
      .addOutputOptions([
        '-vcodec',
        'libwebp',
        '-vf',
        "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
      ])
      .toFormat('webp')
      .writeToStream(stickerStream);
    sock.sendMessage(from, { sticker: { stream: stickerStream } });
  } else if (isVideo || isQuotedVideo) {
    ffmpeg(stream)
      .on('start', function (cmd) {
        console.log(`Started: ${cmd}`);
      })
      .on('error', function (err) {
        console.log(`Error: ${err}`);
      })
      .on('end', async () => {
        sock.sendMessage(from, { sticker: { url: `./${sender}.webp` } }).then(() => {
          fs.unlinkSync(`./${sender}.webp`);
          console.log('Success');
        });
      })
      .addOutputOptions([
        '-vcodec',
        'libwebp',
        '-vf',
        "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
      ])
      .toFormat('webp')
      .save(`./${sender}.webp`);
  }
  break;
case 'tsunami':
try {
      const data = await dl.tsunami();
      let response = 'Latest tsunami information:\n\n';
      for (const tsunami of data) {
        response += `Date: ${tsunami.date}\n`;
        response += `Time: ${tsunami.time}\n`;
        response += `Location: ${tsunami.location}\n`;
        response += `Magnitude: ${tsunami.magnitude}\n`;
        response += `Depth: ${tsunami.depth}\n`;
        response += `Info: ${tsunami.info}\n\n`;
      }
      // Send the response message
      reply(response);
    } catch (error) {
      // Handle any errors
      console.error('Error:', error.message);
      reply('An error occurred while fetching tsunami data.');
    }
    break;
case 'waifu':
if (!q) return reply(`Wait.. ${pushname}`)
  try {
    const response = await axios.get('https://waifu.pics/api/sfw/waifu');
    const data = response.data.url;
    sock.sendMessage(from, {
    image: { url: data },
    caption: `🥰`
  }, { quoted: msg });
  } catch (error) {
    console.error('Error:', error);
    reply('Maaf, terjadi kesalahan dalam memuat gambar waifu.');
  }
  break;
case 'wpsearch':
case 'wattpad':
  if (!q) return reply(`Contoh:\n${prefix + command} query`);
    const data = await searchWattpad(q);
    if (data) {
    const { desk, gambar, status, title } = data;
    const result = `
      *${title}*
      ${desk}
      Status: ${status}
      Gambar: ${gambar}
    `;
    sock.sendMessage(from, {
    caption: result,
    image: {
      url: `${gambar}`
    }
  }, { quoted: msg });
  } else {
    reply('Maaf, terjadi kesalahan');
  }
  break;
case 'zorosearch':
  if (!q) {
    reply(`Contoh:\n${prefix + command} Naruto`);
    break;
  }
 //Converter
 case 'toimg':
  if (!/webp/.test(q)) throw `balas stiker dengan perintah *${usedPrefix + command}*`
  let media = await m.quoted.download()
  let out = Buffer.alloc(0)
  if (/webp/.test(q)) {
    out = await webp2png(media)
  }
  await sock.sendMessage(from, { caption: `Done`, image: out, contextInfo:{forwardingScore: 999999, isForwarded: true}})
  break;
  case 'xdel':
  sock.sendMessage(msg.chat, { delete: { remoteJid: msg.chat, fromMe: true, id: msg.quoted.id, participant: msg.quoted.sender } })
break;
case 'afk': {
let user = global.db.data.users[sender]
user.afkTime = +new Date
user.afkReason = text
fakeSend(` *${pushname}* Telah Afk${text ? ': ' + text : ''}`)
  }
  break;
  const ress = await zoro(q);
  if (ress.length > 0) {
    let replyMsg = "Hasil pencarian:\n"; 
    for (let i = 0; i < ress.length; i++) {
      const { title, type, duration, link } = ress[i];
      replyMsg += `\n${i + 1}. ${title}\nType: ${type}\nDuration: ${duration}\nLink: ${link}\n`;
    }
    reply(replyMsg);
  } else {
    sock.sendMessage(from, "Tidak ada hasil yang ditemukan.", msg);
  }
  break;
  default:
  if (!isOwner) return
if (body.startsWith('>')) {
  try {
    let value = await (async () => { return await eval(body.slice(1)); })();
    await reply(format(value));
  } catch (e) {
    await reply(e.toString());
  }
}

  if (!isOwner) return
if (body.startsWith('<')) {
  try {
    let value = await eval(`(async () => { return ${body.slice(1)} })()`);
    await reply(format(value));
  } catch (e) {
    await reply(e);
  }
}
       }
   })
   }
start();

/** Thanks For USing **/
