class chartController {
    home(req, res, next) {
        res.render('chart/home', {
            layout: 'chart',
            css: ['style', 'base'],
            js: ['chartPage'],
        })
    }

}

module.exports = new chartController();