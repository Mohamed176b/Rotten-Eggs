import {
    getBornToday, 
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

    
    getBornToday()
    .then(data => {
        let movsNewsBox = document.getElementById("news-box");
        data.list.forEach(act => {
            let {info, name, image} = act;
            let newsImg = document.createElement("img");
            newsImg.alt = name;
            newsImg.src = image || "../imgs/newsAlt.jpg";
            newsImg.classList.add("news-img");
            newsImg.classList.add("act-born-img");
            let newsImgDiv = document.createElement("div");
            newsImgDiv.classList.add("news-img-div");
            newsImgDiv.classList.add("born-img-div");
            newsImgDiv.appendChild(newsImg);
            let newsDescDiv = document.createElement("div");
            newsDescDiv.classList.add("news-desc-div");
            let newsTitle = document.createElement("h5");
            newsTitle.innerHTML = name;
            newsTitle.classList.add("news-title");


            let catDivs = document.createElement("div");
            catDivs.classList.add("cat-divs");

            for(let i = 0; i < act.categories.length; i++){
                let newsDate = document.createElement("p");
                newsDate.innerHTML = act.categories[i] + ",";
                newsDate.classList.add("news-date");
                newsDate.classList.add("born-cat");
                catDivs.appendChild(newsDate);
            }
            

            let newsDesc = document.createElement("p");
            newsDesc.innerHTML = info;
            newsDesc.classList.add("news-desc")
            newsDescDiv.appendChild(newsTitle);
            newsDescDiv.appendChild(catDivs);
            newsDescDiv.appendChild(newsDesc);
            let newNews = document.createElement("a");
            newNews.classList.add("new-news");
            let actData = encodeURIComponent(JSON.stringify(act));
            newNews.href = `act.html?act=${actData}`;
            newNews.appendChild(newsImgDiv); 
            newNews.appendChild(newsDescDiv);
            movsNewsBox.appendChild(newNews);
        })
    })
    .catch(error => {
        console.error('Failed to fetch Born Today:', error);
    });
    
};