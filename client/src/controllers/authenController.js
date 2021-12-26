
class AuthenController {
    home(req, res, next) {
        res.render('authen/home', {
            layout: 'authen'
        })
    }
    return;
}

module.exports = new AuthenController();
