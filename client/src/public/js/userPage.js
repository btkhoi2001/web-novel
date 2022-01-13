let file;
let coverImg;
//  upload avatar
var readAvatar = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.profile-pic').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
        file = input.files[0];
    }
}

$(".file-upload").on('change', function(){
    readAvatar(this);
});

$(".upload-button").on('click', function() {
    $(".file-upload").click();
});

// upload novel cover image
var readCover = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.cover-pic').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
        coverImg = input.files[0];
    }
}

$(".cover-upload").on('change', function(){
    readCover(this);
});

$(".upload-cover").on('click', function() {
    $(".cover-upload").click();
});

$('#info').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.info').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$('#general-information').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.general-information').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$('#password').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.setting').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$('#follow').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.novel-following').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...

});
$('#bookmark').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.bookmark').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...

});
$('#property').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.property').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...

});
$('#notification').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.notification').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$('#upload').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.upload-novel').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});
$('#uploaded-novel').click(function () {
    $('.list-item').removeClass('active');
    $('.section').addClass('d-none');
    $('.uploaded-novel').removeClass('d-none');
    $(this).addClass('active');
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
});

const tabs = document.querySelectorAll(".tab-item");
const panes = document.querySelectorAll(".tab-pane");

let tabActive = document.querySelector(".tab-item.active");
const line = document.querySelector(".tabs .line");

line.style.left = tabActive.offsetLeft + "px";
line.style.width =  "80px";

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
let genres = [];
let listOfFollow = [];
let listOfBookmark = [];

const loadP = async () => {
    try {
        token = window.localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/user/account', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        user = await res.json();
        console.log(user);

        const res2 = await fetch('http://localhost:5000/api/follow', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        follow = await res2.json();
        listOfFollow = follow.follows;

        const res3 = await fetch('http://localhost:5000/api/comment', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        comment = await res3.json();

        const res4 = await fetch('http://localhost:5000/api/bookmark', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        bookmark = await res4.json();
        listOfBookmark = bookmark.bookmarks;

        const res5 = await fetch('http://localhost:5000/api/novel/genre');
        const g = await res5.json();
        genres = g.genres;    



        console.log(follow, bookmark)
        // info
        displayInfoPage(user)

        // general information
        displayGeneralInformationPage(user);

        // Following novel
        displayFollowPage(listOfFollow);

        // Bookmark
        displayBookmarkPage(listOfBookmark);

        // property
        $('.flower').text(`${user.user.flowers}`)

        // upload novel 
        getGenres(genres);

        // scroll to content
        document.body.scrollTop = 400; // For Safari
        document.documentElement.scrollTop = 400; // For Chrome, Edge, ...
      
    } catch (err) {
        console.error(err);
    }
};

$(document).ready(function() {
    loadP();
});

// update general information
$('.update-info').click(async function() {
    let name =  $('.general-information #name').val();
    let gender =  $('.general-information #gender').val();
    let intro = $('.general-information #introduction').val();

    if (name == "" || gender == "")
    { 
        alert("Vui lòng điền đầy đủ tất cả thông tin bắt buộc");
        $('.general-information #name').val(`${user.user.displayName}`);
        $('.general-information #gender').val(`${user.user.gender}`);
    }

    else {
        try {
            let formData = new FormData();
            formData.append('displayName', name);
            if(file) {
                formData.append('avatar', file);
            }
            if(intro) {
                formData.append('description', intro);
            }
            formData.append('gender', gender);

            const res = await fetch('http://localhost:5000/api/user/account', {      
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'enctype': 'multipart/form-data',
                },
                body: formData,
            })
            alert('Cập nhật thông tin cá nhân thành công');
          
            location.reload();
        }
        catch(e) {
            alert('Cập nhật thông tin cá nhân thành công');
        }
    }

  
});

//  delete follow
const deleteFollow = async (event) => {
    const novelId = event.target.value;
    const res = await fetch('http://localhost:5000/api/follow', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "novelId": novelId }) 
    });

    alert(`Bỏ theo dõi truyện thành công`); 
    
    const res2 = await fetch('http://localhost:5000/api/follow', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    follow = await res2.json();
    listOfFollow = follow.follows;
    displayFollowPage(listOfFollow);
}

// delete bookmark
const deleteBookmark = async (event) => {
    const str = event.target.value;
    let tokens = str.split('/');
    let novelId = tokens[0];
    let chapterId = tokens[1];
    
    const res = await fetch('http://localhost:5000/api/bookmark', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "novelId": novelId, "chapterId":chapterId }) 
    });
    console.log(res);

    alert(`Bỏ theo dõi truyện thành công`); 
    
    const res4 = await fetch('http://localhost:5000/api/bookmark', {
        headers: {
                'Authorization': `Bearer ${token}`
            }
    });
    bookmark = await res4.json();
    listOfBookmark = bookmark.bookmarks;
    displayBookmarkPage(listOfBookmark);
    console.log(bookmark)
  
}

