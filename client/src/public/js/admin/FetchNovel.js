const token = window.localStorage.getItem("token");

async function FetchNovel() {
    const res = await fetch(
        `https://api-webnovel.herokuapp.com/api/admin/novel`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const Lnovel = await res.json();
    DisplayNovels(Lnovel.novels);
}

FetchNovel();

function DisplayNovels(novels) {
    $(".content > table > tbody").html("");
    for (var i = 0; i < novels.length; i++) {
        var item = `
        <tr>
            <td>${novels[i].novelId}</td>
            <td>${novels[i].title}</td>
            <td>${novels[i].authorId}</td>
            <td><a href="#" class="edit">Edit</a></td>
            <td><a href="#" class="delete">Delete</a></td>
            <td><a href="#" class="publish">Publish</a></td>
        </tr>
        `;
        $(".content > table > tbody").append(item);
    }
}
