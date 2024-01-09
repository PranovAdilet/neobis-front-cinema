



const handlePaginationClick = (amountPage, getFilmsFunction) => {
    let count = 1

    let pagination = document.querySelector('.main__pagination')
    let list = document.querySelector('.main__list')

    pagination.innerHTML = ""
    amountPage = amountPage ? amountPage <= 20 ? amountPage : 21 : 0


    for (let i = 1; i < amountPage; i++) {
        let spanPage = document.createElement('span')
        spanPage.classList.add('main__pagination-count')
        spanPage.textContent = i
        pagination.appendChild(spanPage)
        spanPage.addEventListener('click', () => {
            count = i
            list.innerHTML = ''
            pagination.innerHTML = ''
            pageCount = i
            getFilmsFunction(getFilmsFunction)
        })
    }
}



const filmsPages = () => {
    let pageCount = 1

    let months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []

    const releases = document.querySelector('.releases')
    const premieres = document.querySelector('.premieres')
    const expected = document.querySelector('.expected')
    const popular = document.querySelector('.popular')
    const favorite = document.querySelector('.favorite')
    const input = document.querySelector('.header__input')
    const form = document.querySelector('.header__form')

    form.addEventListener('submit', (e) => searchFilms(e, input.value))
    premieres.addEventListener('click', () => getPremieresMonth(months))
    expected.addEventListener('click', () => getExpectedFilms(getExpectedFilms))
    popular.addEventListener('click', () => getTopPopular(getTopPopular))
    releases.addEventListener('click', () => getReleasesMonth(months))
    favorite.addEventListener('click', () => displayFavorites())


    const searchFilms = (e, text) => {
        e.preventDefault()

        const URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films?keyword=${text}`

        const list = document.querySelector('.main__list')

        list.innerHTML = ''

        fetch(URL, {
            method: 'GET',
            headers: {
                'X-API-KEY': '74f90391-8e44-460f-b9d2-47e39e76eb34',
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(json => {

                console.log(json)
                let films = json.items

                showFilms(films)
            })
            .catch(err => console.log(err))
    }
    const getReleasesMonth = (months) => {

        let currentYear = new Date().getFullYear()
        let currentMonth = months[new Date().getMonth()]

        const URL = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${currentYear}&month=${currentMonth}`
        const list = document.querySelector('.main__list')

        fetch(URL, {
            method: 'GET',
            headers: {
                'X-API-KEY': '74f90391-8e44-460f-b9d2-47e39e76eb34',
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(json => {
                list.innerHTML = ``
                let films = json.releases
                console.log(json)
                showFilms(films)


            })
            .catch(err => console.log(err))
    }

    const getPremieresMonth = (months) => {

        let currentYear = new Date().getFullYear()
        let currentMonth = months[new Date().getMonth()]

        const URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${currentYear}&month=${currentMonth}`
        fetchRequest(URL)
    }

    const getTopPopular = (getFilmsFunction) => {
        const URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=${pageCount}`
        fetchRequest(URL, getFilmsFunction)
    }

    const getExpectedFilms = (getFilmsFunction) => {
        const URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=${pageCount}`
        fetchRequest(URL, getFilmsFunction)
    }
    const fetchRequest = (URL, getFilmsFunction) => {
        const list = document.querySelector('.main__list')

        fetch(URL, {
            method: 'GET',
            headers: {
                'X-API-KEY': '74f90391-8e44-460f-b9d2-47e39e76eb34',
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(json => {
                list.innerHTML = ``
                let films = json.items
                console.log(json)
                showFilms(films)
            })
            .catch(err => console.log(err))
    }

    const showFilms = (films) => {
        const list = document.querySelector('.main__list')
        films.forEach(film => {
            const item = document.createElement('div')
            item.classList.add('main__item')

            let rating = !film.rating ? 9 : film.rating
            let genres = film.genres.map((item, idx) => ` ${item.genre}`).filter((_, idx) => idx < 3)
            let url = film.posterUrlPreview || film.posterUrl
            let title = film.nameRu || film.nameEn || film.nameOriginal
            let favorite = isFavorite(film.kinopoiskId)

            item.innerHTML = `
                <span class="main__item-rating">${rating.toFixed(1)}</span>
                    <img class="main__item-img" src=${url} alt="">
                    <h5 class="main__item-title">${title}</h5>
                    <p class="main__item-genres">${genres}</p>
                    <p class="main__item-year">${film.year}</p>
                    <i class="icon-heart-empty main__item-favorite ${favorite ? "main__item-favorite_active" : "main__item-favorite"}"></i>
            `
            list.appendChild(item)
        })
        list.addEventListener('click', (e) => {
            if (e.target.classList.contains('icon-heart-empty')) {
                let item = e.target.closest('.main__item');
                let filmIndex = Array.from(list.children).indexOf(item);
                let selectedFilm = films[filmIndex]
                console.log(1)
                addFavorite(selectedFilm, item);
            }
        });
    }

    const updateLocalStorage = () => {
        return JSON.parse(localStorage.getItem('favorites')) || []
    }
    const displayFavorites = () => {
        const list = document.querySelector('.main__list')
        list.innerHTML = ''

        let favoritesFilms = JSON.parse(localStorage.getItem('favorites')) || []
        console.log(favoritesFilms)

        if (!favoritesFilms.length) {
            let emptyTitle = document.createElement('h2')
            emptyTitle.classList.add('main__item-empty');
            emptyTitle.textContent = "Ваш список избранных пуст!";
            list.appendChild(emptyTitle);
        } else {
            favoritesFilms.forEach(film => {
                const item = createFilmItem(film);
                list.appendChild(item)
            });
        }
    };
    const createFilmItem = (film) => {
        const item = document.createElement('div');
        item.classList.add('main__item');

        let rating = !film.rating ? 9 : film.rating;
        let genres = film.genres.map((item, idx) => ` ${item.genre}`).filter((_, idx) => idx < 3);
        let url = film.posterUrlPreview || film.posterUrl;
        let title = film.nameRu || film.nameEn;

        item.innerHTML = `
        <span class="main__item-rating">${rating.toFixed(1)}</span>
        <img class="main__item-img" src=${url} alt="">
        <h5 class="main__item-title">${title}</h5>
        <p class="main__item-genres">${genres}</p>
        <p class="main__item-year">${film.year}</p>
        <i class="icon-heart-empty main__item-favorite main__item-favorite_active"></i>
    `;

        let favoriteBtn = item.querySelector('.icon-heart-empty')
        if (favoriteBtn !== null && item) {
            favoriteBtn.addEventListener('click', () => {
                addOrRemoveFavorite(film, item)
            });
        }

        return item;
    };
    const addOrRemoveFavorite = (film, item) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let favoriteBtn = item.querySelector('.icon-heart-empty');

        if (film){
            let hasMatch = favorites.some(favorite => favorite.kinopoiskId === film.kinopoiskId);

            if (hasMatch) {
                favorites = favorites.filter(favorite => favorite.kinopoiskId !== film.kinopoiskId);
                favoriteBtn.classList.remove('main__item-favorite_active');
            } else {
                favorites.push(film);
                favoriteBtn.classList.add('main__item-favorite_active');
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            if (item && typeof displayFavorites === 'function') {
                displayFavorites();
            }
        }
    };

    const isFavorite = (id) => {
        if (favorites !== null){
            let hasMatch = favorites.some(item => {
                return item.kinopoiskId === id
            })
            return hasMatch
        }
    }
}

const addFavorite = (film, item) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    let favoriteBtn = item.querySelector('.icon-heart-empty')
    console.log(2)
    if (favorites && favoriteBtn) {
        let hasMatch = favorites.some(favorite => favorite.kinopoiskId === film.kinopoiskId)

        if (hasMatch) {
            favorites = favorites.filter(favorite => favorite.kinopoiskId !== film.kinopoiskId)
            favoriteBtn.classList.remove('main__item-favorite_active')
        } else {
            favorites.push(film);
            favoriteBtn.classList.add('main__item-favorite_active')
        }

        localStorage.setItem('favorites', JSON.stringify(favorites))
    } else {
        let newFavorites = [film];
        favoriteBtn.classList.add('main__item-favorite_active')
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
}


filmsPages()


