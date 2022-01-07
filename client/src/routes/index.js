const authenRoute = require('./authenRoute');
const chartRoute = require('./chartRoute');
const genreRoute = require('./genreRoute');
const chartSignedInRoute = require('./chartSignedInRoute');
const genreSignedInRoute = require('./genreSignedInRoute');

function route(app) {

    app.use('/authen', authenRoute);

    app.use('/chart', chartRoute);
    app.use('/chartS', chartSignedInRoute);

    app.use('/genre', genreRoute);
    app.use('/genreS', genreSignedInRoute);
   
    app.get('/', (req, res, next) => {
        res.render('home', {
            layout: 'homePageNotSignedIn',
            css: ['HomePage', 'base', 'responsive'],
            js: ['HomePage'],
        })
    });

    app.get('/home', (req, res, next) => {
        res.render('home', {
            layout: 'homePageSignedIn',
            css: ['homePageSignedIn', 'base', 'responsive'],
            js: ['homePageSignedIn'],
        })
    });
}

module.exports = route;
