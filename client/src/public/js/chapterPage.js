  
 // Light mode - dark mode

 function showDarkBackground(){
    $(document.body).css("color","#ffffff99");
    $("#header").css("background-color", "var(--header-dark-color)");
    $("#footer").css("background-color", "#121212");
    $(".main").css({
        "background-image": "url(/img/bg_dark.gif)",
        "background-repeat": "repeat",
        "background-position": "top center"
    });
    $(".droplist-fluid").css("background-color", "var(--header-dark-color)");
    $(".droplist-normal").css("background-color", "var(--header-dark-color)");
    $(".chapter-content").css({
        "color" : "white",
        "opacity": 0.6
    });
    $(".btn-chapter-nav").css({
        "background-color" : "#121212",
        "color": "#82a82d"
    });
    $(".btn-header-toggle").css({
        "background-color" : "#121212",
        "color": "#82a82d"
    });
    $(".btn-header-bookmark").css({
        "background-color" : "#121212",
        "color": "#82a82d"
    });
    $(".chapter-error").css({
        "background-color" : "#121212",
        "color": "#C49654"
    });
    $(".chapter-comment").css({
        "background-color" : "#121212",
        "color": "#46b8da"
    });
 
}

function showLightBackground(){
    $(document.body).css("color", "#4E4E4E");
    $("#header").css("background-color", "var(--header-light-color)");
    $("#footer").css("background-color", "var(--header-light-color)");
    $(".main").css({
        "background": "none",
        "background-color": "var(--light-background-color)",
    });
    $(".droplist-fluid").css("background-color", "var(--header-light-color)");
    $(".droplist-normal").css("background-color", "var(--header-light-color)");
    $(".chapter-content").css({
        "color" : "black",
        "opacity": 1
    });
    $(".btn-chapter-nav").css({
        "background-color" : "var(--chapter-btn-color)",
        "color": "white"
    });
    $(".btn-header-bookmark").css({
        "background-color" : "var(--chapter-btn-color)",
        "color": "white"
    });
    $(".btn-header-toggle").css({
        "background-color" : "var(--chapter-btn-color)",
        "color": "white"
    });
    $(".chapter-error").css({
        "background-color" : "#f0ad4e",
        "color": "white"
    });
    $(".chapter-comment").css({
        "background-color" : "#5bc0de",
        "color": "white"
    });
}


$("#darkmode").click(function(){
    showDarkBackground();
});
$("#lightmode").click(function(){
    showLightBackground();
});

$(".chapter-jump").click(function(){
    $(".chapter-jump").addClass("d-none");
    $(".chapter-select").toggleClass("d-none");
});

$(".btn-header-toggle").click(function(){
    $(".header-up").toggleClass("d-none");
    $(".header-down").toggleClass("d-none");
    $("#header").toggleClass("d-none");
})
$(".btn-header-bookmark").click(function(){
    $(".mark-up").toggleClass("d-none");
    $(".mark-down").toggleClass("d-none");
})

let novel;
let chapter;

const loadChapter = async () => {
    try {
        
        const res = await fetch(`http://localhost:5000/api/novel/${novelId}/chapter/${chapterId}`);
        chapter = await res.json();
        chapter = chapter.chapter;
        console.log(chapter);

        const res2 = await fetch(`http://localhost:5000/api/novel/${novelId}`);
        novel = await res2.json();
        novel = novel.novel;
        console.log(novel);
       
        displayChapter(novel, chapter);

        // scroll to content
        document.body.scrollTop = 300; // For Safari
        document.documentElement.scrollTop = 300; // For Chrome, Edge, ...
      
    } catch (err) {
        console.error(err);
    }
};

$(document).ready(function() {
    loadChapter();
});

const displayChapter = (novel, chapter) => {
    let htmlString1;
    let htmlString2;
    let htmlString3;
    
    htmlString1 =  `
        <h1><a href="http://localhost:3000/novel/${novel.novelId}" class="novel-title" title="${novel.title}">${novel.title}</a></h1>
        `;
    
    htmlString2 =  `
    <h3>
        <a href="#" class="chapter-title" title="${novel.title} - Chương ${chapter.chapterOrder}:
        ${chapter.title}">
        Chương ${chapter.chapterOrder}: ${chapter.title}"</a>
    </h3>
        `;

    htmlString3 =  `
        ${chapter.content}
        `;

    $('.Nov-Title').html(htmlString1);
    $('.Chap-Title').html(htmlString2);
    $('.chapter-content').html(htmlString3);
}