const shortid = require('shortid');
const db = require('./../models');
const Link = db.link;

const BASE_URL = process.env.BASE_URL;
const ERROR_MESSAGE_500 = 'Something wrong in the server.';
const REGEX_URL_HTTP = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6}|\:[Z0-9]{1,8})\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/


exports.createShortLink = async (req, res) => {
    try {
        let { url } = req.body;


        if (!url) return res.json({error: 'Requires a url field.'});
        
        const newUrl = 'http://'+ url;

        if ( ( !(url.match(REGEX_URL_HTTP)?.length || 
        newUrl.match(REGEX_URL_HTTP)?.length) ) ) return res.status(406).send(
            {error: 'Invalid URL'}
        );
        
        if (newUrl.match(REGEX_URL_HTTP)?.length) url = newUrl;

        const urlCode = shortid.generate();
        const foundLink = await Link.findOne({longUrl : url});

        if (foundLink) return res.status(200).send({
            success: true,
            data: foundLink
        });

        const shortUrl = BASE_URL + '/' + urlCode;
        const data = await new Link({
            longUrl: url,
            shortUrl,
            urlCode,
            active: true,
        }).save();

        if (!data) return res.status(500).send({error: 'Unable to generate shorten URL!'})

        res.status(200).send({
            success: true, 
            message: 'Shorten URL is generated.',
            data,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error: ERROR_MESSAGE_500})
    }
}


exports.getShortUrl = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) return res.status(400).send({error: 'Bad request!'})

        const link = await Link.findOne({urlCode: code});

        if (!link) return res.status(404).send({error: 'Not found!'});

        res.status(200).send({success: true, data: link});

    } catch (error) {
        console.log(error);
        res.status(500).send({error: ERROR_MESSAGE_500})
    }
}