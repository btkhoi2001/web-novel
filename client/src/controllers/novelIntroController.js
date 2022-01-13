
class novelIntroController {

    home(req, res, next) {
        const novelID =  req.params.id;
        res.render('novelIntro/home', {
            layout: 'novelIntro',
            css: ['novelIntro', 'novelIntroResponsive'],
            js: ['header', 'isSignedIn'],
            jsIn: ['Fetch', 'Rating', 'ReadMore', 'ShowEmoticon', 'comment'],
            novelID: novelID,
            
        })
        return;
    }

}

module.exports = new novelIntroController();