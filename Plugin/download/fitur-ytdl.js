module.exports = {
type: 'download',
command: ['ytmp4','ytv','ytvideo','ytmp3','yta','ytaudio'],
operate: async (context) => {
    const { Yuta, m, text, q, prefix, command, replygcyuta, leogg, sendReaction, limituser, limitAbis, useLimit, registered, IsReg, fetchJson } = context;
const yts = require('yt-search');
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs');
const chalk = require('chalk');

const cdn = () => Math.floor(Math.random() * 11) + 51;
 
const headers = {
    accept: '*/*',
    origin: 'https://ytshorts.savetube.me',
    referer: 'https://ytshorts.savetube.me/',
    'user-agent': 'Postify/1.0.0',
};
 
const fetch = async (url) => {
    const link = url.replace('{cdn}', cdn());
    try {
        const { data } = await axios.get(link, {
            headers: { ...headers, authority: `cdn${cdn()}.savetube.su` }
        });
        return data;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};
 
const audioQualities = { 1: '32', 2: '64', 3: '128', 4: '192' };
const videoQualities = { 1: '144', 2: '240', 3: '360', 4: '480', 5: '720', 6: '1080', 7: '1440', 8: '2160' };
 
const progressBar = (progress) => {
    const total = 100;
    const complete = Math.floor(progress / 2);
    const incomplete = total / 2 - complete;
    const bar = '█'.repeat(complete) + ' '.repeat(incomplete);
    process.stdout.write(`\rProgress: [${bar}] ${progress}%   `);
};
 
const savetube = {
    info: async (url, type, qualityKey) => {
        try {
            const inpo = await fetch(`https://cdn{cdn}.savetube.su/info?url=${encodeURIComponent(url)}`);
            const { key, duration, durationLabel, fromCache, id, thumbnail, title, titleSlug, url: videoUrl, thumbnail_formats } = inpo.data;
            const quality = type === 'audio' ? audioQualities[qualityKey] : videoQualities[qualityKey];
            if (!quality) throw new Error('❌ Opsi quality tidak valid!');
            const dlRes = await savetube.dl(key, type, quality);
            return {
                link: dlRes.data.downloadUrl,
                duration,
                durationLabel,
                fromCache,
                id,
                thumbnail,
                title,
                titleSlug,
                videoUrl,
                thumbnail_formats,
                quality,
                type
            };
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    },
    
    dl: async (key, type, quality) => {
        const api = `https://cdn${cdn()}.savetube.su/download/${type}/${quality}/${key}`;
        console.log('🌀 Fetching link...');
        for (let i = 0; i <= 100; i += 5) {
            progressBar(i);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log(); 
        try {
            const { data } = await axios.get(api, { headers: headers });
            return data;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
};



class yt {
    /**
     * Mengunduh video dari YouTube dalam format MP4 atau MP3.
     * @param {string} url - URL video YouTube yang valid.
     * @param {string} downtype - Tipe unduhan: 'mp4' atau 'mp3'.
     * @param {string} vquality - Kualitas video atau audio:
     *      - Untuk 'mp4': '144', '240', '360', '720', '1080'
     *      - Untuk 'mp3': '128', '360'
     * @returns {Promise<string>} - URL unduhan dari API.
     */
    async dl(url, downtype, vquality) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=|music\?v=|embed\/|v\/|.+\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);

        if (!match) {
            throw new Error('URL tidak valid. Silakan masukkan URL YouTube yang benar.');
        }

        const videoId = match[1];
        const data = new URLSearchParams({ videoid: videoId, downtype, vquality });

        try {
            const response = await axios.post('https://api-cdn.saveservall.xyz/ajax-v2.php', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            });
            return response.data
        } catch (error) {
            throw new Error('Terjadi kesalahan: ' + error.message);
        }
    }

    async result(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=|music\?v=|embed\/|v\/|.+\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);

        if (!match) {
            throw new Error('URL tidak valid. Silakan masukkan URL YouTube yang benar.');
        }

        const videoId = match[1];
        const data = new URLSearchParams({ videoid: videoId, downtype, vquality });

        try {
            const response = await axios.post('https://api-cdn.saveservall.xyz/ajax-v2.php', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            });
            return response.data
        } catch (error) {
            throw new Error('Terjadi kesalahan: ' + error.message);
        }
    }
    
    /**
     * Mengambil link unduhan untuk kedua format MP4 dan MP3.
     * @param {string} url - URL video YouTube yang valid.
     * @param {Object} qualities - Kualitas unduhan untuk masing-masing format.
     * @param {string} qualities.mp4 - Kualitas untuk MP4.
     * @param {string} qualities.mp3 - Kualitas untuk MP3.
     * @returns {Promise<Object>} - Objek berisi URL unduhan MP4 dan MP3.
     */
    async download(url, { mp4 = '360', mp3 = '128' } = {}) {
        try {
            let h = new yt()
            const mp4Link = await h.dl(url, 'mp4', mp4);
            const mp3Link = await h.dl(url, 'mp3', mp3);
            return { mp4: mp4Link, mp3: mp3Link };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Mencari video YouTube berdasarkan kata kunci.
     * @param {string} query - Kata kunci pencarian.
     * @returns {Promise<Object>} - Hasil pencarian dari API.
     */
    static async search(query) {
        const url = `https://api.flvto.top/@api/search/YouTube/${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    'Origin': 'https://keepvid.online',
                    'Referer': 'https://keepvid.online/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                }
            });
            
            return response.data.items.map(item => ({
                ...item,
                url: `https://www.youtube.com/watch?v=${item.id}`
            }));
        } catch (error) {
            throw new Error('Gagal mengambil hasil pencarian: ' + error.message);
        }
    }
}

