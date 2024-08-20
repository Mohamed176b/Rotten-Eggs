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
    const movieData = urlParams.get('up');
    const movieDate = urlParams.get('date');

    if (movieData) {
        try {
            const movie = JSON.parse(decodeURIComponent(movieData));

            document.title =  movie.title.match(/^(.*?)(?=\s\(\d{4}\))/)[0]; //------->
            document.querySelector(".movie-img").src = movie.image || "../imgs/tvShowAlt.jpg";
            document.querySelector(".movie-img").alt = movie.title.match(/^(.*?)(?=\s\(\d{4}\))/)[0];
            document.querySelector(".title").innerHTML = movie.title.match(/^(.*?)(?=\s\(\d{4}\))/)[0];
            document.querySelector(".year").innerHTML = `Coming in: ${movieDate}`;
            document.querySelector(".mLink").href = movie.link;

            let categoriesDiv = document.querySelector(".categories");
            for(let i = 0; i < movie.categories.length; i++){
                let cat = document.createElement("a");
                cat.href = `bycat.html?cat=${movie.categories[i].toLowerCase()}`;
                cat.innerHTML = movie.categories[i];
                cat.classList.add("cat");
                categoriesDiv.appendChild(cat);
            }

        
            let actorsDiv = document.querySelector(".actors");
            if(movie.staring.length > 0){
                for(let i = 0; i < movie.staring.length; i++){
                    let act = document.createElement("div");
                    act.innerHTML = movie.staring[i] + ",";
                    act.classList.add("act");
                    actorsDiv.appendChild(act);
                }
            } else {
                actorsDiv.innerHTML = "Not Found";
            }
            

        } catch (error) {
            console.error('Error parsing movie data:', error);
        }
    }





};