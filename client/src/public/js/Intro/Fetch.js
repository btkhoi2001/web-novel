const token = window.localStorage.getItem("token");

var checkfl = false;
async function fetchNovel() {
    try {
        if (token) {
            const res = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel/${novelId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const novel = await res.json();
            const res2 = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel/${novelId}/chapter`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const listChapter = await res2.json();
            checkfl = novel.novel.isFollowed;
            SetValueNovel(novel.novel);
            DisplayListChapter(listChapter.chapters);
            DisplayNewChapters(listChapter.chapters);
            DisplaySameAuthorNovels(novel.novel.authorId);
        } else {
            const res = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel/${novelId}`,
                {
                    method: "GET",
                }
            );
            const novel = await res.json();
            const res2 = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel/${novelId}/chapter`,
                {
                    method: "GET",
                }
            );
            const listChapter = await res2.json();
            SetValueNovel(novel.novel);
            DisplayListChapter(listChapter.chapters);
            DisplayNewChapters(listChapter.chapters);
            DisplaySameAuthorNovels(novel.novel.authorId);
        }
    } catch (err) {
        console.error(err);
    }
}

fetchNovel();

async function SetValueNovel(novel) {
    $("h3[itemprop=name]").html(novel.title);
    $("[itemprop=image]").attr("src", novel.cover);
    $("[itemprop=author]").html(novel.authorName);
    if (novel.isCompleted)
        $("[itemprop=isCompleted").attr("class", "text-success").html("Full");
    else
        $("[itemprop=isCompleted")
            .attr("class", "text-primary")
            .html("Đang ra");
    $("[itemprop=genre").html(novel.genre);
    if (checkfl)
        $("#follow > a").html(`Hủy theo dõi <i class="fa fa-eye-slash"></i>`);
    else $("#follow > a").html(`Theo dõi <i class="fa fa-eye"></i>`);
    $("[itemprop=nomi]").html(novel.nominations);
    $("[itemprop=ratingValue]").html(novel.rating);
    $("[itemprop=ratingCount]").html(novel.ratingCount);
    let temp = `<span id="dots">...</span><span id="more">`;
    let last = `<\span>`;
    let substr = novel.description.substring(0, 850);
    var check = ``;
    for (let i = substr.length - 1; i >= 0; i--)
        if (substr[i] === `<`) {
            if (substr[i + 1] !== `/`)
                check = substr.substring(
                    i + 1,
                    i + 1 + substr.substring(i + 1).indexOf(`>`)
                );
            break;
        }
    let description;
    if (novel.description.substring(850) === ``) {
        description = substr;
        $("[class=showmore]").attr("style", "display: none");
    } else {
        if (check !== ``)
            description =
                substr +
                `</${check}>` +
                temp +
                `<${check}>` +
                novel.description.substring(850) +
                last;
        else
            description =
                substr + temp + novel.description.substring(850) + last;
    }
    $("[itemprop=description]").html(description);
    if (token) $(".comment-list-item-cover-user").attr("src", User.user.avatar);
}

async function DisplayListChapter(LChapter) {
    $(".pagination").pagination({
        dataSource: LChapter,
        pageSize: 6,
        showGoInput: true,
        showGoButton: true,
        autoHidePrevious: true,
        autoHideNext: true,
        hideWhenLessThanOnePage: true,
        afterPageOnClick: function (event, pageNumber) {
            loadListChapter(LChapter, pageNumber);
        },
        afterPreviousOnClick: function (event, pageNumber) {
            loadListChapter(LChapter, pageNumber);
        },
        afterNextOnClick: function (event, pageNumber) {
            loadListChapter(LChapter, pageNumber);
        },
        afterGoButtonOnClick: function (event, inputPage) {
            loadListChapter(LChapter, inputPage);
        },
        callback: loadListChapter(LChapter, 1),
    });
}

function loadListChapter(LChapter, page) {
    $(".list-chapter-left").html("");
    $(".list-chapter-right").html("");
    var start = (page - 1) * 6;
    var end = start + Math.min(6, LChapter.length - start);
    for (let i = start; i < end; i++) {
        const element = LChapter[i];
        var item = `
                    <li>
                        <span class="glyphicon glyphicon-certificate"></span>
                        <a href="/novel/${novelId}/chapter/${element.chapterId}" title="">
                            <span class="chapter-text">
                                <span>Chương </span>
                            </span>${element.chapterOrder}: ${element.title}
                        </a>
                    </li>
                    `;
        if (i < start + 3) $(".list-chapter-left").append(item);
        else $(".list-chapter-right").append(item);
    }
}

async function DisplayNewChapters(LChapter) {
    $(".l-chapters").html("");
    for (let i = LChapter.length - 1; i > LChapter.length - 4; i--) {
        const element = LChapter[i];
        var item = `
                    <li>
                        <span class="glyphicon glyphicon-certificate"></span>
                        <a href="/novel/${novelId}/chapter/${element.chapterId}" title="">
                            <span class="chapter-text">
                                <span>Chương </span>
                            </span>${element.chapterOrder}: ${element.title}
                        </a>
                    </li>
                    `;
        $(".l-chapters").append(item);
    }
}

function nominating() {
    var em = document.getElementById("err-mess");
    if (em) em.remove();
    const quantity = 1;
    fetch(
        `https://api-webnovel.herokuapp.com/api/novel/${novelId}/nomination`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity }),
        }
    )
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                $("#suggest-book").append(
                    `<h3 id="err-mess">${res.message}</h3>`
                );
                setTimeout(function () {
                    $("#err-mess").fadeOut().empty();
                }, 5000);
            } else fetchNovel();
        })
        .catch((err) => {
            console.error(err);
        });
}

function following() {
    var em = document.getElementById("annomess");
    if (em) em.remove();
    if (checkfl == false) {
        fetch(`https://api-webnovel.herokuapp.com/api/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ novelId }),
        })
            .then((res) => res.json())
            .then((res) => {
                checkfl = true;
                $("#follow > a").html(
                    `Hủy theo dõi <i class="fa fa-eye-slash"></i>`
                );
                $("#follow").append(
                    `<h3 id="annomess" class="flmes">Đã theo dõi truyện</h3>`
                );
                setTimeout(function () {
                    $("#annomess").fadeOut().empty();
                }, 5000);
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        fetch(`https://api-webnovel.herokuapp.com/api/follow`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ novelId }),
        })
            .then((res) => res.json())
            .then((res) => {
                checkfl = false;
                $("#follow > a").html(`Theo dõi <i class="fa fa-eye"></i>`);
                $("#follow").append(
                    `<h3 id="annomess" class="uflmes">Đã hủy theo dõi truyện</h3>`
                );
                setTimeout(function () {
                    $("#annomess").fadeOut().empty();
                }, 5000);
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

function filterNovels(authorId) {
    let newL = [];
    for (let i = 0; i < listOfNovels.length; i++)
        if (listOfNovels[i].authorId === authorId) newL.push(listOfNovels[i]);

    return newL;
}

function DisplaySameAuthorNovels(authorId) {
    var LSANovels = filterNovels(authorId);
    var a = [];
    var p;
    for (let i = 1; i < 4; i++) {
        do {
            var idSA = Math.floor(Math.random() * LSANovels.length);
            p = a.includes(idSA);
            if (!p) {
                a.push(idSA);
                $(`#sameA${i}`).html(`${LSANovels[idSA].title}`);
            }
        } while (p);
    }
}
