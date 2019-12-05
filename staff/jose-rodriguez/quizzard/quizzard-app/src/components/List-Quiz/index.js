import React from 'react'
import './index.sass'
import Quiz from '../Quiz'

export default function ({quizs, user}) {
    
    return  <ul className="quizs">
        {quizs && quizs.map(quiz => <li className="item" key={quiz.id}><Quiz quiz={quiz} user={user} /></li>)}
    </ul>
}