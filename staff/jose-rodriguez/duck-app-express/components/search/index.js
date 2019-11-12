const Results = require('../results')
const ResultItem = require('../result-item')

module.exports = function ({ path, query, name, myFavs, logout, results, favPath, detailPath, favList }) {
    return `<section class="view search">
    <h1 class="search__title">Search</h1>
    <h2 class="search__user">${name}</h2>
    <form method='get' action=${myFavs}>
        <button class="search__logout">My Favs</button>
    </form>
    <form method='post' action=${logout}>
        <button class="search__logout">Logout</button>
    </form>
    <form class="search__form" method="get" action=${path}>
        <span class="search__icon">🐣</span>
        <input class="search__criteria" type="text" name="query" placeholder="criteria" ${query ? `value=${query}` : ''} />
        <button class="search__submit">🔍</button>
    </form>

    ${results ? Results({ items: results, onItemRender: duck => ResultItem({ item: duck, favPath, detailPath, favList }) }) : ''}

</section>`
}