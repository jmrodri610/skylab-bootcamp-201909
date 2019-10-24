function Detail ({ item: { link, title, image,description, price }, onBack }) {
    debugger
    return <section className="detail">
        <h2 className="detail__title">{title}</h2>
        <img src={image} alt="" className="detail__image"/>
        <p className="detail__description">{description}</p>
        <a href={{link}} className="detail__store">Go to Store</a>
        <span className="detail__price">{price}</span>
        <a href="" className="detail__back" onClick={event => {
                event.preventDefault()
                onBack()
            }}>Go back</a>
    </section>
}