let file;
let coverImg;
//  upload avatar
var readAvatar = function (input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(".profile-pic").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        file = input.files[0];
    }
};

$(".file-upload").on("change", function () {
    readAvatar(this);
});

$(".upload-button").on("click", function () {
    $(".file-upload").click();
});

// upload novel cover image
var readCover = function (input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(".cover-pic").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        coverImg = input.files[0];
    }
};

$(".cover-upload").on("change", function () {
    readCover(this);
});

$(".upload-cover").on("click", function () {
    $(".cover-upload").click();
});

$("#info").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".info").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#general-information").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".general-information").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#password").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".setting").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#follow").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".novel-following").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#bookmark").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".bookmark").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#property").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".property").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#notification").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".notification").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#upload").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".upload-novel").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#uploaded-novel").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".uploaded-novel").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$("#upload-chapter").click(function () {
    $(".list-item").removeClass("active");
    $(".section").addClass("d-none");
    $(".upload-chapter").removeClass("d-none");
    $(this).addClass("active");
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});

const tabs = document.querySelectorAll(".tab-item");
const panes = document.querySelectorAll(".tab-pane");

let tabActive = document.querySelector(".tab-item.active");
const line = document.querySelector(".tabs .line");

line.style.left = tabActive.offsetLeft + "px";
line.style.width = "80px";

tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        document.querySelector(".tab-item.active").classList.remove("active");
        document.querySelector(".tab-pane.active").classList.remove("active");

        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";

        this.classList.add("active");
        pane.classList.add("active");
    };
});

let token;
let user;
let following;
let comment;
let novels;
let genres = [];
let listOfFollow = [];
let listOfBookmark = [];

