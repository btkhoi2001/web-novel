// Light mode - dark mode

function showDarkBackground() {
    $(document.body).css("color", "#ffffff99");
    $("#header").css("background-color", "var(--header-dark-color)");
    $("#footer").css("background-color", "#121212");
    $(".main").css({
        "background-image": "url(/img/bg_dark.gif)",
        "background-repeat": "repeat",
        "background-position": "top center",
    });
    $(".droplist-fluid").css("background-color", "var(--header-dark-color)");
    $(".droplist-normal").css("background-color", "var(--header-dark-color)");
    $(".chapter-content").css({
        color: "white",
        opacity: 0.6,
    });
    $(".btn-chapter-nav").css({
        "background-color": "#121212",
        color: "#82a82d",
    });
    $(".btn-header-toggle").css({
        "background-color": "#121212",
        color: "#82a82d",
    });
    $(".btn-header-bookmark").css({
        "background-color": "#121212",
        color: "#82a82d",
    });
    $(".chapter-error").css({
        "background-color": "#121212",
        color: "#C49654",
    });
    $(".chapter-comment").css({
        "background-color": "#121212",
        color: "#46b8da",
    });
}

function showLightBackground() {
    $(document.body).css("color", "#4E4E4E");
    $("#header").css("background-color", "var(--header-light-color)");
    $("#footer").css("background-color", "var(--header-light-color)");
    $(".main").css({
        background: "none",
        "background-color": "var(--light-background-color)",
    });
    $(".droplist-fluid").css("background-color", "var(--header-light-color)");
    $(".droplist-normal").css("background-color", "var(--header-light-color)");
    $(".chapter-content").css({
        color: "black",
        opacity: 1,
    });
    $(".btn-chapter-nav").css({
        "background-color": "var(--chapter-btn-color)",
        color: "white",
    });
    $(".btn-header-bookmark").css({
        "background-color": "var(--chapter-btn-color)",
        color: "white",
    });
    $(".btn-header-toggle").css({
        "background-color": "var(--chapter-btn-color)",
        color: "white",
    });
    $(".chapter-error").css({
        "background-color": "#f0ad4e",
        color: "white",
    });
    $(".chapter-comment").css({
        "background-color": "#5bc0de",
        color: "white",
    });
}

$("#darkmode").click(function () {
    showDarkBackground();
});
$("#lightmode").click(function () {
    showLightBackground();
});

$(".chapter-jump").click(function () {
    $(".chapter-jump").addClass("d-none");
    $(".chapter-select").toggleClass("d-none");
});

