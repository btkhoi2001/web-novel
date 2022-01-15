const authenRoute = require('./authenRoute');
const chartRoute = require('./chartRoute');
const genreRoute = require('./genreRoute');
const accountRoute = require('./accountRoute');
const novelIntroRoute = require('./novelIntroRoute');
const adminRoute = require('./adminRoute');

function route(app) {

    app.use('/authen', authenRoute);

    app.use('/admin', adminRoute);

    app.use('/chart', chartRoute);

    app.use('/genre', genreRoute);

    app.use('/novel', novelIntroRoute);

    app.use('/account', accountRoute);

    app.get('/home', (req, res, next) => {
        res.render('home', {
            layout: 'homePage',
            css: ['HomePage', 'base', 'responsive'],
            js: ['HomePage','isSignedIn'],
        })
    });

    //Error Page
    app.use(function(req, res, next){
        res.status(404);
      
        if (req.accepts('html')) {
            res.render('error/home', { 
                url: req.url,
                layout: 'homePage',
                css: ['ErrorPage', 'base', 'responsive'],
                js: ['ErrorPage','isSignedIn'],
            });
          return;
        }
    });
}

module.exports = route;
