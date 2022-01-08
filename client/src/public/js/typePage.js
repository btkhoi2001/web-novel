$(".mobile-navbar-btn").click(function(){
    $(".mobile-navbar").toggleClass('d-none');
});
$(".mobile-item-link").click(function(){
    $(this).parent(".mobile-navbar-items").children(".mobile-droplist").toggleClass('d-none');
});

$('html').click(function() {
    $('.search-menu').empty();
    $('.notification-menu').addClass('d-none'); 
}); 
$('.notification-btn').click(function(event) {
    event.stopPropagation();
    $('.notification-menu').toggleClass('d-none'); 
}); 
$('.notification-menu').click(function (event) {
    event.stopPropagation();
});



const novelLists = document.querySelector('.search-menu');
const genreLists = document.querySelector('.droplist-fluid');
const searchBar = document.getElementById('searchBar');
const genreSidebar = document.querySelector('.col-3 .classification-list')
const chart = document.querySelector('.top-novels');
const pagination = document.querySelector('.pagination');


const novelsPerPage = 10;
let totalPages ;
let currentPage = 1;
let sortRatingsOfNovels = [];
let listOfNovels = [];
let listOfGenres = [];

const loadPage = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/novel');
        const novels = await res.json();
        const res2 = await fetch('http://localhost:5000/api/novel/genre');
        const genres = await res2.json();
        listOfNovels = novels.novels;
        listOfNovels = listOfNovels.filter((novel) => {
            return (novel.genreId == genreID);
        });
        sortRatingsOfNovels = sortRatings(listOfNovels);
        totalPages = Math.ceil(sortRatingsOfNovels.length / 10);
        listOfGenres = genres.genres;     
        displayGenres(listOfGenres);
        displayChartPage(sortRatingsOfNovels, currentPage);
        displayGenreTitle();
        display();
        // scroll to section title
        document.body.scrollTop = 400; // For Safari
        document.documentElement.scrollTop = 400; // For Chrome, Edge, ...

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
    let htmlString, htmlStr;
    htmlString = genres.map((genre) => {
        return `
                <a href="/genre/${genre.genreId}" class="">
                    ${genre.name}
                </a> 
        `;
    })
        .join('');

    genreLists.innerHTML = htmlString;

    htmlStr = genres.map((genre) => {
        if (genre.genreId == genreID)
            return `
                    <li class="active"><a href="/genre/${genre.genreId}"> ${genre.name}</a></li>
                `;
        else
            return `
                <li><a href="/genre/${genre.genreId}"> ${genre.name}</a></li>
            `;
    })
        .join('');

    genreSidebar.innerHTML = htmlStr;
};

const displayGenreTitle = () => {
    let title = listOfGenres[genreID-1].name;
    $('.col-9 .section-title').empty();
    $('.col-9 .section-title').append(
        `
            <span>${title}</span>
        `
    )
}

const sortRatings = (data) => {
    let sortedData;

    sortedData = data.sort(function(a,b){
        return b.rating - a.rating;
    })

    return sortedData;
}

const displayChartPage = (novels, currPage) => {
    let paginationHtmlString = '';
    let contentHtmlString = '';
    let startPage;
    let endPage;
    let list = [];

    // pagination
  
    paginationHtmlString += `
                    <li class="page-item"><button class="page-link" value="${1}">Trang đầu</button></li>
                `;
    if(totalPages <= 5) {
        for(let i = 1; i <= totalPages; i++) {
            paginationHtmlString += `
                    <li class="page-item
                `;
            if(currPage === i) {
                paginationHtmlString += `
                    active
                `;
            }
            paginationHtmlString += `
                    "><button class="page-link" value="${i}">${i}</button></li>
                `;
        }
    }
    else {
        if (currPage > 2) {
            startPage = currPage - 2;
        }
        else {
            startPage = 1;
        }

        if (currPage < totalPages -2 ) {
            endPage = currPage + 2;
        }
        else {
            endPage = totalPages;
        }

        for(let i = startPage; i <= endPage; i++) {
            paginationHtmlString += `
                    <li class="page-item
                `;
            if(currPage === i) {
                paginationHtmlString += `
                    active
                `;
            }
            paginationHtmlString += `
                    "><button class="page-link" value="${i}">${i}</button></li>
                `;
        }
    }
    paginationHtmlString += `
                    <li class="page-item"><button class="page-link" value="${totalPages}">Trang cuối</button></li>
                `;
    pagination.innerHTML = paginationHtmlString;

    // show content 
    if (currPage === totalPages) {
        list = novels.slice((currPage-1)*10, novels.length);
    }
    else {
        list = novels.slice((currPage-1)*10, currPage*10);
    }
    contentHtmlString = list.map((novel, index) => {
        let result =`
            <li class="media py-5 border-bottom d-flex">
                <div class="rank d-flex align-items-center">
        `
        if(index === 0 && currPage === 1) {
            result += `
                    <img src="https://metruyenchu.com/assets/images/icons/medal-1.svg" alt="">
                </div>
            `
        }
        else if(index === 1 && currPage === 1) {
            result += `
                    <img src="https://metruyenchu.com/assets/images/icons/medal-2.svg" alt="">
                </div>
            `
        }
        else if(index === 2 && currPage === 1) {
            result += `
                    <img src="https://metruyenchu.com/assets/images/icons/medal-3.svg" alt="">
                </div>
            `
        }
        else {
            result += `
                    <span class="rank-number"> ${index+1+(currPage-1)*10} </span>
                </div>
            `
        }

        result += `
                    <a href="/novel/${novel.novelId}" class="mt-1 mx-4">
                        <img alt="" height="116" width="78" src="${novel.cover}" lazy="loaded"> 
                    </a> 
                    <div class="media-body">
                        <h2 class="mb-2" style="font-size: 1.6rem;">
                            <a href="/novel/${novel.novelId}" >${novel.title}</a>
                        </h2> 
                        <div class="text-secondary text-ellipsis--3">
                        ${novel.description}
                        </div> 
                        <ul class="list-unstyled d-flex flex-wrap mb-0 mt-3 text-secondary">
                            <li class="d-flex align-items-center me-4">
                                <i class="fas fa-user"></i> <span class="mx-1">${novel.authorName}</span>
                            </li>
                            <li class="d-flex align-items-center me-4">
                                <i class="fas fa-fire"></i> <span class="mx-1">${novel.rating}</span>
                            </li> 
                            <li>
                                <span class="d-block border border-primary small px-3 py-1 text-primary cursor-pointer">
                                   Chương ${novel.lastChapter.chapterOrder}
                                </span>
                            </li>
                        </ul>
                    </div>
                </li>
        `
        return result;
    })
        .join('');
   
    chart.innerHTML = contentHtmlString;
}

const display = async () => {
    $('.page-link').click(function(e) {
        let value = e.target.value;
        currentPage = parseInt(value);
        displayChartPage(sortRatingsOfNovels, currentPage);
        // scroll to section title
        document.body.scrollTop = 400; // For Safari
        document.documentElement.scrollTop = 400; 
        display();
    })
}
