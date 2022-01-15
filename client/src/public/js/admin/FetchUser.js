const token = window.localStorage.getItem('token');

async function FetchUser() {
    const res = await fetch(`http://localhost:5000/api/admin/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const Luser = await res.json();
    DisplayNovels(Luser.users)
}

FetchUser()

function DisplayNovels(users) {
    $('.content > table > tbody').html('')
    for (var i = 0; i < users.length; i++) {
        var item = `
        <tr>
            <td>${users[i].userId}</td>
            <td>${users[i].displayName}</td>
            <td>${users[i].role}</td>
            <td><a href="#" class="edit">Edit</a></td>
            <td><a href="#" class="delete">Delete</a></td>
            <td><a href="#" class="chat">Chat</a></td>
            <td><a href="#banmodal" class="ban" data-toggle="modal">Ban</a></td>
        </tr>
        `
        $('.content > table > tbody').append(item)
    }
}
