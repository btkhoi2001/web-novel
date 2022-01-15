async function fetchComments() {
    try {
        if (token) {
            const res = await fetch(
                `https://api-webnovel.herokuapp.com/api/comment?novelId=${novelId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const comment = await res.json();
            DisplayComments(comment.comments);
        } else {
            const res = await fetch(
                `https://api-webnovel.herokuapp.com/api/comment?novelId=${novelId}`,
                {
                    method: "GET",
                }
            );
            const comment = await res.json();
            DisplayComments(comment.comments);
        }
    } catch (err) {
        console.error(err);
    }
}

async function fetchchildComments(commentId) {
    if (token) {
        const res = await fetch(
            `https://api-webnovel.herokuapp.com/api/comment?parentCommentId=${commentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const commentC = await res.json();
        return commentC.comments;
    } else {
        const res = await fetch(
            `https://api-webnovel.herokuapp.com/api/comment?parentCommentId=${commentId}`,
            {
                method: "GET",
            }
        );
        const commentC = await res.json();
        return commentC.comments;
    }
}

fetchComments();

async function DisplayComments(comments) {
    $(".pager-list").pagination({
        dataSource: comments,
        pageSize: 5,
        autoHidePrevious: true,
        autoHideNext: true,
        hideWhenLessThanOnePage: true,
        afterPageOnClick: function (event, pageNumber) {
            loadListComments(comments, pageNumber);
        },
        afterPreviousOnClick: function (event, pageNumber) {
            loadListComments(comments, pageNumber);
        },
        afterNextOnClick: function (event, pageNumber) {
            loadListComments(comments, pageNumber);
        },
        afterGoButtonOnClick: function (event, inputPage) {
            loadListComments(comments, inputPage);
        },
        callback: loadListComments(comments, 1),
    });
}

