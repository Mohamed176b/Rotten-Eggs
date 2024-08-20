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
    const news = urlParams.get('news');

    if (news) {
        try {
            const newsData = JSON.parse(decodeURIComponent(news));
            document.title =  newsData.title; //------->
            document.querySelector(".movie-img").src = newsData.image || "../imgs/newsAlt.jpg";
            document.querySelector(".movie-img").alt = newsData.title;
            document.querySelector(".title").innerHTML = newsData.title;
            document.querySelector(".year").innerHTML = newsData.date;
            document.querySelector(".timeline").innerHTML = newsData.source;
            document.querySelector(".desc").innerHTML = newsData.description || "No Description";
            document.querySelector(".mLink").href = newsData.link;
            document.querySelector(".writer").innerHTML += newsData.writer || "";

        } catch (error) {
            console.error('Error parsing movie data:', error);
        }
    }





};