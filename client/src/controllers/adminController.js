
class adminController {

    novel(req, res, next) {
      
        res.render('admin/novel', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin', 'FetchNovel'],
        })
        return;
    }

    novelCreate(req, res, next) {
      
        res.render('admin/novelCreate', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin','typehead', 'bootstrap-tagsinput','FetchGenre' , 'app'],
        })
        return;
    }

    user(req, res, next) {
      
        res.render('admin/user', {
            layout: 'admin',
            css: ['admin', 'responsive', 'modal'],
            js: ['admin', 'FetchUser'],
        })
        return;
    }

    userCreate(req, res, next) {
      
        res.render('admin/userCreate', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin','typehead', 'bootstrap-tagsinput', 'app'],
        })
        return;
    }

    genre(req, res, next) {
      
        res.render('admin/genre', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin', 'FetchGenre'],
        })
        return;
    }

    genreCreate(req, res, next) {
      
        res.render('admin/genreCreate', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin','typehead', 'bootstrap-tagsinput', 'app'],
        })
        return;
    }

}

module.exports = new adminController();