import React, {useState} from 'react'
import { retrieveQuiz } from '../../logic'
import './index.sass'

export default function ({ quizId, players }) {

    debugger
    players && players.sort(function (a, b) { return b.score - a.score })
    

    return <section className="results">
        <div className="results__header">
            <p className="results__title">Quizzard!</p>
        </div>
         <div className="results__answer">
        <p className="results__answer--text">Results</p>
    </div> 

        <div className="results__podium">
            <div className="results__container">
                <p className="results__player results__player--2">{players[1] && players[1].nickname}<br></br>{players[1] && players[1].score}</p>
                <div className="results__podium--2">
                    <p className="results__podium--text">2</p>
                </div>
            </div>
            <div className="results__container">
                <p className="results__player results__player--1">{players[0] && players[0].nickname}<br></br>{players[0] && players[0].score}</p>
                <div className="results__podium--1">
                    <p className="results__podium--text">1</p>
                </div>
            </div>
            <div className="results__container">
                <p className="results__player results__player--3">{players[2] && players[2].nickname}<br></br>{players[2] && players[2].score}</p>
                <div className="results__podium--3">
                    <p className="results__podium--text">3</p>
                </div>
            </div>
        </div>
        <div className="results__footer">
            <p className="results__footer--text">Create your own Quizzard! at quizzard.com</p>
        </div>
    </section>

}