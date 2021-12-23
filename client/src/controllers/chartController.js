class chartController {
    home(req, res, next) {
        res.render('chart/home', {
            layout: 'chart',
            css: ['style', 'base'],
        })
    }

}

module.exports = new chartController();