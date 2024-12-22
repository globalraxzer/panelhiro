const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
type: 'download',
command: ['Instagramvideo','igvd','igft','instagramfoto','igimg','instagramimage'],
operate: async (context) => {
    const { Yuta, m, text, q, prefix, command, replygcyuta, leogg, sendReaction, limituser, limitAbis, useLimit, registered, IsReg, fetchJson, readmore } = context;

class Fuck extends Error {
    constructor(message) {
        super(message);
        this.name = "Fuck";
    }
}

class API {
    constructor(search, prefix) {
        this.api = {
            search: search,
            prefix: prefix
        };
    }

    headers(custom = {}) {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authority': 'retatube.com',
            'accept': '*/*',
            'accept-language': 'id-MM,id;q=0.9',
            'hx-current-url': 'https://retatube.com/',
            'hx-request': 'true',
            'hx-target': 'aio-parse-result',
            'hx-trigger': 'search-btn',
            'origin': 'https://retatube.com',
            'referer': 'https://retatube.com/',
            'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'user-agent': 'Postify/1.0.0',
            ...custom
        };
    }

    handleError(error, context) {
        const errors = error.response ? JSON.stringify(error.response.data || error.message) : error.message;
        console.error(`[${context}] Error:`, errors);
        throw new Fuck(errors);
    }

    getEndpoint(name) {
        return this.api[name];
    }
}

class RetaTube extends API {
    constructor() {
        super('https://retatube.com/api/v1/aio/search', 'https://retatube.com/api/v1/aio/index?s=retatube.com');
    }

    async getPrefix() {
        try {
            const response = await axios.get(this.getEndpoint('prefix'));
            return this.scrapePrefix(response.data); 
        } catch (error) {
            this.handleError(error);
        }
    }

    scrapePrefix(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const prefix = $('#aio-search-box input[name="prefix"]').val();
        return prefix;
    }

    async fetch(videoId) {
        try {
            const prefix = await this.getPrefix();
            const response = await axios.post(this.getEndpoint('search'), `prefix=${encodeURIComponent(prefix)}&vid=${encodeURIComponent(videoId)}`, { headers: this.headers() });
            return this.parseHtml(response.data);
        } catch (error) {
            this.handleError(error);
        }
    }

    parseHtml(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const result = {
            title: '',
            downloadLinks: []
        };

        $('.col').each((_, element) => {
            const titles = $(element).find('#text-786685718 strong').first();
            result.title = titles.text().replace('Title：', '').trim() || result.title;

            $(element).find('a.button.primary').each((_, linkElement) => {
                const linkUrl = $(linkElement).attr('href');
                if (linkUrl !== 'javascript:void(0);') {
                    result.downloadLinks.push({
                        quality: $(linkElement).find('span').text(),
                        url: linkUrl
                    });
                }
            });
        });

        return result;
    }

    async scrape(links) {
        try {
            return await this.fetch(links);
        } catch (error) {
            console.error(`${error.message}`);
            throw error;
        }
    }
}

if (command === ('Instagramvideo') || command === ('igvd')) {
if (!registered) return IsReg() 
if (!text.includes('www.instagram.com')) return replygcyuta(`• *Example :* .${command} https://www.instagram.com/xxxxxxx/`)
if (limituser < 1) return limitAbis();
useLimit(1)
let h = new RetaTube()
let video = await h.scrape(text)
let videoig = {
  video: { url: video.downloadLinks[0].url },
   fileName: `Instagram.mp4`,
 caption: 'Instagram Downloader',
 contextInfo: {
 mentionedJid: [m.sender], 
 isForwarded: true, 
 forwardedNewsletterMessageInfo: {
 newsletterJid: saluran,
 newsletterName: `TiktokDl By: ${ownername}`, 
 serverMessageId: -1
},
 businessMessageForwardInfo: { businessOwnerJid: Yuta.decodeJid(Yuta.user.id) },
},
}
await Yuta.sendMessage(m.chat, videoig, { quoted: leogg })

} else if (command === ('igft') || command === ('instagramfoto') || command === ('igimg') || command === ('instagramimage')) {
if (!registered) return IsReg() 
if (!text.includes('www.instagram.com')) return replygcyuta(`• *Example :* .${command} https://www.instagram.com/xxxxxxx/`)
if (limituser < 1) return limitAbis();
useLimit(1)
let h = new RetaTube()
let fotoget = await h.scrape(text)

for (let i = 0; i < fotoget.downloadLinks.length; i++) {
let image = fotoget.downloadLinks[i];
await Yuta.sendMessage(m.chat, { image: { url: image.url }, caption: i === 0 ? `${fotoget.title}` : '' }, { quoted: m });
}

}
}
}