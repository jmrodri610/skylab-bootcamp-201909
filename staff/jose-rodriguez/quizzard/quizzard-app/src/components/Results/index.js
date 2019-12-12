import React from 'react'
import './index.sass'

export default function ({results}) {

    const {validAnswers, players_} = results

    players_ && players_.sort(function(a,b) {return b.score-a.score})

    return  <section className="results">
    <div className="results__header">
        <p className="results__title">Quizzard!</p>
    </div>
    <div className="results__answer">
        <p className="results__answer--text">The Answer is: {validAnswers.join(",")}</p>
    </div>

    <div className="results__podium">
        <div className="results__container">
            <p className="results__player results__player--2">{players_[1] && players_[1].nickname}<br></br>{ players_[1] &&players_[1].score}</p>
            <div className="results__podium--2">
                <p className="results__podium--text">2</p>
            </div>
        </div>
        <div className="results__container">
            <p className="results__player results__player--1">{players_[0] && players_[0].nickname}<br></br>{players_[0] && players_[0].score}</p>
            <div className="results__podium--1">
                <p className="results__podium--text">1</p>
            </div>
        </div>
        <div className="results__container">
            <p className="results__player results__player--3">{players_[2] && players_[2].nickname}<br></br>{ players_[2] && players_[2].score}</p>
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