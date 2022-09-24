var router = require('express').Router();

const API_ROUTES = process.env.API_ROUTES;
module.exports = app => {
    const link = require('./../controllers/link');

    const apiEndpoint = '/shorten';

    router.get(apiEndpoint, link.getShortUrl);

    router.post(apiEndpoint, link.createShortLink);

    app.use(API_ROUTES, router);
}