let saversaveall = new yt()

const formatAudio = [ 'mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav', '4k' ];
const formatVideo = [ '360', '480', '720', '1080', '1440' ];

const ddownr = {
  download: async (url, format) => {
    try {
      const response = await axios.get(`https://p.oceansaver.in/ajax/download.php?copyright=0&format=${format}&url=${url}`, {
        headers: {
          'User-Agent': 'MyApp/1.0',
          'Referer': 'https://ddownr.com/enW7/youtube-video-downloader'
        }
      });
    
      const data = response.data;
      const media = await ddownr.cekProgress(data.id);
      return {
        success: true,
        format: format,
        title: data.title,
        thumbnail: data.info.image,
        downloadUrl: media
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.message };
    }
  },
  cekProgress: async (id) => {
    try {
      const progressResponse = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
        headers: {
          'User-Agent': 'MyApp/1.0',
          'Referer': 'https://ddownr.com/enW7/youtube-video-downloader'
        }
      });

      const data = progressResponse.data;

      if (data.progress === 1000) {
        return data.download_url;
      } else {
        console.log('Masih belum selesai wak 😂, sabar gw cek lagi...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return ddownr.cekProgress(id);
      }
      return await ddownr.cekProgress(id);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      return { success: false, message: error.message };
    }
  }
}

