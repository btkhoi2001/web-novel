class chartController {
    home(req, res, next) {
        res.render('chart/home', {
            layout: 'chart',
            css: ['style', 'base'],
            js: ['chartPage'],
        })
        return;
    }
    
    homeSignedIn(req, res, next) {
        res.render('chart/home', {
            layout: 'chartSignedIn',
            css: ['chartPageSignedIn', 'base'],
            js: ['chartPageSignedIn'],
        })
        return;
    }
}

module.exports = new chartController();