$(".btn-header-toggle").click(function () {
    $(".header-up").toggleClass("d-none");
    $(".header-down").toggleClass("d-none");
    $("#header").toggleClass("d-none");
});
$(".mark-up").click(async function () {
    if (!window.localStorage.getItem("token")) {
        window.location.replace(`https://app-webnovel.herokuapp.com/authen`);
    } else {
        const token = window.localStorage.getItem("token");
        const res = await fetch(
            "https://api-webnovel.herokuapp.com/api/bookmark",
            {
                method: "Post",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    novelId: novelId,
                    chapterId: chapterId,
                }),
            }
        );

        alert(`????nh d???u ch????ng th??nh c??ng`);

        $(".mark-up").toggleClass("d-none");
        $(".mark-down").toggleClass("d-none");
    }
});
$(".mark-down").click(async function () {
    if (!window.localStorage.getItem("token")) {
        window.location.replace(`https://app-webnovel.herokuapp.com/authen`);
    } else {
        const token = window.localStorage.getItem("token");
        const res = await fetch(
            "https://api-webnovel.herokuapp.com/api/bookmark",
            {
                method: "Delete",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    novelId: novelId,
                    chapterId: chapterId,
                }),
            }
        );

        alert(`B??? d??nh d???u ch????ng th??nh c??ng`);

        $(".mark-up").toggleClass("d-none");
        $(".mark-down").toggleClass("d-none");
    }
});
$("#send").click(async function () {
    if (!window.localStorage.getItem("token")) {
        window.location.replace(`https://app-webnovel.herokuapp.com/authen`);
    } else {
        const email = $("#modal-email").val();
        const content = $("#modal-error").val();

        if (email == "" || content == "") {
            alert("Vui l??ng ??i???n ?????y ????? c??c th??ng tin");
        } else {
            const token = window.localStorage.getItem("token");
            const res = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel/${novelId}/chapter/${chapterId}/report`,
                {
                    method: "Post",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email, message: content }),
                }
            );
            console.log(res);

            alert(`B??o c??o l???i ch????ng th??nh c??ng`);
            $("#modal-email").val("");
            $("#modal-error").val("");
        }
    }
});

$(".chapter-select").click(function (e) {
    let chapterLink = e.target.value;
    if (chapterLink) {
        location.replace(chapterLink);
    }
});

let novel;
let chapter;
let listOfChapters;
let bookmarks;

const loadChapter = async () => {
    try {
        const res = await fetch(
            `https://api-webnovel.herokuapp.com/api/novel/${novelId}/chapter/${chapterId}`
        );
        chapter = await res.json();
        chapter = chapter.chapter;
        console.log(chapter);

        const res1 = await fetch(
            `https://api-webnovel.herokuapp.com/api/novel/${novelId}/chapter`
        );
        listOfChapters = await res1.json();
        listOfChapters = listOfChapters.chapters;
        console.log(listOfChapters);

        const res2 = await fetch(
            `https://api-webnovel.herokuapp.com/api/novel/${novelId}`
        );
        novel = await res2.json();
        novel = novel.novel;
        console.log(novel);

        if (window.localStorage.getItem("token")) {
            const token = window.localStorage.getItem("token");
            const res4 = await fetch(
                "https://api-webnovel.herokuapp.com/api/bookmark",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            bookmarks = await res4.json();
            bookmarks = bookmarks.bookmarks;
            console.log(bookmarks);

            let marked = bookmarks.filter((bookmark) => {
                return (
                    bookmark.novelId == novelId &&
                    bookmark.chapterId == chapterId
                );
            })[0];
            if (marked) {
                $(".mark-up").toggleClass("d-none");
                $(".mark-down").toggleClass("d-none");
            }
        }

        displayChapter(novel, chapter, listOfChapters);

        // scroll to content
        document.body.scrollTop = 300; // For Safari
        document.documentElement.scrollTop = 300; // For Chrome, Edge, ...
    } catch (err) {
        console.error(err);
    }
};

$(document).ready(function () {
    loadChapter();
});

const displayChapter = (novel, chapter, listOfChapters) => {
    let previousChapter = listOfChapters.filter((chap) => {
        return chap.chapterId == chapter.chapterId - 1;
    })[0];
    let nextChapter = listOfChapters.filter((chap) => {
        return chap.chapterId == chapter.chapterId + 1;
    })[0];

    if (previousChapter) {
        $(".prev-chap").attr(
            "href",
            `https://app-webnovel.herokuapp.com/novel/${novel.novelId}/chapter/${previousChapter.chapterId}`
        );
    } else {
        $(".prev-chap").addClass("btn-disabled");
        $(".prev-chap").attr("href", `#`);
    }

    if (nextChapter) {
        $(".next-chap").attr(
            "href",
            `https://app-webnovel.herokuapp.com/novel/${novel.novelId}/chapter/${nextChapter.chapterId}`
        );
    } else {
        $(".next-chap").addClass("btn-disabled");
        $(".next-chap").attr("href", `#`);
    }

    let htmlString1;
    let htmlString2;
    let htmlString3;
    let htmlString4;

    htmlString1 = `
        <h1><a href="https://app-webnovel.herokuapp.com/novel/${novel.novelId}" class="novel-title" title="${novel.title}">${novel.title}</a></h1>
        `;

    htmlString2 = `
    <h3>
        <a href="#" class="chapter-title" title="${novel.title} - Ch????ng ${chapter.chapterOrder}:
        ${chapter.title}">
        Ch????ng ${chapter.chapterOrder}: ${chapter.title}"</a>
    </h3>
        `;

    htmlString3 = `
        ${chapter.content}
        `;

    htmlString4 = listOfChapters
        .map((chap) => {
            return `
            <option value="https://app-webnovel.herokuapp.com/novel/${novel.novelId}/chapter/${chap.chapterId}">
                Ch????ng ${chap.chapterOrder}
            </option>
        `;
        })
        .join("");
    htmlString4 =
        `
            <option value="" selected>
                Ch???n ch????ng b???n mu???n
            </option>
        ` + htmlString4;

    $(".Nov-Title").html(htmlString1);
    $(".Chap-Title").html(htmlString2);
    $(".chapter-content").html(htmlString3);
    $(".chapter-select").html(htmlString4);
};
