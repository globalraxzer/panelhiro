const axios = require('axios');
const BodyForm = require('form-data');
const { fromBuffer } = require('file-type');
const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto')
const chalk = require('chalk')
const cheerio = require('cheerio');

module.exports = {
type: 'sticker',
command: ['brat'],
operate: async (context) => {
    const {
    Yuta,
    m,
    text,
    q,
    prefix,
    command,
    replygcyuta,
    leogg,
    quoted,
    sendReaction,
    limituser,
    limitAbis,
    useLimit,
    registered,
    getBuffer,
    IsReg,
    fetchJson,
    mime } = context;

async function tmpfiles(buffer) {
  const { ext, mime } = (await fromBuffer(buffer)) || {};
  const form = new BodyForm();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
  try {
    const { data } = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
    });   
    //console.log(data);  
    const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url);
    return `https://tmpfiles.org/dl/${match[1]}`;
  } catch (error) {
    throw error;
  }
}

try {
if (!text) return replygcyuta("Masukan Text")
let ha = await getBuffer(`https://mxmxk-helper.hf.space/brat?text=${text}`)
let mlist = await tmpfiles(ha)
let get = await getBuffer(mlist)
await Yuta.sendVideoAsSticker(m.chat, get, leogg, { packname: global.packname, author: global.author })
} catch (e) {
m.reply(`error kak result err: ${e}`)
}
}
}