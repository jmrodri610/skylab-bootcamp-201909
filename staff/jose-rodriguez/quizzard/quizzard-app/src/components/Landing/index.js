import React from 'react'
import './index.sass'

export default function ({ onHome, onPinCode }) {

    return     <section className="landing">
    <form className="landing__form" onSubmit={event => {
        event.preventDefault();
        const {pincode: {value: pincode}, nickname: {value: nickname}} = event.target

        onPinCode(pincode, nickname)
    }}>
        <h1 className="landing__title">Quizzard!</h1>
        <input type="text" className="landing__pincode" name="pincode" placeholder="Pin Code"></input>
        <input type="text" className="landing__pincode" name="nickname" placeholder="Nickname"></input>
        <input type="submit" className="landing__start" value="Enter"></input>
    </form>
    <div className="landing__redirect">
        <p className="landing__description">To create a new game, click the following link</p>
        <p className="landing__home" onClick={event => {
            event.preventDefault(); onHome()
        }}>Quizzard!</p>
    </div>
</section>

}
