import React from 'react'
import './index.sass'
import ListQuiz from '../List-Quiz'

export default function ({ user, email, userId, quizs, onCreate }) {
    debugger
    let quizzards
    if (quizs) quizzards = quizs.map(quiz => {
        if (quiz.owner === userId) return quiz.owner
    })
    debugger
    return <section className="profile">
        <div className="profile__header">
            <div className="profile__logo">Quizzard!</div>
            <div className="profile__addquiz" onClick={event => {
                event.preventDefault(); onCreate()
            }}>+</div>
        </div>
        <div className="profile__userinfo">
            <div className="profile__usercontent">
                <p className="profile__username">{user}<br></br>{email}</p>
            </div>
            <div className="profile__quizinfo">
                <p className="profile__quizs">Quizzards created</p>
                <p className="profile__numquizs">{quizs && quizzards.length}</p>
            </div>
            <div className="profile__quizinfo">
                <p className="profile__quizs">Plays of your Quizzards</p>
                <p className="profile__numquizs">5</p>
            </div>
            <div className="profile__quizinfo">
                <p className="profile__quizs">Total Players</p>
                <p className="profile__numquizs">6</p>
            </div>
        </div>
        <div className="profile__list">
            <div className="profile__listinfo">
                <p className="profile__myquizs">My Quizzards</p>
                <p className="profile__newquiz" onClick={event => {
                    event.preventDefault(); onCreate()
                }}>Create new</p>
            </div>
            <ListQuiz quizs={quizs} user={user} />
        </div>

    </section>
}