let User;
let unseen;
let seen;

const loadUser = async () => {
    try {
        const token = window.localStorage.getItem("token");
        console.log(token);
        const res = await fetch(
            "https://api-webnovel.herokuapp.com/api/user/account",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        User = await res.json();

        $(".authen .user").empty();
        if (User.user.avatar) {
            $(".authen .user").append(`
                <img src="${User.user.avatar}" width="28" height="28" style="border-radius:50%;">
                <span class="user-name" style="width:180px; text-align:left;">${User.user.displayName}</span> 
            `);
        } else {
            $(".authen .user").append(`
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${User.user.displayName}</span> 
            `);
        }

        if (User.user.role === "Reader") {
            $(".col-3 .list #upload").addClass("d-none");
            $(".col-3 .list #upload-chapter").addClass("d-none");
            $(".col-3 .list #uploaded-novel").addClass("d-none");
        }

        // get notifications
        const res6 = await fetch(
            `https://api-webnovel.herokuapp.com/api/notification`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        let notification = await res6.json();
        notification = notification.notifications;
        console.log(notification);
        unseen = notification.filter((n) => {
            return !n.isRead;
        });
        seen = notification.filter((n) => {
            return n.isRead;
        });
        displayNotifications(seen, unseen);
        $(".notification-badge").text(`${unseen.length}`);
    } catch (err) {
        console.error(err);
    }
};

// loadUser()
if (window.localStorage.getItem("token")) {
    loadUser();
} else {
    $(".authen").removeClass("dropdown");
}

$(".btn-logout").click(function () {
    window.localStorage.clear();
    window.location.replace(`https://app-webnovel.herokuapp.com/`);
});

const displayNotifications = async (seen, unseen) => {
    let htmlString;
    let unseenNotifications;
    let seenNotifications;

    const res6 = await fetch(`https://api-webnovel.herokuapp.com/api/novel`);
    const n = await res6.json();
    novels = n.novels;

    if (seen.length == 0 && unseen.length == 0) {
        htmlString = `
            <li class="d-flex" style="color: red;">
                Bạn hiện không có thông báo !
            </li> 
        `;
    } else {
        unseenNotifications = unseen
            .map((n) => {
                let novelImage = "";
                let novelID;

                if (n.actionUrl) {
                    let str = n.actionUrl;
                    let tokens = str.split("/novel/");
                    novelID = tokens[1].charAt(0);
                    let novel = novels.filter((n) => {
                        return n.novelId == novelID;
                    })[0];
                    novelImage = novel.cover;
                }

                return `
              
                    <li class="d-flex unseen-message">
                        <a href="https://app-webnovel.herokuapp.com/novel/${novelID}" class="mt-2">
                            <img alt="" height="70" width="50" src="${novelImage}" lazy="loaded"> 
                        </a> 
                        <button value="${n.notificationId}" onclick="setStatus(event)" style="border:none; width:100%;" >
                            <div class="notification-content">
                            <p class="text-ellipsis--4">${n.title}</p>
                            <p class="unseen">Chưa đọc</p>
                            </div>
                        </button>
                    </li> 
                
            `;
            })
            .join("");

        seenNotifications = seen
            .map((n) => {
                let novelImage = "";
                let novelID;
                if (n.actionUrl) {
                    let str = n.actionUrl;
                    let tokens = str.split("/novel/");
                    novelID = tokens[1].charAt(0);
                    let novel = novels.filter((n) => {
                        return n.novelId == novelID;
                    })[0];
                    novelImage = novel.cover;
                }

                return `
           
                <li class="d-flex">
                    <a href="https://app-webnovel.herokuapp.com/novel/${novelID}" class="mt-2">
                        <img alt="" height="70" width="50" src="${novelImage}" lazy="loaded"> 
                    </a> 
                    <button value="${n.notificationId}" onclick="goToChapter(event)" style="border:none; width:100%;" >
                        <div class="notification-content ">
                            <p class="text-ellipsis--4">${n.title}</p>
                            <p class="seen">Đã đọc</p>
                        </div>
                    </button>
                </li> 
            </button>
            `;
            })
            .join("");

        htmlString = unseenNotifications + seenNotifications;
        $(".notification-menu").html(htmlString);
    }
};

const setStatus = (event) => {
    let p = event.target;
    let notificationId;
    notificationId = p.value ? p.value : p.parentNode.parentNode.value;
    console.log(notificationId);
    var notification = unseen.filter((n) => {
        return (n.notificationId = notificationId);
    })[0];

    const token = window.localStorage.getItem("token");
    fetch(
        `https://api-webnovel.herokuapp.com/api/notification/${notificationId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead: true }),
        }
    )
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            console.log(notification.actionUrl);
            if (notification.actionUrl) {
                window.location.replace(
                    `http://localhost:3000${notification.actionUrl}`
                );
            }
        });
};

const goToChapter = async (event) => {
    let p = event.target;
    let notificationId;
    notificationId = p.value ? p.value : p.parentNode.parentNode.value;

    let notification = seen.filter((n) => {
        return (n.notificationId = notificationId);
    })[0];
    console.log(notification.actionUrl);
    if (notification.actionUrl) {
        window.location.replace(
            `http://localhost:3000${notification.actionUrl}`
        );
    }
};
