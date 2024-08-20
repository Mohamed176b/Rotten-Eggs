import {
    searchMovie
} from './fetchs.js';



let resultsDiv = document.querySelector(".results");

const params = new URLSearchParams(window.location.search);
const searchValue = params.get('search');


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
};
searchMovie(searchValue)
.then(data => {
    return data.d;
})
.then(data => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].i) {
            let imgUrl = data[i].i.imageUrl;
            let mTitle = data[i].l;
            let genre = data[i].q;
            let actors = data[i].s;
            let year = data[i].y;

            let img = document.createElement("img");
            img.src = imgUrl;
            img.loading = "lazy";
            img.alt = mTitle;
            let h = document.createElement("h4");
            h.innerHTML = mTitle;
            h.classList.add("mTitle");

            let pGenre = document.createElement("p");
            pGenre.innerHTML = genre || "";

            let pActors = document.createElement("p");
            pActors.innerHTML = actors || "";

            let pYear = document.createElement("p");
            pYear.innerHTML = year || "";

            let mDesDiv = document.createElement("div");
            mDesDiv.classList.add("result");

            let mDesDiv2 = document.createElement("div");
            mDesDiv2.classList.add("m-des-div2");

            mDesDiv2.appendChild(pYear);
            mDesDiv2.appendChild(pGenre);

            mDesDiv.appendChild(h);
            mDesDiv.appendChild(mDesDiv2);
            mDesDiv.appendChild(pActors);

            let result = document.createElement("div");
            result.classList.add("movie-result");

            result.appendChild(img);
            result.appendChild(mDesDiv);

            resultsDiv.appendChild(result);  
        }
    }
})
.catch(error => {
    console.error('Failed to fetch movie:', error);
    resultsDiv.innerHTML = "<div style='color: #ac1b1b; font-size: 25px; font-weight: bold; margin: 0 auto'>Sorry, an error has occurred</div>";
});

document.title = `Search: ${searchValue}`;
let searchP = document.querySelector(".search-p");
searchP.innerHTML = `Search results for: <span>${searchValue}</span>`




