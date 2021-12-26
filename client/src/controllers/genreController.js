
class genreController {
    home(req, res, next) {
        const genreID =  req.params.id;
       
        res.render('genre/home', {
            layout: 'genre',
            css: ['style', 'base'],
            js: ['typePage'],
            genreId: genreID,
        })
        return;
    }

}

module.exports = new genreController();