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
    const movieData = urlParams.get('movie');

    if (movieData) {
        try {
            const movie = JSON.parse(decodeURIComponent(movieData));
            document.title =  movie.title; //------->
            document.querySelector(".movie-img").src = movie.image;
            document.querySelector(".movie-img").alt = movie.title;
            document.querySelector(".title").innerHTML = movie.title;
            document.querySelector(".year").innerHTML = movie.year;
            document.querySelector(".timeline").innerHTML = movie.timeline;
            document.querySelector(".desc").innerHTML = movie.description || "No Description";
            document.querySelector(".rating").innerHTML = movie.imdbRating.match(/^\d+\.\d+/)[0];
            if( document.querySelector(".rating-count")){
                document.querySelector(".rating-count").innerHTML = movie.imdbRating.match( /\(\d+K\)$/)[0];
            }
            document.querySelector(".mLink").href = movie.link;

        } catch (error) {
            console.error('Error parsing movie data:', error);
        }
    }





};