const authenRoute = require('./authenRoute');
const chartRoute = require('./chartRoute');
const genreRoute = require('./genreRoute');

function route(app) {

    app.use('/authen', authenRoute);

    app.use('/chart', chartRoute);

    app.use('/genre', genreRoute);
   
    app.get('/', (req, res, next) => {
        res.render('home', {
            layout: 'homePageNotSignIn',
            css: ['HomePage', 'base', 'responsive'],
            js: ['HomePage'],
        })
    });
}

module.exports = route;