const loadP = async () => {
    try {
        token = window.localStorage.getItem("token");
        const res = await fetch(
            "https://api-webnovel.herokuapp.com/api/user/account",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        user = await res.json();
        console.log(user);

        const res2 = await fetch(
            "https://api-webnovel.herokuapp.com/api/follow",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        follow = await res2.json();
        listOfFollow = follow.follows;

        const res3 = await fetch(
            "https://api-webnovel.herokuapp.com/api/comment",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        comment = await res3.json();

        const res4 = await fetch(
            "https://api-webnovel.herokuapp.com/api/bookmark",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        bookmark = await res4.json();
        listOfBookmark = bookmark.bookmarks;

        const res5 = await fetch(
            "https://api-webnovel.herokuapp.com/api/novel/genre"
        );
        const g = await res5.json();
        genres = g.genres;

        if (user.user.role === "Author") {
            const res6 = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel?authorId=${user.user.userId}`
            );
            const n = await res6.json();
            novels = n.novels;
            displayUploadedNovels(novels);

            // upload novel
            getGenres(genres);

            // upload chapter
            getNovels(novels);
        }

        // info
        displayInfoPage(user);

        // general information
        displayGeneralInformationPage(user);

        // Following novel
        displayFollowPage(listOfFollow);

        // Bookmark
        displayBookmarkPage(listOfBookmark);

        // property
        $(".flower").text(`${user.user.flowers}`);

        // scroll to content
        document.body.scrollTop = 400; // For Safari
        document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
    } catch (err) {
        console.log(err);
    }
};

$(document).ready(function () {
    loadP();
});

// update general information
$(".update-info").click(async function () {
    let name = $(".general-information #name").val();
    let gender = $(".general-information #gender").val();
    let intro = $(".general-information #introduction").val();

    if (name == "" || gender == "") {
        alert("Vui l??ng ??i???n ?????y ????? t???t c??? th??ng tin b???t bu???c");
        $(".general-information #name").val(`${user.user.displayName}`);
        $(".general-information #gender").val(`${user.user.gender}`);
    } else {
        try {
            let formData = new FormData();
            formData.append("displayName", name);
            if (file) {
                formData.append("avatar", file);
            }
            if (intro) {
                formData.append("description", intro);
            }
            formData.append("gender", gender);

            const res = await fetch(
                "https://api-webnovel.herokuapp.com/api/user/account",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        enctype: "multipart/form-data",
                    },
                    body: formData,
                }
            );
            alert("C???p nh???t th??ng tin c?? nh??n th??nh c??ng");

            location.reload();
        } catch (e) {
            alert("C???p nh???t th??ng tin c?? nh??n th??nh c??ng");
        }
    }
});

//  delete follow
const deleteFollow = async (event) => {
    const novelId = event.target.value;
    const res = await fetch("https://api-webnovel.herokuapp.com/api/follow", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ novelId: novelId }),
    });

    alert(`B??? theo d??i truy???n th??nh c??ng`);

    const res2 = await fetch("https://api-webnovel.herokuapp.com/api/follow", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    follow = await res2.json();
    listOfFollow = follow.follows;
    displayFollowPage(listOfFollow);

    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
};

// delete bookmark
const deleteBookmark = async (event) => {
    const str = event.target.value;
    let tokens = str.split("/");
    let novelId = tokens[0];
    let chapterId = tokens[1];

    const res = await fetch("https://api-webnovel.herokuapp.com/api/bookmark", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ novelId: novelId, chapterId: chapterId }),
    });
    console.log(res);

    alert(`B??? ????nh d???u truy???n th??nh c??ng`);

    const res4 = await fetch(
        "https://api-webnovel.herokuapp.com/api/bookmark",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    bookmark = await res4.json();
    listOfBookmark = bookmark.bookmarks;
    displayBookmarkPage(listOfBookmark);

    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
};

const deleteNovel = async (event) => {
    const novelId = event.target.value;

    const res = await fetch(
        `https://api-webnovel.herokuapp.com/api/novel/${novelId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    alert(`X??a truy???n th??nh c??ng`);

    const res6 = await fetch(
        `https://api-webnovel.herokuapp.com/api/novel?authorId=${user.user.userId}`
    );
    const n = await res6.json();
    novels = n.novels;
    displayUploadedNovels(novels);

    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
};

// change password
$(".change-pwd").click(async function () {
    let currPwd = $(".setting #current-password").val();
    let newPwd = $(".setting #new-password").val();
    let confirm = $(".setting #confirm-password").val();

    if (currPwd == "" || newPwd == "" || confirm == "") {
        alert("Vui l??ng ??i???n ?????y ????? t???t c??? tr?????ng");
        $(".setting #current-password").val(``);
        $(".setting #new-password").val(``);
        $(".setting #confirm-password").val(``);
    } else if (newPwd !== confirm) {
        alert("X??c nh???n m???t kh???u kh??ng tr??ng kh???p");
        $(".setting #current-password").val(``);
        $(".setting #new-password").val(``);
        $(".setting #confirm-password").val(``);
    } else {
        fetch(
            "https://api-webnovel.herokuapp.com/api/user/account/change-password",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: currPwd,
                    newPassword: newPwd,
                    confirmPassword: confirm,
                }),
            }
        )
            .then((res) => res.json())
            .then((res) => {
                if (!res.newAccessToken) alert("Can not access token");
                else {
                    alert("M???t kh???u c???a b???n ???? ???????c thay ?????i");
                    window.localStorage.setItem("token", res.newAccessToken);
                    token = window.localStorage.getItem("token");
                    console.log(token);
                    $(".setting #current-password").val(``);
                    $(".setting #new-password").val(``);
                    $(".setting #confirm-password").val(``);
                }
            })
            .catch((err) => {
                alert(err);
            });
    }
});

// upload novel
$(".uploadNovel").click(async function () {
    let novelName = $(".upload-novel #novelname").val();
    let genreId = $(".upload-novel #genre").val();
    let intro = $(".upload-novel #intro").val();
    let checkBox = document.getElementById("guarantee");

    if (novelName == "" || genreId == "" || intro == "" || !coverImg) {
        alert("Vui l??ng ??i???n ?????y ????? t???t c??? th??ng tin v?? ???nh b??a truy???n");
    } else if (!checkBox.checked) {
        alert("Vui l??ng cam k???t quy???n t??c gi???");
    } else {
        try {
            let formData = new FormData();
            formData.append("title", novelName);
            formData.append("genreId", genreId);
            formData.append("description", intro);
            formData.append("cover", coverImg);

            let res = await fetch(
                "https://api-webnovel.herokuapp.com/api/novel",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        enctype: "multipart/form-data",
                    },
                    body: formData,
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    novels = res.newNovel;
                    console.log(listOfNovels);
                    alert("????ng truy???n th??nh c??ng");
                    location.reload();
                });
        } catch (err) {
            alert(err);
        }
    }
});

// upload chapter
$(".uploadChapter").click(async function () {
    let novelId = $(".upload-chapter #novelID").val();
    let chapterOrder = $(".upload-chapter #chapOrder").val();
    let title = $(".upload-chapter #chaptername").val();
    let content = $(".upload-chapter #intro").val();
    let checkBox = document.getElementById("accept");

    console.log(novelId, chapterOrder, title);

    if (novelId == "" || chapterOrder == "" || title == "" || content == "") {
        alert("Vui l??ng ??i???n ?????y ????? t???t c??? th??ng tin ");
    } else if (!checkBox.checked) {
        alert("Vui l??ng cam k???t quy???n t??c gi???");
    } else {
        try {
            let res = await fetch(
                `https://api-webnovel.herokuapp.com/api/novel/${novelId}/chapter`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chapterOrder: chapterOrder,
                        title: title,
                        content: content,
                    }),
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    let newChapter = res.newChapter;
                    console.log(newChapter);
                    alert("????ng ch????ng m???i th??nh c??ng");
                    location.reload();
                });
        } catch (err) {
            alert(err);
        }
    }
});