// change password
$('.change-pwd').click(async function() {
    let currPwd =  $('.setting #current-password').val();
    let newPwd =  $('.setting #new-password').val();
    let confirm = $('.setting #confirm-password').val();

    if (currPwd == "" || newPwd == "" || confirm == "")
    { 
        alert("Vui lòng điền đầy đủ tất cả trường");
        $('.setting #current-password').val(``);
        $('.setting #new-password').val(``);
        $('.setting #confirm-password').val(``);
    }
    else if(newPwd !== confirm) {
        alert("Xác nhận mật khẩu không trùng khớp");
        $('.setting #current-password').val(``);
        $('.setting #new-password').val(``);
        $('.setting #confirm-password').val(``);
    }
    else {
            fetch('http://localhost:5000/api/user/account/change-password', {      
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        'currentPassword': currPwd,
                        'newPassword': newPwd,
                        'confirmPassword': confirm,
                        }) 
                    }).then(res => res.json()).then(res => {
                if(!(res.newAccessToken))
                    alert('Can not access token')
                else 
                    {
                        alert('Mật khẩu của bạn đã được thay đổi')
                        window.localStorage.setItem("token", res.newAccessToken);
                        token = window.localStorage.getItem('token');
                        console.log(token);
                        $('.setting #current-password').val(``);
                        $('.setting #new-password').val(``);
                        $('.setting #confirm-password').val(``);
                    }
            }).catch(err => {
                alert(err)
            })
        }
});

// upload novel 
$('.uploadNovel').click(async function() {
    let name =  $('.general-information #name').val();
    let gender =  $('.general-information #gender').val();
    let intro = $('.general-information #introduction').val();

    if (name == "" || gender == "")
    { 
        alert("Vui lòng điền đầy đủ tất cả thông tin bắt buộc");
        $('.general-information #name').val(`${user.user.displayName}`);
        $('.general-information #gender').val(`${user.user.gender}`);
    }

    else {
        try {
            let formData = new FormData();
            formData.append('displayName', name);
            
            formData.append('gender', gender);

            const res = await fetch('http://localhost:5000/api/user/account', {      
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'enctype': 'multipart/form-data',
                },
                body: formData,
            })
            alert('Cập nhật thông tin cá nhân thành công');
          
            location.reload();
        }
        catch(e) {
            alert('Cập nhật thông tin cá nhân thành công');
        }
    }

  
});


const displayInfoPage = (user) => {
    $('.info .username').html(`${user.user.displayName} <span class="badge p-2 bg-primary mx-3 px-3" style="border-radius: 8rem;">Lv.1</span>`);
    $('.info .novels').html(`${follow.follows.length}`);
    $('.info .comments').html(`${comment.comments.length}`);
    if(user.user.avatar) {
        $('.info .avatar').attr('src', `${user.user.avatar}`);
    }
}

const displayGeneralInformationPage = (user) => {
    $('.general-information #name').val(`${user.user.displayName}`);
    $('.general-information #gender').val(`${user.user.gender}`);
    $('.general-information #email').val(`${user.user.email}`);
    if(user.user.description) {
        $('.general-information #introduction').val(`${user.user.description}`);
    }
    if(user.user.avatar) {
        $('.general-information .profile-pic').attr('src', `${user.user.avatar}`);
    }
}

const displayFollowPage = (novels) => {
    let htmlString;

    htmlString = novels.map((novel) => {
        return `
             <li class="reading-list-item d-flex justify-content-between">
                                            <div class="row">
                                                <div class="col-1">
                                                    <a href="http://localhost:3000/novel/${novel.novelId}" class="item-img">
                                                        <img src="${novel.cover}" alt="" width="58" height="80">
                                                    </a>
                                                </div>
                                                <div class="col-11">
                                                    <div class="item-body">
                                                        <h2><a href="http://localhost:3000/novel/${novel.novelId}" class="item-body-title">${novel.novelTitle}</a></h2>
                                                        <div class="text-muted text-overflow-1-lines">
                                                            Đã đọc: ${novel.readChapters} chương
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-center" >
                                                <button value="${novel.novelId}" onclick="deleteFollow(event)" type="submit" class="btn btn-outline-danger delete-follow" >Xóa</button>
                                            </div>
                                        </li>
        `;
    })
    .join('');

    $('.novel-following .reading-list').html(htmlString);
        
}

const displayBookmarkPage = (novels) => {
    let htmlString;

    htmlString = novels.map((novel) => {
        return `
             <li class="reading-list-item d-flex justify-content-between">
                                            <div class="row">
                                                <div class="col-1">
                                                    <a href="http://localhost:3000/novel/${novel.novelId}" class="item-img">
                                                        <img src="${novel.cover}" alt="" width="58" height="80">
                                                    </a>
                                                </div>
                                                <div class="col-11">
                                                    <div class="item-body">
                                                        <h2><a href="http://localhost:3000/novel/${novel.novelId}" class="item-body-title">${novel.novelTitle}</a></h2>
                                                        <div><a href="http://localhost:3000/novel/${novel.novelId}/chapter/${novel.chapterId}" class="text-overflow-1-lines d-inline-block">
                                                            Đang đọc: chương ${novel.chapterOrder} 
                                                        </a></div>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                            <div class="d-flex justify-content-center">
                                                <button value="${novel.novelId}/${novel.chapterId}" onclick="deleteBookmark(event)" class="btn btn-outline-danger delete-bookmark" >Xóa</button>
                                            </div>
                                            
                                        </li>
        `;
    })
    .join('');

    $('.bookmark .reading-list').html(htmlString);
}

const getGenres = (genres) => {
    let htmlString;
    htmlString = genres.map((genre) => {
        return `
            <option value="${genre.genreId}">${genre.name}</option>
        `;
    })
        .join('');
   
    $('.upload-novel .form-select').html(htmlString);
};