import React from 'react'
import './index.sass'

export default function ({quiz: {title, questions}, user}) {
    return <>
    <h3 className="item__title">{title}</h3>
    <p className="item__questions">{questions.length} questions</p>
    <div className="item__info">
        <p className="item__owner">{user}</p>
        <p className="item__plays">6 plays</p>
    </div>
    </>

}