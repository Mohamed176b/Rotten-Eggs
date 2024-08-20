import {
    getMovieNews, 
    getCelebritiesNews, 
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
    const news = urlParams.get('news');

    function getNews(news){
        let myPromise;
        if(news === "movies"){
            myPromise = getMovieNews();
        } else {
            myPromise = getCelebritiesNews();
        }
        myPromise.then(data => {
            let movsNewsBox = document.getElementById("news-box");
            data.news.forEach(news => {
                let {date, description, title, image} = news;
                let newsImg = document.createElement("img");
                newsImg.alt = title;
                newsImg.src = image || "../imgs/newsAlt.jpg";
                newsImg.classList.add("news-img");
                let newsImgDiv = document.createElement("div");
                newsImgDiv.classList.add("news-img-div");
                newsImgDiv.appendChild(newsImg);
                let newsDescDiv = document.createElement("div");
                newsDescDiv.classList.add("news-desc-div");
                let newsTitle = document.createElement("h5");
                newsTitle.innerHTML = title;
                newsTitle.classList.add("news-title");
                let newsDate = document.createElement("p");
                newsDate.innerHTML = date;
                newsDate.classList.add("news-date");
                let newsDesc = document.createElement("p");
                newsDesc.innerHTML = description;
                newsDesc.classList.add("news-desc")
                newsDescDiv.appendChild(newsTitle);
                newsDescDiv.appendChild(newsDate);
                newsDescDiv.appendChild(newsDesc);
                let newNews = document.createElement("a");
                newNews.classList.add("new-news");
                let newsData = encodeURIComponent(JSON.stringify(news));
                newNews.href = `newsdetails.html?news=${newsData}`;
                newNews.appendChild(newsImgDiv); 
                newNews.appendChild(newsDescDiv);
                movsNewsBox.appendChild(newNews);
            })
        })
        .catch(error => {
            console.error('Failed to fetch Movie News:', error);
        });
    }

    if(news === "movies"){
        document.title = "Movies News";
        document.querySelector(".sec-p").innerHTML = "Movies News";
        getNews(news);
    } else if (news === "celebrities") {
        document.title = "Celebrities News";
        document.querySelector(".sec-p").innerHTML = "Celebrities News";
        getNews(news);
    } else {
        document.title = "Error";
        document.querySelector(".sec-p").innerHTML = "Page Not Found";
    }

};