async function loadListComments(comments, page) {
    $(".commentcontent").html("");
    var start = comments.length - 1 - (page - 1) * 5;
    var end = Math.max(start - 5, -1);
    for (let i = start; i > end; i--) {
        const element = comments[i];
        var item =
            `
                    <div class="comment-list-item parentcomment" data-pid="${
                        element.commentId
                    }" child-cmt="${element.childComments}">
                        <img class="comment-list-item-cover" src="${
                            element.avatar
                        }">
                        <div class="comment-list-item-info">
                            <p class="comment-list-item-info-line">
                                <span class="comment-list-item-info-title">${
                                    element.displayName
                                }</span>
                                <span class="comment-list-item-info-date">${element.createdAt
                                    .replace("T", " ")
                                    .slice(0, -5)}</span>
                            </p>
                            <p class="comment-list-item-info-content">${
                                element.content
                            }</p>
                            <p class="comment-list-item-info-line">
                                <a class="comment-list-item-info-like likebtn" data-val="${
                                    element.likes
                                }" data-pid="${
                element.commentId
            }" href="javascript:void(0)" onclick="like(${element.commentId})">${
                element.likes
            }</a>
                                <a class="comment-list-item-info-reply replybtn" data-poster="${
                                    element.displayName
                                }" data-pid="${
                element.commentId
            }" href="javascript:void(0)" onclick="reply(${
                element.commentId
            },\'` +
            element.displayName +
            `\')">Phản hồi</a>
                            </p>
                            <p class="comment-list-item-info-line border"></p>
                        </div>
                    </div>
                    `;
        $(".commentcontent").append(item);
        if (
            element.isLiked &&
            !$(`.likebtn[data-pid=${element.commentId}]`).hasClass("isliked")
        )
            $(`.likebtn[data-pid=${element.commentId}]`).addClass("isliked");
        if (element.childComments > 0) {
            const commentChild = fetchchildComments(element.commentId);
            const elementC = await commentChild;
            for (var j = 0; j < Math.min(elementC.length, 3); j++) {
                var item =
                    `
                            <div class="comment-list-item childcomment" data-pid="${j}" parent-pid="${
                        element.commentId
                    }">
                                <img class="comment-list-item-cover" src="${
                                    elementC[j].avatar
                                }">
                                <div class="comment-list-item-info">
                                    <p class="comment-list-item-info-line">
                                        <span class="comment-list-item-info-title">${
                                            elementC[j].displayName
                                        }</span>
                                        <span class="comment-list-item-info-date">${elementC[
                                            j
                                        ].createdAt
                                            .replace("T", " ")
                                            .slice(0, -5)}</span>
                                    </p>
                                    <p class="comment-list-item-info-content">${
                                        elementC[j].content
                                    }</p>
                                    <p class="comment-list-item-info-line">
                                        <a class="comment-list-item-info-like likebtn" data-val="${
                                            elementC[j].likes
                                        }" data-pid="${
                        elementC[j].commentId
                    }" href="javascript:void(0)" onclick="like(${
                        elementC[j].commentId
                    })">${elementC[j].likes}</a>
                                        <a class="comment-list-item-info-reply replybtn" data-poster="${
                                            elementC[j].displayName
                                        }" data-pid="${
                        elementC[j].commentId
                    }" href="javascript:void(0)" onclick="reply(${
                        elementC[j].commentId
                    },\'` +
                    elementC[j].displayName +
                    `\')">Phản hồi</a>
                                    </p>
                                    <p class="comment-list-item-info-line border"></p>
                                </div>
                            </div>
                            `;
                $(".commentcontent").append(item);
                if (
                    elementC[j].isLiked &&
                    !$(`.likebtn[data-pid=${elementC[j].commentId}]`).hasClass(
                        "isliked"
                    )
                )
                    $(`.likebtn[data-pid=${elementC[j].commentId}]`).addClass(
                        "isliked"
                    );
            }
            if (element.childComments > 3) {
                for (var j = 3; j < elementC.length; j++) {
                    var item =
                        `
                                <div class="comment-list-item childcomment" style="display:none;" data-pid="${j}" parent-pid="${
                            element.commentId
                        }">
                                    <img class="comment-list-item-cover" src="${
                                        elementC[j].avatar
                                    }">
                                    <div class="comment-list-item-info">
                                        <p class="comment-list-item-info-line">
                                            <span class="comment-list-item-info-title">${
                                                elementC[j].displayName
                                            }</span>
                                            <span class="comment-list-item-info-date">${elementC[
                                                j
                                            ].createdAt
                                                .replace("T", " ")
                                                .slice(0, -5)}</span>
                                        </p>
                                        <p class="comment-list-item-info-content">${
                                            elementC[j].content
                                        }</p>
                                        <p class="comment-list-item-info-line">
                                            <a class="comment-list-item-info-like likebtn" data-val="${
                                                elementC[j].likes
                                            }" data-pid="${
                            elementC[j].commentId
                        }" href="javascript:void(0)" onclick="like(${
                            elementC[j].commentId
                        })">${elementC[j].likes}</a>
                                            <a class="comment-list-item-info-reply replybtn" data-poster="${
                                                elementC[j].displayName
                                            }" data-pid="${
                            elementC[j].commentId
                        }" href="javascript:void(0)" onclick="reply(${
                            elementC[j].commentId
                        },\'` +
                        elementC[j].displayName +
                        `\')">Phản hồi</a>
                                        </p>
                                        <p class="comment-list-item-info-line border"></p>
                                    </div>
                                </div>
                                `;
                    $(".commentcontent").append(item);
                    if (
                        elementC[j].isLiked &&
                        !$(
                            `.likebtn[data-pid=${elementC[j].commentId}]`
                        ).hasClass("isliked")
                    )
                        $(
                            `.likebtn[data-pid=${elementC[j].commentId}]`
                        ).addClass("isliked");
                }
                $(".commentcontent").append(
                    `<div style="display:flex;justify-content:flex-end;"><button buttonid="${element.commentId}" type="button" class="btn btn-dark" id="showmoreComments" onclick="showmoreComments(${element.commentId})">Xem thêm</button></div>`
                );
            }
        }
    }
}

