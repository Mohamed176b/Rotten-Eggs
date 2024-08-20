import {
    upcomingMovies, 
    upcomingSeries, 
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
    const upcoming = urlParams.get('upcoming');


    function getUpcoming(opt){
        let myPromise; 
        if(opt === "movies") {
            myPromise = upcomingMovies()
            .then(data => {
                data.movies.length = 5
                return data.movies;
            })
        }else {
            myPromise = upcomingSeries()
            .then(data => {
                data.list.length = 5
                return data.list;
            })
        }
        myPromise.then(data => {
            let upMovDiv = document.getElementById("up-mas-box");
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].list.length; j++) {
                    let upDate = data[i].date;
                    let upTitle = data[i].list[j].title;
                    let upImg = data[i].list[j].image || "../imgs/tvShowAlt.jpg";

                    let upImgDiv = document.createElement("img");
                    upImgDiv.classList.add("up-img");
                    upImgDiv.alt = upTitle;
                    upImgDiv.src = upImg;

                    let upDescDiv = document.createElement("div");
                    let upH = document.createElement("h5");
                    upH.innerHTML = upTitle;
                    upH.classList.add("up-h");
                    let upDateP = document.createElement("p");
                    upDateP.innerHTML = upDate;
                    upDateP.classList.add("up-p");
                    upDescDiv.appendChild(upH);
                    upDescDiv.appendChild(upDateP);

                    let upcomingCard = document.createElement("a");
                    let upData = encodeURIComponent(JSON.stringify(data[i].list[j]));
                    let upDateData = encodeURIComponent(JSON.stringify(data[i].date));
                    upcomingCard.href = `upmovie.html?up=${upData}&date=${upDateData}`;
                    upcomingCard.classList.add("up-card");
                    upcomingCard.classList.add("up-card2");
                    upcomingCard.appendChild(upImgDiv);
                    upcomingCard.appendChild(upDescDiv);
                    upMovDiv.appendChild(upcomingCard);
                }
            }
        })
        .catch(error => {
                    console.error('Failed to fetch Upcoming Movies:', error);
                    resultsDiv.innerHTML = "<div style='color: #ac1b1b; font-size: 25px; font-weight: bold; margin: 0 auto'>Sorry, an error has occurred</div>";
        });
    }

    if(upcoming === "movies"){
        document.title += " Movies";
        document.querySelector(".sec-p").innerHTML += " Movies";
        getUpcoming("movies");
    } else if (upcoming === "tvshows"){
        document.title += " Tv Shows";
        document.querySelector(".sec-p").innerHTML += " TV Shows";
        getUpcoming("tvshows");
    } else {
        document.title = "Error";
        document.querySelector(".sec-p").innerHTML = "Page Not Found";
        
    }

};