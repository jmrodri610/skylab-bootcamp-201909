import React, {useState} from 'react'
import './index.sass'
import FeedbackCreate from '../Feedback-Create'

export default function ({onCreate }) {

    //let questions = []
    const [questions, setQuestions] = useState([])

    const [add, setAdd] = useState(undefined)

    function handleOnClose () {
        setAdd(undefined)


    }


    return <section className="create">
        
        <form className="create__form" onSubmit={event => {
            
            event.preventDefault();
            const {title: {value: title}, description: {value: description}} = event.target
            debugger
            onCreate(title, description, questions)
        }}>
            <div className="create__header">
                <a className="create__logo" href="#">Quizzard!</a>
                <input type="submit" className="create__done" value="Done"></input>
            </div>
            <div className="quiz">
                <div className="quiz__options">
                    <input className="quiz__title" type="text" placeholder="Enter Quiz title" name="title" required></input>
                    <input className="quiz__description" type="text" placeholder="Enter Quiz description"
                        name="description" required></input>
                </div>
            </div>
        </form>

        <form className="create__question" onSubmit={event => {
            
            event.preventDefault();

            const {
                tit: {value: tit}, 
                answer1: {value: answer1}, answer2: {value: answer2}, answer3: {value: answer3}, answer4: {value: answer4},
                score: {value: score}, 
                timing: {value: timing}
            } = event.target

            const q = {
                text: tit, 
                answers: [{
                text: answer1,
                valid: false
            },
            {
                text: answer2,
                valid: false
            },
            {
                text: answer3,
                valid: false
            },
            {
                text: answer4,
                valid: false
            }], score, timing }

            if(event.target.check1.checked) q.answers[0].valid = true
            if(event.target.check2.checked) q.answers[1].valid = true
            if(event.target.check3.checked) q.answers[2].valid = true
            if(event.target.check4.checked) q.answers[3].valid = true
            questions.push(q)
            setQuestions(questions)
            event.target.reset()
            setAdd( {title: "Ok!", message: "Question added"} )
    


        }}>
            <div className="question">
                <input className="question__title" type="text" name="tit" placeholder="Type here the question" required></input>
            </div>
            <div className="question__options">
                <input type="number" className="question__score" placeholder="Score" name="score" required></input>
                <select name="timing" id="" className="question__timer" required>
                    <option value="0">Select a timer</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                </select>
            </div>
            <div className="question__answers">
                <div className="question__answers--container">
                    <input className="question__answers--1" type="text" placeholder="answer 1" name="answer1" required></input>
                    <input type="checkbox" name="check1" id="checkbox 1"></input>
                    <label for="checkbox 1"><span>√</span></label>
                </div>
                <div className="question__answers--container">
                    <input className="question__answers--2" type="text" placeholder="answer 2" name="answer2" required></input>
                    <input type="checkbox" name="check2" id="checkbox 2"></input>
                    <label for="checkbox 2"><span>√</span></label>
                </div>
                <div className="question__answers--container">
                    <input className="question__answers--3" type="text" placeholder="answer 3" name="answer3" required></input>
                    <input type="checkbox" name="check3" id="checkbox 3"></input>
                    <label for="checkbox 3"><span>√</span></label>
                </div>
                <div className="question__answers--container">
                    <input className="question__answers--4" type="text" placeholder="answer 4" name="answer4" required></input>
                    <input type="checkbox" name="check4" id="checkbox 4"></input>
                    <label for="checkbox 4"><span>√</span></label>
                </div>
            </div>
            <input type="submit" className="question__add" value="Add Question"></input>
        </form>

        {  add && <FeedbackCreate title = {add.title} message={add.message} onClose={handleOnClose} /> }
    </section>
}