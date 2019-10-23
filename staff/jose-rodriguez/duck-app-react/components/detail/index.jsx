function Detail ({onDetail: duck},onBack,onStore) {
    return <section className="detail">
        <h2 className="detail__title">duck.title</h2>
        <img src="duck.imageURL" alt="" className="detail__image"/>
        <p className="detail__description">duck.description</p>
        <a href="" className="detail__store" onClick={event => {
                event.preventDefault()
                onStore()
            }}>Go to Store</a>
        <span className="detail__price">duck.price</span>
        <a href="" className="detail__back" onClick={event => {
                event.preventDefault()
                onBack()
            }}>Go back</a>
    </section>
}