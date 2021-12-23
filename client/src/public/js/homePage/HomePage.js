// Search novel function
const novelLists = document.querySelector('.search-menu');
const genreLists = document.querySelector('.droplist-fluid');
const searchBar = document.getElementById('searchBar');
const hotNovels = document.querySelector('.hot-novels');


let listOfNovels = [];
let listOfGenres = [];

const loadPage = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/novel');
        const novels = await res.json();
        const res2 = await fetch('http://localhost:5000/api/novel/genre');
        const genres = await res2.json();
        listOfNovels = novels.novels;
        listOfGenres = genres.genres;     
        displayGenres(listOfGenres);
        displayNovels(listOfNovels);
    } catch (err) {
        console.error(err);
    }
};

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
                    <a href="/novel/${novel.novelId.toString()}" class="d-block">
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
                    <a href="/novel/${novel.novelId.toString()}" class="">
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
                <a href="/genre/${genre.genreId.toString()}" class="">
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
        for (i = 0; i < 12; i++) {
            results.push(novels[i]);
        }
    htmlString = results.map((novel) => {
        let result = ` 
            <div class="item col-lg-2 col-sm-3 col-4">
                <a href="/novel/${novel.novelId.toString()}" class="">`;
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

