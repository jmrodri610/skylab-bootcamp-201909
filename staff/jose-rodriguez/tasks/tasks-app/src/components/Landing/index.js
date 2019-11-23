import React from 'react'
import './index.sass'

export default function ({ onRegister, onLogin }) {
    return <section className="landing">
        <h1 className="landing__title">Task-it! 📝</h1>
        <p className="landing__intro">
            Gestión de tareas de equipo.<br></br>
            Inicia sesión o registrate para continuar.
        </p>
        <div className="links">
            <a href="#" className="landing__link" onClick={event => { event.preventDefault(); onRegister() }}>Sign Up</a>
            <a href="" className="landing__link" onClick={event => { event.preventDefault(); onLogin() }}>Sign In</a>
        </div>
    </section>
}