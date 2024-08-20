import {
    getMoviesByGenre, 
} from './fetchs.js';


window.onload = () => {
    let search = document.getElementById("search");
    let magIcon = document.getElementById("mag-icon");
    search.onfocus = () => {
        magIcon.classList.add("fa-fade")
    };
    search.onblur = () => {
        magIcon.classList.remove("fa-fade")
    };

    async function handleSearch() {
        let searchValid = false;
        let searchValue = search.value;
        if (searchValue !== "") {
            searchValid = true;
        }
        if (searchValid) {
            location.href = `search.html?search=${searchValue}`;
        }
    }
    magIcon.onclick = handleSearch;
    search.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('cat');


    document.title = cat.toUpperCase();
    document.querySelector(".sec-p").innerHTML = cat.toUpperCase();
    

    getMoviesByGenre(cat)
    .then(data => {
        return data.movies;
    })
    .then(data => {
        let upMovDiv = document.getElementById("up-mas-box");
        for(let i = 0; i < data.length; i++){
                let upTitle = data[i].title;
                let upImg = data[i].image;
                let catRate = data[i].imdbRating;

                let upImgDiv = document.createElement("img");
                upImgDiv.classList.add("up-img");
                upImgDiv.alt = upTitle;
                upImgDiv.src = upImg;

                let upDescDiv = document.createElement("div");
                let upH = document.createElement("h5");
                upH.innerHTML = upTitle;
                upH.classList.add("up-h");
                let rateP = document.createElement("p");
                rateP.innerHTML = catRate;
                rateP.classList.add("up-p");
                upDescDiv.appendChild(upH);
                upDescDiv.appendChild(rateP);

                let upcomingCard = document.createElement("a");
                let movieData = encodeURIComponent(JSON.stringify(data[i]));
                upcomingCard.href = `movie.html?movie=${movieData}`;
                upcomingCard.classList.add("up-card");
                upcomingCard.classList.add("up-card2");
                upcomingCard.appendChild(upImgDiv);
                upcomingCard.appendChild(upDescDiv);
                upMovDiv.appendChild(upcomingCard);
            }
    })
    .catch(error => {
        console.error('Failed to fetch Movies By Genre:', error);
    });

};



