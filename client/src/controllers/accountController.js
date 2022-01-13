
class accountController {
    home(req, res, next) {
        res.render('account/home', {
            layout: 'userPage',
            css: ['UserPage', 'base'],
            js: ['isSignedIn', 'header', 'requireSignedIn', 'userPage'],
          
        })
        return;
    }

    follow(req, res, next) {
        res.render('account/home', {
            layout: 'userPage',
            css: ['UserPage', 'base'],
            js: ['isSignedIn', 'follow', 'header', 'requireSignedIn', 'userPage'],
          
        })
        return;
    }

    bookmark(req, res, next) {
        res.render('account/home', {
            layout: 'userPage',
            css: ['UserPage', 'base'],
            js: ['isSignedIn', 'bookmark', 'header', 'requireSignedIn', 'userPage'],
          
        })
        return;
    }
}

module.exports = new accountController();