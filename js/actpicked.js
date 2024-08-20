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
    const act = urlParams.get('act');

    if (act) {
        try {
            const actData = JSON.parse(decodeURIComponent(act));

            document.title =  actData.name; //------->
            document.querySelector(".movie-img").src = actData.image;
            document.querySelector(".movie-img").alt = actData.name;
            document.querySelector(".title").innerHTML = actData.name;
            let catDivs = document.querySelector(".year");
            for(let i = 0; i < actData.categories.length; i++){
                let newsDate = document.createElement("p");
                newsDate.innerHTML = actData.categories[i] + ",";
                newsDate.classList.add("news-date");
                newsDate.classList.add("born-cat");
                catDivs.appendChild(newsDate);
            }
            document.querySelector(".desc").innerHTML = actData.info || "No Description";

        } catch (error) {
            console.error('Error parsing movie data:', error);
        }
    }





};