function showmoreComments(btnid) {
    var checkbtn = false;
    //var btnid = event.target.getAttribute('buttonid');
    var last = $(`.parentcomment[data-pid=${btnid}]`).attr("child-cmt");
    for (var i = 3; i < last; i++) {
        if (
            $(`.childcomment[parent-pid=${btnid}][data-pid=${i}]`).css(
                "display"
            ) === "none"
        ) {
            checkbtn = true;
            $(`.childcomment[parent-pid=${btnid}][data-pid=${i}]`).show();
        } else {
            checkbtn = false;
            $(`.childcomment[parent-pid=${btnid}][data-pid=${i}]`).hide();
        }
    }
    if (checkbtn === true)
        $(`#showmoreComments[buttonid=${btnid}]`).html("Rút gọn");
    else $(`#showmoreComments[buttonid=${btnid}]`).html("Xem thêm");
}

async function postComment() {
    if (!token) {
        window.location.replace(`http://localhost:3000/authen`);
    }
    const content = $(".comment-input").val();
    if (content) {
        fetch(`https://api-webnovel.herokuapp.com/api/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ novelId, content }),
        })
            .then((res) => res.json())
            .then((res) => {
                $(".comment-input").val("");
                fetchComments();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

$(`#formpl .post-btn`).click(function () {
    postComment();
});

function like(cmtid) {
    if ($(`.likebtn[data-pid=${cmtid}]`).hasClass("isliked")) {
        fetch(`https://api-webnovel.herokuapp.com/api/comment/${cmtid}/like`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                $(`.likebtn[data-pid=${cmtid}]`).removeClass("isliked");
                fetchComments();
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        fetch(`https://api-webnovel.herokuapp.com/api/comment/${cmtid}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                fetchComments();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

var itemindex = 0;
function reply(pid, user) {
    if (!token) {
        window.location.replace(`http://localhost:3000/authen`);
    }
    var t = $(`.replybtn[data-pid=${pid}]`);
    var dataid = t.data("dataid");
    if (dataid == undefined || dataid == "") {
        dataid = "comment_" + itemindex + "_" + pid;
        t.data("dataid", dataid);
        itemindex++;
    }

    $(".repostForm").each(function () {
        var _form = $(this);
        var _dataid = _form.data("commentdataid");
        if (_dataid == dataid) return;
        if (_form.css("display") != "none") {
            $("#comment-input-" + _dataid).val("");
            _form.hide();
        }
    });

    var cmmentCointainerForm = $("#formpl" + dataid);
    if (cmmentCointainerForm.length < 1) {
        t.parent().after(
            '<div class="comment-list-item-reply"><form action="/" data-commentdataid="' +
                dataid +
                '" name="formpl" id="formpl' +
                dataid +
                '" method="post" class="postForm repostForm" data-pid="' +
                pid +
                '"><textarea class="comment-input js_max_text_length" placeholder="Re: ' +
                user +
                '" id="comment-input-' +
                dataid +
                '" data-tocommentuser="' +
                $.trim(user) +
                '"></textarea></form></div>'
        );
        $("textarea").keydown(function (event) {
            if (event.ctrlKey && event.keyCode == 13) {
                $(this).parent().submit();
            }
        });
        commentPID = parseInt(pid);
        commentUser = user;
        $("#comment-input-" + dataid).focus();
        replyform = $("#formpl" + dataid);
        replyform.append($("#formpl .comment-list-item-info-line").clone());
        showEmoticon(replyform);
        replyform.find(".post-btn").click(function () {
            replyform.submit();
        });
        replyform.submit(function () {
            var $btn = $(this).find(".post-btn");
            if ($btn && $btn.length > 0 && $btn.data("isenable") === 1) {
                var content = $(this).find(".comment-input").val();
                if (content) {
                    //posting($btn, '');
                    if (t.parents().eq(2).hasClass("childcomment"))
                        parentCommentId = t.parents().eq(2).attr("parent-pid");
                    else parentCommentId = pid;
                    fetch(`https://api-webnovel.herokuapp.com/api/comment`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ parentCommentId, content }),
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            $btn.data("isenable", 1);
                            fetchComments();
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                    return false;
                }
                return false;
            } else {
                return false;
            }
        });
    } else if (cmmentCointainerForm.css("display") == "none") {
        cmmentCointainerForm.show();
        commentPID = parseInt(pid);
        commentUser = user;
        $("#comment-input-" + dataid).focus();
    } else {
        cmmentCointainerForm.hide();
        $("#comment-input-" + dataid).val("");
        commentPID = 0;
        commentUser = "";
    }
}
