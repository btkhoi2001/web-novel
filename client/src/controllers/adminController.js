
class adminController {

    novel(req, res, next) {
      
        res.render('admin/novel', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin',],
        })
        return;
    }

    novelCreate(req, res, next) {
      
        res.render('admin/novelCreate', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin','typehead', 'bootstrap-tagsinput', 'app'],
        })
        return;
    }

    user(req, res, next) {
      
        res.render('admin/user', {
            layout: 'admin',
            css: ['admin', 'responsive'],
            js: ['admin',],
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
            js: ['admin',],
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