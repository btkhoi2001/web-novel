class chartController {
    home(req, res, next) {
        res.render('chart/home', {
            layout: 'homePage',
            css: ['chartPage', 'base'],
            js: ['chartPage', 'isSignedIn'],
            
        })
        return;
    }
}

module.exports = new chartController();