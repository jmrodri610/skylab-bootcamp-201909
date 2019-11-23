import React from 'react'
import './index.sass'

export default function ({ task: { id, title, description, status }, onChangeStatus }) {
    return <a href="#" className={`task task--${status.toLowerCase()}`}>
        <h2 className="task__title">{title}</h2>
        <p className="task__description">{description}</p>
        <span className="task__status">{status}</span>
        <span className="task__action">
            <form method="post" onSubmit={event => { event.preventDefault(); onChangeStatus(id, 'TODO') }}>
                <button type="submit" title="TODO">⏸</button>
            </form>
        </span>
        <span className="task__action">
            <form method="post" onSubmit={event => { event.preventDefault(); onChangeStatus(id, 'DOING') }}>
                <button type="submit" title="DOING">▶️</button>
            </form>
        </span>
        <span className="task__action">
            <form method="post" onSubmit={event => { event.preventDefault(); onChangeStatus(id, 'REVIEW') }}>
                <button type="submit" title="REVIEW">⏺</button>
            </form>
        </span>
        <span className="task__action">
            <form method="post" onSubmit={event => { event.preventDefault(); onChangeStatus(id, 'DONE') }}>
                <button type="submit" title="DONE">⏹</button>
            </form>
        </span>
    </a>
}