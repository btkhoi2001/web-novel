const authenRoute = require('./authenRoute');
const chartRoute = require('./chartRoute');

function route(app) {

    app.use('/authen', authenRoute);

    app.use('/chart', chartRoute);
   
    app.get('/', (req, res, next) => {
        res.render('home', {
            layout: 'homePageNotSignIn',
            css: ['HomePage', 'base', 'responsive'],
            js: ['HomePage'],
        })
    });
}

module.exports = route;
