import React from 'react'
import './index.sass'

export default function ({ quiz: { id, title, questions }, user, onDetail }) {
    return <>
        <a onClick={event =>{
            event.preventDefault(); onDetail(id)
        }}>
            <h3 className="item__title">{title}</h3>
        </a>
        <p className="item__questions">{questions.length} questions</p>
        <div className="item__info">
            <p className="item__owner">{user}</p>
            <p className="item__plays">6 plays</p>
        </div>
    </>

}