let User;
const loadUser = async () => {
    try {
        const token = window.localStorage.getItem('token');
        console.log(token);
        const res = await fetch('http://localhost:5000/api/user/account', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        User = await res.json();
       
        $('.authen .user').empty();
        
        if(User.user.avatar) {
            $('.authen .user').append(`
                <img src="${User.user.avatar}" width="28" height="28" style="border-radius:50%;">
                <span class="user-name" style="width:180px; text-align:left;">${User.user.displayName}</span> 
            `);
        }
        else {
            $('.authen .user').append(`
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${User.user.displayName}</span> 
            `);
        }
    } catch (err) {
        console.error(err);
    }
};

// loadUser()
if (window.localStorage.getItem('token')) {
    loadUser();
}
else {
    $('.authen').removeClass('dropdown');
}

$('.btn-logout').click(function() {
    window.localStorage.clear();
    window.location.replace(`http://localhost:3000/`)
})