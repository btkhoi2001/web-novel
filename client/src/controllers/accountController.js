
class accountController {
    home(req, res, next) {
        res.render('account/home', {
            layout: 'homePage',
            css: ['UserPage', 'base'],
            js: ['requireSignedIn', 'UserPage', 'isSignedIn'],
          
        })
        return;
    }
}

module.exports = new accountController();