/*
 - Fungsi Download
*/
const downloadMp3 = async (Link) => {
const vidId = ((_a = /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|embed\/|v\/|m\/|watch\?(?:[^=]+=[^&]+&)*?v=))([^"&?\/\s]{11})/gm.exec(Link)) === null || _a === void 0 ? void 0 : _a[1]) || "";
let convert = await yts({ videoId: vidId, hl: 'id', gl: 'ID' })

replygcyuta('Sound Lagi Loading Sabar....⏳')
try {
let hasil = await ddownr.download(Link,"mp3")
await Yuta.sendMessage(m.chat, {
audio: {
url: hasil.downloadUrl
},
mimetype: 'audio/mpeg',
contextInfo: {
      isForwarded: true,
     forwardingScore: 99999,
    externalAdReply: {
      showAdAttribution: true,
      title: convert.title,
      mediaType: 1,
      previewType: 1,
      body: convert.author.name,
      //previewType: "PHOTO",
      thumbnailUrl: convert.thumbnail,
      renderLargerThumbnail: true,
      mediaUrl: convert.url,
      sourceUrl: convert.url
    }
  }
}, { quoted: leogg })
replygcyuta('Done ✅')
sendReaction("✅")
} catch (err) {
try {
const hasil = await savetube.info(Link,"audio","4")
await Yuta.sendMessage(m.chat, {
audio: {
url: hasil.link
},
mimetype: 'audio/mpeg',
contextInfo: {
      isForwarded: true,
     forwardingScore: 99999,
    externalAdReply: {
      showAdAttribution: true,
      title: convert.title,
      mediaType: 1,
      previewType: 1,
      body: convert.author.name,
      //previewType: "PHOTO",
      thumbnailUrl: convert.thumbnail,
      renderLargerThumbnail: true,
      mediaUrl: convert.url,
      sourceUrl: convert.url
    }
  }
}, { quoted: leogg })
replygcyuta('Done ✅')
sendReaction("✅")
} catch (err) {
try {
let { mp3, mp4 } = await saversaveall.download(Link)
let leo = {
    audio: { url: mp3.url },
    mimetype:'audio/mpeg',
    contextInfo: {
      isForwarded: true,
     forwardingScore: 99999,
    externalAdReply: {
      showAdAttribution: true,
      title: convert.title,
      mediaType: 1,
      previewType: 1,
      body: convert.author.name,
      //previewType: "PHOTO",
      thumbnailUrl: convert.thumbnail,
      renderLargerThumbnail: true,
      mediaUrl: convert.url,
      sourceUrl: convert.url
    }
  }
};
 await Yuta.sendMessage(m.chat, leo, { quoted: leogg });
replygcyuta('Done ✅')
sendReaction("✅")
} catch (err) {
sendReaction("❌")
}}}
}

const downloadMp4 = async (Link) => {
const vidId = ((_a = /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|embed\/|v\/|m\/|watch\?(?:[^=]+=[^&]+&)*?v=))([^"&?\/\s]{11})/gm.exec(Link)) === null || _a === void 0 ? void 0 : _a[1]) || "";
let convert = await yts({ videoId: vidId, hl: 'id', gl: 'ID' })

replygcyuta('Video Lagi Loading Sabar....⏳')
let captions = `=〆 ᴊᴜᴅᴜʟ : ${convert.title}\n`
captions += `=〆 ᴅᴜʀᴀᴛɪᴏɴ : ${convert.timestamp}\n`
captions += `=〆 ᴠɪᴇᴡᴇʀ𝘴 : ${convert.views}\n`
captions += `=〆 ᴛᴀɴɢɢᴀʟ ᴜᴘʟᴏᴀᴅ : ${convert.ago}\n`
captions += `=〆 ᴀᴜᴛʜᴏʀ : ${convert.author.name}\n`
captions += `=〆 ᴅᴇ𝘴ᴄʀɪᴘᴛɪᴏɴ : ${convert.description}\n`
captions += `=〆 ᴜʀʟ : ${convert.url}`

try {
let hasil = await ddownr.download(Link,"720")
await Yuta.sendMessage(m.chat, {
video: {
url: hasil.downloadUrl
},
caption: captions
}, { quoted: leogg })
replygcyuta('Done ✅')
sendReaction("✅")
} catch (err) {
try {
const hasil = await savetube.info(Link,"video","5")
await Yuta.sendMessage(m.chat, {
video: {
url: hasil.link
},
caption: captions
}, { quoted: leogg })
replygcyuta('Done ✅')
sendReaction("✅")
} catch (e) {
try {
let { mp3, mp4 } = await saversaveall.download(Link)
await Yuta.sendMessage(m.chat, { 
video: {
url: mp4.url
},
caption: captions 
}, { quoted: leogg })
replygcyuta('Done ✅')
sendReaction("✅")
} catch (err) {
sendReaction("❌")
}}}
}

/*
 - Command
*/
if (command === (`ytmp4`) || command === (`ytv`) || command === (`ytvideo`)) {
if (!registered) return IsReg() 
replygcyuta(mess.loading)
if (limituser < 1) return limitAbis();
useLimit(1)
if (!text.includes('youtu')) return replygcyuta(`• *Example :* .${command} https://www.youtube.com/xxxxxxx`)

sendReaction("⏳")
const vidId = ((_a = /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|embed\/|v\/|m\/|watch\?(?:[^=]+=[^&]+&)*?v=))([^"&?\/\s]{11})/gm.exec(text)) === null || _a === void 0 ? void 0 : _a[1]) || "";
let convert = await yts({ videoId: vidId, hl: 'id', gl: 'ID' })

let capt = `╭──── *[ ᴅᴏᴡɴʟᴏᴀᴅ - ʏᴛᴍᴘ4 ]* ──々\n`
capt += `│ =〆 ᴊᴜᴅᴜʟ : ${convert.title}\n`
capt += `│ =〆 ᴇxᴛ : sᴇᴀʀᴄʜ\n`
capt += `│ =〆 ɪᴅ : ${convert.videoId}\n`
capt += `│ =〆 ᴅᴜʀᴀᴛɪᴏɴ : ${convert.timestamp}\n`
capt += `│ =〆 ᴠɪᴇᴡᴇʀ𝘴 : ${convert.views}\n`
capt += `│ =〆 ᴛᴀɴɢɢᴀʟ ᴜᴘʟᴏᴀᴅ : ${convert.ago}\n`
capt += `│ =〆 ᴀᴜᴛʜᴏʀ : ${convert.author.name}\n`
capt += `│ =〆 ᴄʜᴀɴɴᴇʟ : ${convert.author.url}\n`
capt += `│ =〆 ᴅᴇ𝘴ᴄʀɪᴘᴛɪᴏɴ : ${convert.description}\n`
capt += `│ =〆 ᴜʀʟ : ${convert.url}\n`
capt += `╰─々`

let leogz = {
  image: { url: convert.thumbnail },
  caption: capt,
  contextInfo: {
   mentionedJid: [m.sender], 
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
     newsletterJid: saluran,
     serverMessageId: -1,
     newsletterName: `Yt Downloader By: ${ownername}`
    }
  }
}
await Yuta.sendMessage(m.chat, leogz, { quoted: leogg });
sendReaction("✅")
await downloadMp4(convert.url)

} else if (command === (`ytmp3`) || command === (`yta`) || command === (`ytaudio`)) {
if (!registered) return IsReg() 
replygcyuta(mess.loading)
if (limituser < 1) return limitAbis();
useLimit(1)
if (!text.includes('youtu')) return replygcyuta(`• *Example :* .${command} https://www.youtube.com/xxxxxxx`)

sendReaction("⏳")
const vidId = ((_a = /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|embed\/|v\/|m\/|watch\?(?:[^=]+=[^&]+&)*?v=))([^"&?\/\s]{11})/gm.exec(text)) === null || _a === void 0 ? void 0 : _a[1]) || "";
let convert = await yts({ videoId: vidId, hl: 'id', gl: 'ID' })

let capt = `╭──── *[ ᴅᴏᴡɴʟᴏᴀᴅ - ʏᴛᴍᴘ3 ]* ──々\n`
capt += `│ =〆 ᴊᴜᴅᴜʟ : ${convert.title}\n`
capt += `│ =〆 ᴇxᴛ : sᴇᴀʀᴄʜ\n`
capt += `│ =〆 ɪᴅ : ${convert.videoId}\n`
capt += `│ =〆 ᴅᴜʀᴀᴛɪᴏɴ : ${convert.timestamp}\n`
capt += `│ =〆 ᴠɪᴇᴡᴇʀ𝘴 : ${convert.views}\n`
capt += `│ =〆 ᴛᴀɴɢɢᴀʟ ᴜᴘʟᴏᴀᴅ : ${convert.ago}\n`
capt += `│ =〆 ᴀᴜᴛʜᴏʀ : ${convert.author.name}\n`
capt += `│ =〆 ᴄʜᴀɴɴᴇʟ : ${convert.author.url}\n`
capt += `│ =〆 ᴅᴇ𝘴ᴄʀɪᴘᴛɪᴏɴ : ${convert.description}\n`
capt += `│ =〆 ᴜʀʟ : ${convert.url}\n`
capt += `╰─々`

let leogz = {
  image: { url: convert.thumbnail },
  caption: capt,
  contextInfo: {
   mentionedJid: [m.sender], 
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
     newsletterJid: saluran,
     serverMessageId: -1,
     newsletterName: `Yt Downloader By: ${ownername}`
    }
  }
}
await Yuta.sendMessage(m.chat, leogz, { quoted: leogg });

sendReaction("✅")
await downloadMp3(convert.url)
}
}
}