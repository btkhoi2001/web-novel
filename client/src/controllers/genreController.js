
class genreController {

    home(req, res, next) {
        const genreID =  req.params.id;
        res.render('genre/home', {
            layout: 'genre',
            css: ['typePage', 'base'],
            js: ['typePage','isSignedIn'],
            genreId: genreID,
            
        })
        return;
    }

}

module.exports = new genreController();