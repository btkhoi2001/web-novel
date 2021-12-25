
class AuthenController {
    home(req, res, next) {
        res.render('authen/home', {
            layout: 'authen'
        })
    }

}

module.exports = new AuthenController();
