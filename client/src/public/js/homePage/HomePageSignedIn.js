
// Search novel function
const novelLists = document.querySelector('.search-menu');
const genreLists = document.querySelector('.droplist-fluid');
const searchBar = document.getElementById('searchBar');
const hotNovels = document.querySelector('.hot-novels');
const recentlyUpdatedNovels = document.querySelector('.update-novels')

let User;
let listOfNovels = [];
let listOfGenres = [];
let listOfRecentlyUpdated = []

const loadPage = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/novel');
        const novels = await res.json();
        const res2 = await fetch('http://localhost:5000/api/novel/genre');
        const genres = await res2.json();
        const res3 = await fetch('http://localhost:5000/api/novel?sortBy=update');
        const updatedNovels = await res3.json();
        listOfRecentlyUpdated = updatedNovels.novels
        listOfNovels = novels.novels;
        listOfGenres = genres.genres;     
        displayGenres(listOfGenres);
        displayNovels(listOfNovels);
        displayRecentlyUpdatedNovels(listOfRecentlyUpdated);
    } catch (err) {
        console.error(err);
    }
};

const loadUser = async () => {
    try {
        const token = window.localStorage.getItem('token');
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

loadUser()
loadPage();


// Search novel names
searchBar.addEventListener('keyup',  (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredNovels = listOfNovels.filter((novel) => {
        return ( novel.title.toLowerCase().includes(searchString) );
    });
    novelLists.innerHTML = '' ;
    if ((searchString.length !== 0) && (searchString !== ' '))
        // show first 10 results
        displaySearchResults(filteredNovels, 10);
});


const displaySearchResults = (novels, length) => {
    let htmlString;

    if (novels.length === 0) {
        htmlString =  `
                <li style="color:red; font-size: 1.4rem">
                    Truyện bạn tìm không có !
                </li>
            `;
    }
    else if (novels.length <= length){
        htmlString = novels.map((novel) => {
            return `
                <li class="">
                    <a href="/novel/${novel.novelId}" class="d-block">
                        ${novel.title}
                    </a> 
                </li>
            `;
        })
        .join('');
    }
    else {
        let results = [];
        for (i = 0; i < length; i++) {
            results.push(novels[i]);
        }
        htmlString = results.map((novel) => {
            return `
                <li class="">
                    <a href="/novel/${novel.novelId}" class="">
                        ${novel.title}
                    </a> 
                </li>
            `;
        })
        .join('');
    }
    novelLists.innerHTML = htmlString;
};

const displayGenres = (genres) => {
    let htmlString;
    htmlString = genres.map((genre) => {
        return `
                <a href="/genreS/${genre.genreId}" class="">
                    ${genre.name}
                </a> 
        `;
    })
        .join('');
   
    genreLists.innerHTML = htmlString;
};


const displayNovels = (novels) => {
    let htmlString;
    let results = [];
    let len;

    if(novels.length < 12) {
        len = novels.length;
    }
    else {
        len = 12;
    }

    for (i = 0; i < len; i++) {
        results.push(novels[i]);
    }

    htmlString = results.map((novel) => {
        let result = ` 
            <div class="item col-lg-2 col-sm-3 col-4">
                <a href="/novel/${novel.novelId}" class="">`;
        if(novel.isCompleted) {
            result += `<span class="item__fulllabel"></span>`
        }
        result += `
                    <img src="${novel.cover}" alt="${novel.title}" title="${novel.title}" class="item__img">
                    <div class="item__title">
                        <h3 class="novel-title" itemprop="name" title="${novel.title}">${novel.title}</h3>
                    </div>                            
                </a>
            </div>`
        return result;
    }).join('');
   
    hotNovels.innerHTML = htmlString;
};

const displayRecentlyUpdatedNovels = (novels) => {
    let htmlString;
    let results = [];
    let length;

    if(novels.length < 12)
        length = novels.length;
    else 
        length = 12;

    for (i = 0; i < length; i++) {
        results.push(novels[i]);
    }

    htmlString = results.map((novel) => {
        let result = `
        <div class="row">
            <div class="list-col col-xs-9 col-md-6 col-sm-8 col-title d-flex">
                <i class="fas fa-angle-right"></i>
                <a href="/novel/${novel.novelId}" title="${novel.title}">${novel.title}</a>
                <span class="lable-title lable-new">New</span>
                <span class="lable-title lable-hot mx-2">Hot</span>
            </div>
            <div class="list-col hidden-xs col-md-3 col-sm-2 col-category">
                <a href="/genre/${novel.genreId}" title="${novel.genre}">${novel.genre}</a>
            </div>
            <div class="list-col col-xs-3 col-md-3 col-sm-2 col-chap">
                <a href="#" title="${novel.lastChapter.title}">
                    Chương ${novel.lastChapter.chapterOrder}
                </a>
            </div>
        </div>`;

        return result;
    }).join('');
   
    recentlyUpdatedNovels.innerHTML = htmlString;
};

