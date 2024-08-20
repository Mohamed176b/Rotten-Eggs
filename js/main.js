import {
    mostPopularMovies, 
    getAvailableGenres, 
    getMoviesByGenre, 
    upcomingMovies, 
    upcomingSeries, 
    getMovieNews, 
    getCelebritiesNews, 
    getBornToday, 
    getTop250Movies, 
    getTopBoxOffice 
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
            location.href = `pages/search.html?search=${searchValue}`;
        }
    }
    magIcon.onclick = handleSearch;
    search.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });


    function setupScrollButtons(leftButtonId, rightButtonId, containerSelector) {
        const leftButton = document.getElementById(leftButtonId);
        const rightButton = document.getElementById(rightButtonId);
        const container = document.querySelector(containerSelector);
    
        leftButton.addEventListener("click", function() {
            container.scrollBy({
                left: -container.clientWidth,
                behavior: 'smooth'
            });
        });
    
        rightButton.addEventListener("click", function() {
            container.scrollBy({
                left: container.clientWidth,
                behavior: 'smooth'
            });
        });
    }
    setupScrollButtons("arr-left-gen", "arr-right-gen", ".gen-movies");
    setupScrollButtons("arr-left-tre", "arr-right-tre", ".trend-movies");
    setupScrollButtons("arr-left-top", "arr-right-top", ".top-movies");
    


    mostPopularMovies()
    .then(data => {
        return data.movies;
    })
    .then(data => {
        let trendingSliderData = data.slice(0, 8);
        let index = 0;
        let sliderCon = document.querySelector(".slider");
        let mTitleH = document.createElement("h2");
        mTitleH.classList.add("slider-Title");
        let mLinkA = document.createElement("a");
        mLinkA.classList.add("slider-link");
        let mImdbRatingP = document.createElement("p");
        mLinkA.innerHTML = "Know More";
        mLinkA.target = "_blank";
        mImdbRatingP.classList.add("slider-rate");
        let mDescDiv = document.createElement("div");
        mDescDiv.classList.add("slider-desc-div");
        let imdbRDiv = document.createElement("div");
        imdbRDiv.classList.add("rate-div");
        imdbRDiv.innerHTML = `<i class="fa-brands fa-imdb"></i>`;
        mDescDiv.appendChild(mTitleH);
        imdbRDiv.appendChild(mImdbRatingP); 
        mDescDiv.appendChild(imdbRDiv);
        mDescDiv.appendChild(mLinkA);
        sliderCon.appendChild(mDescDiv);
        function updateSlider(){
            let mTitle = trendingSliderData[index].title;
            let mImg = trendingSliderData[index].image;
            let mLink = trendingSliderData[index].link;
            let mImdbRating = trendingSliderData[index].imdbRating;
            sliderCon.style.backgroundImage = `url('${mImg}')`;
            mTitleH.innerHTML = mTitle;
            mImdbRatingP.innerHTML = mImdbRating; 
            mLinkA.href = mLink; 
            index++;
            if (index === trendingSliderData.length) {
                index = 0;
            }
        }
        updateSlider(); 
        setInterval(updateSlider, 7000);
        return data;
    })
    .then(data => {
        let trendMoviesDiv = document.querySelector(".trend-movies");
        trendMoviesDiv.innerHTML = ''; 
        data.forEach(movie => {
            let { title, image, imdbRating } = movie;
            let imdbRDivTrend = document.createElement("div");
            imdbRDivTrend.classList.add("rate-div2");
            imdbRDivTrend.innerHTML = `<i class="fa-solid fa-star"></i>`;
            let mTitleHTrend = document.createElement("h5");
            mTitleHTrend.innerHTML = title;
            let trendMImg = document.createElement("img");
            trendMImg.src = image;
            trendMImg.loading = "lazy";
            trendMImg.alt = title;
            trendMImg.classList.add("gen-img");
            let trendmImgDiv = document.createElement("div");
            trendmImgDiv.classList.add("movie-img-div");
            trendmImgDiv.appendChild(trendMImg);
            let trendMRateP = document.createElement("p");
            trendMRateP.innerHTML = imdbRating;
            imdbRDivTrend.appendChild(trendMRateP);
            let trendMDescDiv = document.createElement("div");
            trendMDescDiv.classList.add("gen-movie-desc");
            trendMDescDiv.appendChild(mTitleHTrend);
            trendMDescDiv.appendChild(imdbRDivTrend);
            let movieCard = document.createElement("a");
            let movieData = encodeURIComponent(JSON.stringify(movie));
            movieCard.href = `pages/movie.html?movie=${movieData}`;
            movieCard.classList.add("movie-card")
            movieCard.appendChild(trendmImgDiv);
            movieCard.appendChild(trendMDescDiv);
            trendMoviesDiv.appendChild(movieCard);
        });
        trendMoviesDiv.addEventListener('wheel', function(event) {
            if (event.deltaY !== 0) {
                const scrollAmount = event.deltaY;
                this.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
                event.preventDefault();
            }
        });
    }) 
    .catch(error => {
        console.error('Failed to fetch movie:', error);
        resultsDiv.innerHTML = "<div style='color: #ac1b1b; font-size: 25px; font-weight: bold; margin: 0 auto'>Sorry, an error has occurred</div>";
    });

    let genValue = "action";
    getAvailableGenres()
        .then(data => {
            const genres = data.genres;
            let gensDiv = document.querySelector(".gens");
            genres.forEach(genre => {
                let genersDiv = document.createElement("div");
                genersDiv.innerHTML = genre.toUpperCase();
                genersDiv.setAttribute("data-var", genre);
                genersDiv.classList.add("gener");
                gensDiv.appendChild(genersDiv);
                genersDiv.addEventListener("click", function() {
                    genValue = this.getAttribute("data-var"); 
                    updateMovies(genValue);
                });
            });
            gensDiv.addEventListener('wheel', function(event) {
                if (event.deltaY !== 0) {
                    const scrollAmount = event.deltaY;
                    this.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                    event.preventDefault();
                }
            });
        })
        .catch(error => {
            console.error('Failed to fetch Available Genres:', error);
        });

    updateMovies(genValue);
    function updateMovies(genre) {
        getMoviesByGenre(genre)
        .then(data => {
            return data.movies;
        })
        .then(data => {
            let genMoviesDiv = document.querySelector(".gen-movies");
            genMoviesDiv.innerHTML = ''; 
            document.querySelectorAll(".gener").forEach(gener => {
                gener.classList.remove("gener-active");
                if(gener.getAttribute("data-var") === genValue){
                    gener.classList.add("gener-active");
                }
            });
            data.forEach(movie => {
                let { title, image, imdbRating } = movie;
                let imdbRDiv2 = document.createElement("div");
                imdbRDiv2.classList.add("rate-div2");
                imdbRDiv2.innerHTML = `<i class="fa-solid fa-star"></i>`;
                let gMTitleH = document.createElement("h5");
                gMTitleH.innerHTML = title;
                let gMImg = document.createElement("img");
                gMImg.src = image;
                gMImg.loading = "lazy";
                gMImg.alt = title;
                gMImg.classList.add("gen-img");
                let gmImgDiv = document.createElement("div");
                gmImgDiv.classList.add("movie-img-div");
                gmImgDiv.appendChild(gMImg);
                let gMRateP = document.createElement("p");
                gMRateP.innerHTML = imdbRating;
                imdbRDiv2.appendChild(gMRateP);
                let gMDescDiv = document.createElement("div");
                gMDescDiv.classList.add("gen-movie-desc");
                gMDescDiv.appendChild(gMTitleH);
                gMDescDiv.appendChild(imdbRDiv2);
                let movieCard = document.createElement("a");
                let movieData = encodeURIComponent(JSON.stringify(movie));
                movieCard.href = `pages/movie.html?movie=${movieData}`;
                movieCard.classList.add("movie-card")
                movieCard.appendChild(gmImgDiv);
                movieCard.appendChild(gMDescDiv);
                genMoviesDiv.appendChild(movieCard);
            });
            genMoviesDiv.addEventListener('wheel', function(event) {
                if (event.deltaY !== 0) {
                    const scrollAmount = event.deltaY;
                    this.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                    event.preventDefault();
                }
            });
        })
        .catch(error => {
            console.error('Failed to fetch Movies By Genre:', error);
        });
    }

    upcomingMovies()
        .then(data => {
            data.movies.length = 3;
            return data.movies;
        })
        .then(data => {
            let upMovDiv = document.getElementById("up-ms-box");
            for(let i = 0; i < data.length; i++){
                let upDate = data[i].date;
                let upTitle = data[i].list[0].title.match(/^(.*?)(?=\s\(\d{4}.*?\))/)[0];
                let upImg = data[i].list[0].image || "imgs/tvShowAlt.jpg";
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
                let upData = encodeURIComponent(JSON.stringify(data[i].list[0]));
                let upDateData = encodeURIComponent(JSON.stringify(data[i].date));
                upcomingCard.href = `pages/upmovie.html?up=${upData}&date=${upDateData}`;
                upcomingCard.classList.add("up-card");
                upcomingCard.appendChild(upImgDiv);
                upcomingCard.appendChild(upDescDiv);
                upMovDiv.appendChild(upcomingCard);
            }
        })
        .catch(error => {
                    console.error('Failed to fetch Upcoming Movies:', error);
        });

    upcomingSeries()
        .then(data => {
            data.list.length = 3;
            return data.list;
        })
        .then(data => {
            let upMovDiv = document.getElementById("up-ss-box");
            for(let i = 0; i < data.length; i++){
                let upDate = data[i].date;
                let upTitle = data[i].list[0].title.match(/^(.*?)(?=\s\(\d{4}.*?\))/)[0];
                let upImg = data[i].list[0].image || "imgs/tvShowAlt.jpg";
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
                let upData = encodeURIComponent(JSON.stringify(data[i].list[0]));
                let upDateData = encodeURIComponent(JSON.stringify(data[i].date));
                upcomingCard.href = `pages/upmovie.html?up=${upData}&date=${upDateData}`;
                upcomingCard.classList.add("up-card");
                upcomingCard.appendChild(upImgDiv);
                upcomingCard.appendChild(upDescDiv);
                upMovDiv.appendChild(upcomingCard);
            }
        })
        .catch(error => {
                    console.error('Failed to fetch Upcoming TV Shows:', error);
        });

    getMovieNews()
        .then(data => {
            data.news.length = 2;
            return data;
        })
        .then(data => {
            let movsNewsBox = document.getElementById("movs-news-box");
            data.news.forEach(news => {
                let {date, description, title, image} = news;
                let newsImg = document.createElement("img");
                newsImg.alt = title;
                newsImg.src = image || "imgs/newsAlt.jpg";
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
                newNews.href = `pages/newsdetails.html?news=${newsData}`;
                newNews.appendChild(newsImgDiv); 
                newNews.appendChild(newsDescDiv);
                movsNewsBox.appendChild(newNews);
            })
        })
        .catch(error => {
            console.error('Failed to fetch Movie News:', error);
        });

    getCelebritiesNews()
        .then(data => {
            data.news.length = 2;
            return data;
        })
        .then(data => {
            let celNewsBox = document.getElementById("cel-news-box");
            data.news.forEach(news => {
                let {date, description, title, image} = news;
                let newsImg = document.createElement("img");
                newsImg.alt = title;
                newsImg.src = image || "imgs/newsAlt.jpg";
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
                newNews.href = `pages/newsdetails.html?news=${newsData}`;
                newNews.appendChild(newsImgDiv); 
                newNews.appendChild(newsDescDiv);
                celNewsBox.appendChild(newNews);
            })
        })
        .catch(error => {
            console.error('Failed to fetch Movie News:', error);
        });

    getBornToday()
        .then(data => {
            data.list.length = 5;
            return data.list; 
        })
        .then(data => {
            let actsBornDiv = document.querySelector(".acts-born");
            data.forEach(act => {
                let {image, name} = act;
                let actImgDiv = document.createElement("div");
                actImgDiv.classList.add("born-act-img");
                let actImg = document.createElement("img");
                actImg.alt = name;
                actImg.src = image;
                actImgDiv.appendChild(actImg);
                let actName = document.createElement("h5");
                actName.classList.add("born-act-name");
                actName.innerHTML = name;
                let actDiv = document.createElement("a");
                actDiv.classList.add("act-born");
                let actData = encodeURIComponent(JSON.stringify(act));
                actDiv.href = `pages/act.html?act=${actData}`;
                actDiv.appendChild(actImgDiv);
                actDiv.appendChild(actName);
                actsBornDiv.appendChild(actDiv);
            });
        })
        .catch(error => {
            console.error('Failed to fetch Born Today:', error);
        });

    getTop250Movies()
        .then(data => {
            let topMoviesDiv = document.querySelector(".top-movies");
            topMoviesDiv.innerHTML = ''; 
            data.movies.forEach((movie, index) => {
                let { title, image, imdbRating } = movie;
                let imdbRDivTrend = document.createElement("div");
                imdbRDivTrend.classList.add("rate-div2");
                imdbRDivTrend.innerHTML = `<i class="fa-solid fa-star"></i>`;
                let mTitleHTrend = document.createElement("h5");
                mTitleHTrend.innerHTML =  title;
                let trendMImg = document.createElement("img");
                trendMImg.src = image;
                trendMImg.loading = "lazy";
                trendMImg.alt = title;
                trendMImg.classList.add("gen-img");
                let trendmImgDiv = document.createElement("div");
                trendmImgDiv.classList.add("movie-img-div");
                trendmImgDiv.appendChild(trendMImg);
                let trendMRateP = document.createElement("p");
                trendMRateP.innerHTML = imdbRating;
                imdbRDivTrend.appendChild(trendMRateP);
                let trendMDescDiv = document.createElement("div");
                trendMDescDiv.classList.add("gen-movie-desc");
                trendMDescDiv.appendChild(mTitleHTrend);
                trendMDescDiv.appendChild(imdbRDivTrend);
                let movieCard = document.createElement("a");
                let movieData = encodeURIComponent(JSON.stringify(movie));
                movieCard.href = `pages/movie.html?movie=${movieData}`;
                movieCard.classList.add("movie-card");
                movieCard.classList.add("top");
                movieCard.setAttribute("top-value", index + 1);
                movieCard.appendChild(trendmImgDiv);
                movieCard.appendChild(trendMDescDiv);
                topMoviesDiv.appendChild(movieCard);
            });

            topMoviesDiv.addEventListener('wheel', function(event) {
                if (event.deltaY !== 0) {
                    const scrollAmount = event.deltaY;
                    this.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                    event.preventDefault();
                }
            });
        })
        .catch(error => {
            console.error('Failed to fetch Top 250 Movies:', error);
        });

    getTopBoxOffice()
        .then(data => {
            return data.movies;
        })
        .then(data => {
            let boxOfficeDiv = document.getElementById("boxOffice");
            for(let i = 0; i < data.length; i++){
                let weekendGross = data[i].weekendGross;
                let totalGross = data[i].totalGross;
                let weeksReleased = data[i].weeksReleased;
                let imdbRating = data[i].imdbRating;
                let upTitle = data[i].title;
                let upImg = data[i].image ;
                let upImgDiv = document.createElement("img");
                upImgDiv.classList.add("up-img");
                upImgDiv.alt = upTitle;
                upImgDiv.src = upImg;
                let upDescDiv = document.createElement("div");
                let upH = document.createElement("h5");
                upH.innerHTML = upTitle;
                upH.classList.add("up-h");
                let descDiv = document.createElement("div");
                let weekendGrossP = document.createElement("p");
                weekendGrossP.innerHTML =  `Weekend Gross: <span>${weekendGross}</Span> `;
                weekendGrossP.classList.add("up-p");
                let totalGrossP = document.createElement("p");
                totalGrossP.innerHTML = `Total Gross: <span>${totalGross}</Span> `;
                totalGrossP.classList.add("up-p");
                let weeksReleasedP = document.createElement("p");
                weeksReleasedP.innerHTML = `Weeks Released: <span>${weeksReleased}</Span> `;
                weeksReleasedP.classList.add("up-p");
                let imdbRatingP = document.createElement("p");
                imdbRatingP.innerHTML = `IMDb Rating: <span>${imdbRating}</Span> `;
                imdbRatingP.classList.add("up-p");
                descDiv.appendChild(weekendGrossP);
                descDiv.appendChild(totalGrossP);
                descDiv.appendChild(weeksReleasedP);
                descDiv.appendChild(imdbRatingP);
                upDescDiv.appendChild(upH);
                upDescDiv.appendChild(descDiv);
                let upcomingCard = document.createElement("a");
                upcomingCard.setAttribute("top-value", i + 1);
                upcomingCard.href = data[i].link;
                upcomingCard.target = "_blank";
                upcomingCard.classList.add("up-card");
                upcomingCard.classList.add("up-card2");
                upcomingCard.classList.add("top");
                upcomingCard.appendChild(upImgDiv);
                upcomingCard.appendChild(upDescDiv);
                boxOfficeDiv.appendChild(upcomingCard);
            }
        })
        .catch(error => {
            console.error('Failed to fetch Top Top Box Office:', error);
        });
};