const displayInfoPage = (user) => {
    $(".info .username").html(
        `${user.user.displayName} <span class="badge p-2 bg-primary mx-3 px-3" style="border-radius: 8rem;">Lv.1</span>`
    );
    $(".info .novels").html(`${follow.follows.length}`);
    $(".info .comments").html(`${comment.comments.length}`);
    if (user.user.avatar) {
        $(".info .avatar").attr("src", `${user.user.avatar}`);
    }
};

const displayGeneralInformationPage = (user) => {
    $(".general-information #name").val(`${user.user.displayName}`);
    $(".general-information #gender").val(`${user.user.gender}`);
    $(".general-information #email").val(`${user.user.email}`);
    if (user.user.description) {
        $(".general-information #introduction").val(`${user.user.description}`);
    }
    if (user.user.avatar) {
        $(".general-information .profile-pic").attr(
            "src",
            `${user.user.avatar}`
        );
    }
};

const displayFollowPage = (novels) => {
    let htmlString;

    htmlString = novels
        .map((novel) => {
            return `
             <li class="reading-list-item d-flex justify-content-between">
                                            <div class="row">
                                                <div class="col-1">
                                                    <a href="https://app-webnovel.herokuapp.com/novel/${novel.novelId}" class="item-img">
                                                        <img src="${novel.cover}" alt="" width="58" height="80">
                                                    </a>
                                                </div>
                                                <div class="col-11">
                                                    <div class="item-body">
                                                        <h2><a href="https://app-webnovel.herokuapp.com/novel/${novel.novelId}" class="item-body-title">${novel.novelTitle}</a></h2>
                                                        <div class="text-muted text-overflow-1-lines">
                                                            ???? ?????c: ${novel.readChapters} ch????ng
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-center" >
                                                <button value="${novel.novelId}" onclick="deleteFollow(event)" type="submit" class="btn btn-outline-danger delete-follow" >X??a</button>
                                            </div>
                                        </li>
        `;
        })
        .join("");

    $(".novel-following .reading-list").html(htmlString);
};

const displayBookmarkPage = (novels) => {
    let htmlString;

    htmlString = novels
        .map((novel) => {
            return `
             <li class="reading-list-item d-flex justify-content-between">
                                            <div class="row">
                                                <div class="col-1">
                                                    <a href="https://app-webnovel.herokuapp.com/novel/${novel.novelId}" class="item-img">
                                                        <img src="${novel.cover}" alt="" width="58" height="80">
                                                    </a>
                                                </div>
                                                <div class="col-11">
                                                    <div class="item-body">
                                                        <h2><a href="https://app-webnovel.herokuapp.com/novel/${novel.novelId}" class="item-body-title">${novel.novelTitle}</a></h2>
                                                        <div><a href="https://app-webnovel.herokuapp.com/novel/${novel.novelId}/chapter/${novel.chapterId}" class="text-overflow-1-lines d-inline-block">
                                                            ??ang ?????c: ch????ng ${novel.chapterOrder} 
                                                        </a></div>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                            <div class="d-flex justify-content-center">
                                                <button value="${novel.novelId}/${novel.chapterId}" onclick="deleteBookmark(event)" class="btn btn-outline-danger delete-bookmark" >X??a</button>
                                            </div>
                                            
                                        </li>
        `;
        })
        .join("");

    $(".bookmark .reading-list").html(htmlString);
};

const getGenres = (genres) => {
    let htmlString;
    htmlString = genres
        .map((genre) => {
            return `
            <option value="${genre.genreId}">${genre.name}</option>
        `;
        })
        .join("");

    $(".upload-novel .form-select").html(htmlString);
};

const getNovels = (novels) => {
    let htmlString = ` <option selected>Ch???n truy???n c???n ????ng ch????ng m???i</option>`;
    htmlString = novels
        .map((novel) => {
            return `
            <option value="${novel.novelId}">${novel.title}</option>
        `;
        })
        .join("");

    let result =
        ` <option selected>Ch???n truy???n c???n ????ng ch????ng m???i</option>` +
        htmlString;
    $(".upload-chapter .form-select").html(result);
};

const displayUploadedNovels = (novels) => {
    let htmlString;

    htmlString = novels
        .map((novel, index) => {
            return `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${novel.title}</td>
            <td>${novel.genre}</td>
            <td><img src="${novel.cover}" alt="" width="45" width="60"></td>
            <td><button type="button" value="${
                novel.novelId
            }" onclick="deleteNovel(event)" class="btn btn-outline-danger delete-follow">X??a</button></td>
        </tr>
        `;
        })
        .join("");

    $(".uploaded-novel tbody").html(htmlString);
};
