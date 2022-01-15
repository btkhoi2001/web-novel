const token = window.localStorage.getItem('token');
var genresName = []

async function FetchNovel() {
    const res = await fetch(`http://localhost:5000/api/novel/genre`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const Lgenre = await res.json();
    DisplayNovels(Lgenre.genres)
}

FetchNovel()

function DisplayNovels(genres) {
    $('.content > table > tbody').html('')
    for (var i = 0; i < genres.length; i++) {
        genresName[i] = genres[i].name
        var item = `
        <tr>
            <td>${genres[i].genreId}</td>
            <td>${genres[i].name}</td>
            <td><a href="#" class="edit">Edit</a></td>
            <td><a href="#" class="delete">Delete</a></td>
        </tr>
        `
        $('.content > table > tbody').append(item)
    }
    console.log(genresName)
}
