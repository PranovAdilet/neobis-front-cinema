
const activeNavLink = () => {
    const items = document.querySelectorAll('.header__item')

    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(otherItem => otherItem.classList.remove('header__item_active'))
            item.classList.add('header__item_active')
        })
    })
}
const filmsPages = () => {
    let pageCount = 1

    activeNavLink()

    let months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

    let currentYear = new Date().getFullYear()
    let currentMonth = months[new Date().getMonth()]

    let favorites = JSON.parse(localStorage.getItem('favorites')) || []

    const releases = document.querySelector('.releases')
    const premieres = document.querySelector('.premieres')
    const expected = document.querySelector('.expected')
    const popular = document.querySelector('.popular')
    const favorite = document.querySelector('.favorite')
    const input = document.querySelector('.header__input')
    const form = document.querySelector('.header__form')
    const logo = document.querySelector('.header__title')

    logo.addEventListener('click', () => {
        getPremieresMonth(months, currentYear, currentMonth)
        const items = document.querySelectorAll('.header__item')
        items.forEach(item => item.classList.remove('header__item_active'))
    })
    form.addEventListener('submit', (e) => searchFilms(e, input))
    premieres.addEventListener('click', () => getPremieresMonth(months, currentYear, currentMonth))
    expected.addEventListener('click', () => getExpectedFilms(getExpectedFilms))
    popular.addEventListener('click', () => getTopPopular(getTopPopular))
    releases.addEventListener('click', () => getReleasesMonth(months, currentYear, currentMonth))
    favorite.addEventListener('click', () => displayFavorites())


    const searchFilms = (e, input) => {
        e.preventDefault()

        const URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films?keyword=${input.value}`

        const list = document.querySelector('.main__list')
        const items = document.querySelectorAll('.header__item')
        items.forEach(item => {
            items.forEach(otherItem => {
                otherItem.classList.remove('header__item_active')
            })
        })

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

                let films = json.items

                showFilms(films)
                input.value = ''
            })
            .catch(err => console.log(err))
    }
    const getReleasesMonth = () => {

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
                showFilms(films)

            })
            .catch(err => console.log(err))
    }

    const getPremieresMonth = () => {
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
            let favoriteBtn = item.querySelector('.icon-heart-empty')
            if (favoriteBtn !== null && item) {
                favoriteBtn.addEventListener('click', () => {
                    addFavorite(film, item)
                });
            }
            list.appendChild(item)
        })

    }

    const updateLocalStorage = () => {
        return JSON.parse(localStorage.getItem('favorites')) || []
    }
    const displayFavorites = () => {
        const list = document.querySelector('.main__list')
        list.innerHTML = ''

        let favoritesFilms = JSON.parse(localStorage.getItem('favorites')) || []

        if (!favoritesFilms.length) {

            const emptyTitle = document.createElement('h2')
            emptyTitle.classList.add('main__item-empty')

            emptyTitle.textContent = "Ваш список избранных пуст!"
            list.appendChild(emptyTitle)
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
        `

        let favoriteBtn = item.querySelector('.icon-heart-empty')
        if (favoriteBtn !== null && item) {
            favoriteBtn.addEventListener('click', () => {
                removeFromFavoritesPage(film, item)
            })
        }

        return item;
    };
    const removeFromFavoritesPage = (film, item) => {

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let favoriteBtn = item.querySelector('.icon-heart-empty');

        if (film){
            favorites = favorites.filter(favorite => favorite.kinopoiskId !== film.kinopoiskId);
            favoriteBtn.classList.remove('main__item-favorite_active');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));

        displayFavorites()
    }

    const isFavorite = (id) => {

        let isFavoriteFilm = updateLocalStorage()

        if (favorites !== null){
            let hasMatch = isFavoriteFilm.some(item => {
                return item.kinopoiskId === id
            })
            return hasMatch
        }
    }

    if (months){
        getPremieresMonth(months)
    }
}

const addFavorite = (film, item) => {

    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    const favoriteBtn = item.querySelector('.icon-heart-empty')

    if (favorites) {
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


