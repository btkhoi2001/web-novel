class novelIntroController {
    home(req, res, next) {
        const novelID = req.params.id;
        res.render("novelIntro/home", {
            layout: "novelIntro",
            css: ["novelIntro", "novelIntroResponsive"],
            js: ["header", "isSignedIn"],
            jsIn: ["Fetch", "Rating", "ReadMore", "ShowEmoticon", "comment"],
            novelID: novelID,
        });
        return;
    }

    chapter(req, res, next) {
        const novelID = req.params.id;
        const chapterID = req.params.chapterId;

        res.render("novelChapter/home", {
            layout: "novelChapter",
            css: ["chapterPage", "baseChapterPage", "responsiveChapterPage"],
            js: ["isSignedIn", "header", "chapterPage"],
            novelID: novelID,
            chapterID: chapterID,
        });
        return;
    }
}

module.exports = new novelIntroController();
