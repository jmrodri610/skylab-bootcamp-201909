import React, { useState, useEffect } from 'react'
import './index.sass'
import FeedbackCreate from '../Feedback-Create'
import Modal from '../Modal'
import ModalAnswer from '../Modal-Answer'

export default function ({ onCreate }) {

    const [questions, setQuestions] = useState([])
    const [add, setAdd] = useState(undefined)
    const [modal, setModal] = useState(false)
    let [title, setTitle] = useState('Title')
    let [description, setDescription] = useState("Description")
    let [tit, setTit] = useState("Type Question")
    let [ans1, setAns1] = useState(undefined)
    let [ans2, setAns2] = useState(undefined)
    let [ans3, setAns3] = useState(undefined)
    let [ans4, setAns4] = useState(undefined)

    function handleOnClose() { setAdd(undefined) }
    function modalClose() { setModal(undefined) }

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
            case 'ans1': {
                ans1 = input
                setAns1(ans1)
            }
                break
            case 'ans2': {
                ans2 = input
                setAns2(ans2)
            }
                break
            case 'ans3': {
                ans3 = input
                setAns3(ans3)
            }
                break
            case 'ans4': {
                ans4 = input
                setAns4(ans4)
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
                <div className="quiz__question" onClick={event => {
                    event.preventDefault();
                    setModal('tit')
                }}><p>{tit}</p></div>
                {modal === 'tit' && <Modal type='tit' getInput={handleSetState} modalClose={modalClose} />}
            </div>
        </div>

        <form className="create__question" onSubmit={event => {

            event.preventDefault();

            const {
                score: { value: score },
                timing: { value: timing }
            } = event.target

            const q = {
                text: tit,
                answers: [ans1, ans2, ans3, ans4],
                score,
                timing
            }

            questions.push(q)
            setQuestions(questions)
            setTit('Type Question')
            setAns1(undefined)
            setAns2(undefined)
            setAns3(undefined)
            setAns4(undefined)
            event.target.reset()
            setAdd({ title: "Ok!", message: "Question added" })

        }}>
            <div className="question__options">
                <select className="question__selector" placeholder="Score" name="score" required>
                    <option value="0">Select a score</option>
                    <option value="20">500</option>
                    <option value="30">1000</option>
                    <option value="45">2000</option>
                </select>
                <select name="timing" id="" className="question__selector" required>
                    <option value="0">Select a timer</option>
                    <option value="20">5</option>
                    <option value="30">10</option>
                    <option value="45">15</option>
                    <option value="60">20</option>
                </select>
            </div>
            <input type="submit" className="question__add" value="Add Question"></input>
        </form>

        <div className="question__answers">
            <div className="ans_content">
                <div className="question__answers--1" onClick={event => {
                    event.preventDefault();
                    setModal('ans1')
                }}><p>{ans1 ? ans1.text : 'Click to type answer 1'}</p></div>
                {modal === 'ans1' && <ModalAnswer answerContainer={'modal-answer__form modal-answer__form--1'} titleClass={'modal-answer__title modal-answer__title--1'} type='ans1' getInput={handleSetState} modalClose={modalClose} />}
            </div>
            <div className="ans_content">
                <div className="question__answers--2" onClick={event => {
                    event.preventDefault();
                    setModal('ans2')
                }}><p>{ans2 ? ans2.text : 'Click to type answer 2'}</p></div>
                {modal === 'ans2' && <ModalAnswer answerContainer={'modal-answer__form modal-answer__form--2'} titleClass={'modal-answer__title modal-answer__title--2'} type='ans2' getInput={handleSetState} modalClose={modalClose} />}
            </div>
            <div className="ans_content">
                <div className="question__answers--3" onClick={event => {
                    event.preventDefault();
                    setModal('ans3')
                }}><p>{ans3 ? ans3.text : 'Click to type answer 3'}</p></div>
                {modal === 'ans3' && <ModalAnswer answerContainer={'modal-answer__form modal-answer__form--3'} titleClass={'modal-answer__title modal-answer__title--3'} type='ans3' getInput={handleSetState} modalClose={modalClose} />}
            </div>
            <div className="ans_content">
                <div className="question__answers--4" onClick={event => {
                    event.preventDefault();
                    setModal('ans4')
                }}><p>{ans4 ? ans4.text : 'Click to type answer 4'}</p></div>
                {modal === 'ans4' && <ModalAnswer answerContainer={'modal-answer__form modal-answer__form--4'} titleClass={'modal-answer__title modal-answer__title--4'} type='ans4' getInput={handleSetState} modalClose={modalClose} />}
            </div>
        </div>

        {add && <FeedbackCreate title={add.title} message={add.message} onClose={handleOnClose} />}

    </section>
}