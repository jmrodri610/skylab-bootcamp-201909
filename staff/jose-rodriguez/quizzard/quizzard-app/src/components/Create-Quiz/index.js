import React, { useState, useEffect } from 'react'
import './index.sass'
import FeedbackCreate from '../Feedback-Create'
import Modal from '../Modal'

export default function ({ onCreate }) {

    //let questions = []
    const [questions, setQuestions] = useState([])

    const [add, setAdd] = useState(undefined)

    const [modal, setModal] = useState(false)

    let [title, setTitle] = useState('Title')

    let [description, setDescription] = useState("Description")

    let [tit, setTit] = useState("Type Question")

    function handleOnClose() {
        setAdd(undefined)

    }
    function modalClose() {

        setModal(undefined)
    }

    function handleSetState(type, input) {

        switch (type) {

            case 'title': {
                title = input
                setTitle(title)
            }
                break

            case 'description': {
                description = input
                setDescription(description)
            }
                break
            case 'tit': {
                tit = input
                setTit(tit)
            }
                break
        }
    }


    return <section className="create">

        <form className="create__form" onSubmit={event => {

            event.preventDefault();

            onCreate(title, description, questions)
        }}>
            <div className="create__header">
                <a className="create__logo" href="#">Quizzard!</a>
                <input type="submit" className="create__done" value="Done"></input>
            </div>
        </form>

        <div className="quiz">
            <div className="quiz__options">
                <div className="quiz__title" onClick={event => {
                    event.preventDefault();
                    setModal('title')
                }}>{title}</div>
                {modal === 'title' && <Modal type='title' getInput={handleSetState} modalClose={modalClose} />}
                <div className="quiz__title" onClick={event => {
                    event.preventDefault();
                    setModal('description')
                }}>{description}</div>
                {modal === 'description' && <Modal type='description' getInput={handleSetState} modalClose={modalClose} />}
                <div className="quiz__title" onClick={event => {
                    event.preventDefault();
                    setModal('tit')
                }}>{tit}</div>
                {modal === 'tit' && <Modal type='tit' getInput={handleSetState} modalClose={modalClose} />}
            </div>
        </div>


        <form className="create__question" onSubmit={event => {

            event.preventDefault();

            const {
                answer1: { value: answer1 }, answer2: { value: answer2 }, answer3: { value: answer3 }, answer4: { value: answer4 },
                score: { value: score },
                timing: { value: timing }
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
                }], score, timing
            }

            if (event.target.check1.checked) q.answers[0].valid = true
            if (event.target.check2.checked) q.answers[1].valid = true
            if (event.target.check3.checked) q.answers[2].valid = true
            if (event.target.check4.checked) q.answers[3].valid = true
            questions.push(q)
            setQuestions(questions)
            setTit('Type Question')
            event.target.reset()
            setAdd({ title: "Ok!", message: "Question added" })



        }}>
            <div className="question__options">
                <input type="number" className="question__score" placeholder="Score" name="score" required></input>
                <select name="timing" id="" className="question__timer" required>
                    <option value="0">Select a timer</option>
                    <option value="20">5</option>
                    <option value="30">10</option>
                    <option value="45">15</option>
                    <option value="60">20</option>
                </select>
            </div>
            <div className="question__answers">
                <div className="ans_content">
                    <div className="question__answers--1"></div>
                </div>
                {/* <input type="checkbox" name="check1" id="checkbox 1"></input>
                <label for="checkbox 1"><span>√</span></label> */}

                <div className="ans_content">
                    <div className="question__answers--2"></div>
                </div>
                {/* <input type="checkbox" name="check2" id="checkbox 2"></input>
                <label for="checkbox 2"><span>√</span></label> */}

                <div className="ans_content">
                    <div className="question__answers--3"></div>
                </div>
                {/* <input type="checkbox" name="check3" id="checkbox 3"></input>
                <label for="checkbox 3"><span>√</span></label> */}

                <div className="ans_content">
                    <div className="question__answers--4"></div>
                </div>
                {/* <input type="checkbox" name="check4" id="checkbox 4"></input>
                <label for="checkbox 4"><span>√</span></label> */}

            </div>
            <input type="submit" className="question__add" value="Add Question"></input>
        </form>

        {add && <FeedbackCreate title={add.title} message={add.message} onClose={handleOnClose} />}

    </section>
}