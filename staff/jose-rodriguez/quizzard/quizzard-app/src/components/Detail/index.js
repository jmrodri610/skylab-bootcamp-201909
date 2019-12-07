import React from 'react'
import './index.sass'

export default function ({ onStart }) {

    return     <section className="detail">
        <h1 className="quizTitle" >QUIZ DETAIL UNDER CONSTRUCTION</h1>
        <form onSubmit={ event => {
            event.preventDefault();
            onStart()
        }}>
            <input className="startbutton" type="submit" value="Start Game"></input>
        </form>

</section>

}