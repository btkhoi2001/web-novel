function ReadMoreFunc() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("btn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Xem thêm";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Rút gọn";
    moreText.style.display = "inline";
  }
}
/*show emoticon*/
var postForm = $(".postForm");

function showEmoticon(form) {
  form.find(".emoticonbt").click(function () {
    $(this).parent().find('.emotion-form').toggle();
  });
  form.find(".emotion-form a").click(function () {
    var $input = form.find(".comment-input");
    var txt = $input.val(); console.log(txt);
    $input.val(txt + $(this).text()); $(this).parent().toggle();
  });
}
$(function () { showEmoticon(postForm); });


/* rating */
function StarRating() {
  this.init();
};

StarRating.prototype.init = function() {
  var ebin = this.enterStarListener.bind(this);
  var lebin = this.leaveStarListener.bind(this);
  var check = false;
  this.stars = document.querySelectorAll('#rating span');
  for (var i = 0; i < this.stars.length; i++) {
    this.stars[i].setAttribute('data-count', i);
    this.stars[i].addEventListener('mouseenter', ebin); 
  }
  document.querySelector('#rating').addEventListener('mouseleave', lebin);

  var spans = document.getElementsByClassName("star");
  
  for(var i = 0; i < spans.length; i++){
    spans[i].onclick = function(){
      if(check == false)
          {
            for (var j = 0; j < spans.length; j++)
            {
                spans[j].removeEventListener('mouseenter',ebin);
            }
            document.querySelector('#rating').removeEventListener('mouseleave', lebin);
            check = true;
          }
      else 
          {
            for (var j = 0; j < spans.length; j++)
            {  
              spans[j].addEventListener('mouseenter',ebin);
            }
            document.querySelector('#rating').addEventListener('mouseleave', lebin);
            check = false;
          }
    }
  }
};

/**
 * This method is fired when a user hovers over a single star
 * @param e
 */
StarRating.prototype.enterStarListener = function(e) {
  this.fillStarsUpToElement(e.target);
};

/**
 * This method is fired when the user leaves the #rating element, effectively removing all hover states.
 */
StarRating.prototype.leaveStarListener = function() {
  this.fillStarsUpToElement(null);
};

/**
 * Fill the star ratings up to a specific position.
 * @param el
 */
StarRating.prototype.fillStarsUpToElement = function(el) {
  // Remove all hover states:
  for (var i = 0; i < this.stars.length; i++) {
    if (el == null || this.stars[i].getAttribute('data-count') > el.getAttribute('data-count')) {
      this.stars[i].classList.remove('hover');
    } else {
      this.stars[i].classList.add('hover');
    }
  }
};

// Run:
new StarRating();

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


// Id của truyện hiện tại fetch :
console.log(novelID);