let spinnerMain = document.querySelector(".spinner");
let spinnerMovGen = document.querySelector(".spinner-mov-gen");
let spinnerMovTrend = document.querySelector(".spinner-mov-trend");
let spinnerUpcomingMov = document.querySelector(".spinner-upcoming-mov");
let spinnerUpcomingSer = document.querySelector(".spinner-upcoming-ser");
let spinnerNewsMov = document.querySelector(".spinner-news-mov");
let spinnerNewCel = document.querySelector(".spinner-news-cel");
let spinnerBorn = document.querySelector(".spinner-born");
let spinnerTop = document.querySelector(".spinner-mov-top");
let spinnerBoxOffice = document.querySelector(".spinner-boxOffice");
let spinnerSearch = document.querySelector(".spinner");
let spinnerUpcoming = document.querySelector(".spinner-upcoming");
let spinnerNews = document.querySelector(".spinner-news");

async function apiRequest(method, url, key, endpoint, value = null, ...spinners) {
    
    const myHeaders = new Headers({
        "x-apihub-key": key,
        "x-apihub-host": "Movies-Verse.allthingsdev.co",
        "x-apihub-endpoint": endpoint,
        "cache-control": "public, max-age=0, must-revalidate",
        "content-type": "application/json; charset=utf-8",
        "expires": "0",
        "pragma": "no-cache"
    });

    let requestOptions;

    switch (method) {
        case "GET":
            requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };
            break;

        case "POST":
            const raw = JSON.stringify({ query: value });
            requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
            break;

        default:
            throw new Error(`Unsupported method: ${method}`);
    }

    spinners.forEach(spinner => {
        if (spinner) {
            spinner.style.display = "block";
        }
    });
    
    let  maxRetries = 5;
    let retries = 0;
    let success = false;
    let data;

    while (retries < maxRetries && !success) {
        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 429) {
                retries++;
                const retryAfter = response.headers.get('Retry-After');
                const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2 ** retries * 1000; 
                await new Promise(resolve => setTimeout(resolve, delay));
            } else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                data = await response.json();
                success = true;
            }
        } catch (error) {
            if (retries >= maxRetries - 1) {
                spinners.forEach(spinner => {
                    if (spinner) {
                        spinner.style.display = "none";
                    }
                });
                console.error(`Error: ${error}`);
                throw error;
            }
            retries++;
            const delay = 2 ** retries * 1000; 
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    spinners.forEach(spinner => {
        if (spinner) {
            spinner.style.display = "none";
        }
    });

    return data;
}


async function searchMovie(value) {
    return apiRequest("POST", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/search-movies-by-query", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "06344c37-2a53-4936-be17-34568bdc31ab", value, spinnerSearch);
}

async function mostPopularMovies() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/most-popular-movies", "vb17XpacdeHqjKc3C76q-BBbHevW-DlOgQ99QbZHU9IBn9SoRU","611cdfda-546d-4cc9-91ab-bfdac3194613", null , spinnerMain, spinnerMovTrend);
}

async function getAvailableGenres() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/available-genres", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp","462dfdab-8876-412d-af11-765956a494a4", null, spinnerMain);
}

async function getMoviesByGenre(value) {
    return apiRequest("GET", `https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=${value}`, "vb17XpacdeHqjKc3C76q-BBbHevW-DlOgQ99QbZHU9IBn9SoRU", "dae9e3d3-6b6c-4fde-b298-ada2806ae563", null, spinnerMovGen);
}

async function upcomingMovies() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/upcoming-movies", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "4f700f4a-4bd2-4604-8d5b-7b5e4c976c65", null, spinnerUpcoming, spinnerUpcomingMov);
}

async function upcomingSeries() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/upcoming-tv-shows", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "ee6324b5-b074-419b-ac03-9b818d30321f", null, spinnerUpcoming, spinnerUpcomingSer);
}

async function getMovieNews() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-movie-news", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "9f3f88f2-24e7-486e-8360-0c8d1f223079", null, spinnerNews, spinnerNewsMov);
}

async function getCelebritiesNews() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-celebrities-news", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "310bc946-0139-4f0d-a955-1f7ab9e122c9", null, spinnerNews, spinnerNewCel);
}

async function getBornToday() {
    const today = new Date();  
    const month = today.getMonth() + 1; 
    const date = today.getDate(); 
    return apiRequest("GET", `https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-born-by-date?month=${month}&date=${date}`, "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "8d95029b-93c4-47f8-aff1-b5be77d700d9", null, spinnerBorn);
}

async function getTop250Movies() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-250-movies", "FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp", "d3ee0b1f-e51c-46bc-99eb-c660726b0a1b", null, spinnerTop);
}

async function getTopBoxOffice() {
    return apiRequest("GET", "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office","FVxQheBn3q1hsZxJo3AN-CZenfPTVaXzhUvRlvRqhJ9n3YyGGp","5122e0f8-a949-45a9-aedf-5eaf61c6085b", null, spinnerBoxOffice);
}

export {
    mostPopularMovies, 
    getAvailableGenres, 
    getMoviesByGenre, 
    upcomingMovies, 
    upcomingSeries, 
    getMovieNews, 
    getCelebritiesNews, 
    getBornToday, 
    getTop250Movies, 
    getTopBoxOffice,
    searchMovie 
}
