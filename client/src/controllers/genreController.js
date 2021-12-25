class genreController {
    home(req, res, next) {
        res.render('genre/home', {
            layout: 'genre',
            css: ['style', 'base'],
            js: ['typePage'],
        })
    }

}

module.exports = new genreController();