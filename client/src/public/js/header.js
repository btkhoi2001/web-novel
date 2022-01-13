// Header
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
  
  
  // Search novel function
  const novelLists = document.querySelector('.search-menu');
  const genreLists = document.querySelector('.droplist-fluid');
  const searchBar = document.getElementById('searchBar');
  const hotNovels = document.querySelector('.hot-novels');
  const recentlyUpdatedNovels = document.querySelector('.update-novels')
  
  
  let listOfNovels = [];
  let listOfGenres = [];
  let listOfRecentlyUpdated = []
  
  const loadPage = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/novel');
        const novels = await res.json();
        const res2 = await fetch('http://localhost:5000/api/novel/genre');
        const genres = await res2.json();
        listOfNovels = novels.novels;
        listOfGenres = genres.genres;     
        displayGenres(listOfGenres);
        console.log(listOfNovels)
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
    let htmlString;
    htmlString = genres.map((genre) => {
        return `
                <a href="/genre/${genre.genreId}" class="">
                    ${genre.name}
                </a> 
        `;
    })
        .join('');
   
    genreLists.innerHTML = htmlString;
  };