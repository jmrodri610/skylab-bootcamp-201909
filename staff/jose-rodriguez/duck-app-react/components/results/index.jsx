function Results({onResult: duck}, onDetail){
    return <ul className="results">
        {items.map()}
    <li key={duck.id} className="results__item">
        <a href="" className="item" onClick={event => {
                event.preventDefault()
                onDetail(duck.id)
            }}>
        <h2 className="item__title">{duck.title} </h2>
        <img src={duck.imageUrl} className="item__image"/>
        <p className="item__price">{duck.price} </p>
        </a>
    </li>
        
    </ul>
}