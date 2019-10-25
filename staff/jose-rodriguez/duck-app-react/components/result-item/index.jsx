function ResultItem({ item: { isFav, id, title, image, price }, onClick, onFav }) {
    debugger
    return <li key={id} className="results__item">
        <a href="" className="item" onClick={event => {
            event.preventDefault()
            
            onClick(id)
        }}>
            <h2 className="item__title">{title} </h2>
            <img src={image} className="item__image" />
            <p className="item__price">{price} </p>
            
            {isFav === true ?  <i className="far fa-heart" onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                
                onFav(id)
            }}></i> :   <i className="fas fa-grin-hearts" onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                
                onFav(id)
            }}></i>}

        </a>
    </li>
}
