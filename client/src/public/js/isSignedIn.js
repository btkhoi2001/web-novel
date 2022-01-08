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
       
        $('.user-name').empty();
        $('.user-name').append(`${User.user.displayName}`);
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