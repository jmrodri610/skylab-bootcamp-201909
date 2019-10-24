function ResultItem({ item: { id, title, imageUrl, price }, onClick }) {
    return <li key={id} className="results__item">
        <a href="" className="item" onClick={event => {
            event.preventDefault()
            onClick(id)
        }}>
            <h2 className="item__title">{title} </h2>
            <img src={imageUrl} className="item__image" />
            <p className="item__price">{price} </p>
        </a>
    </li>
}