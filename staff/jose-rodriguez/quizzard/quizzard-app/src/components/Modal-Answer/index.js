import React from 'react'
import './index.sass'

export default function ModalAnswer({ answerContainer, titleClass, type, getInput, modalClose }) {

    return <div className="modal-answer">
        <form className={answerContainer} onSubmit={event => {
            event.preventDefault()


            switch (type) {

                case 'ans1': {
                    const input = {
                        text: event.target.ans1.value,
                        valid: false
                    }
                    if (event.target.check.checked) input.valid = true
                    getInput(type, input)
                    modalClose()
                }
                    break

                case 'ans2': {
                    const input = {
                        text: event.target.ans2.value,
                        valid: false
                    }
                    if (event.target.check.checked) input.valid = true
                    getInput(type, input)
                    modalClose()
                }
                    break
                case 'ans3': {
                    const input = {
                        text: event.target.ans3.value,
                        valid: false
                    }
                    if (event.target.check.checked) input.valid = true
                    getInput(type, input)
                    modalClose()
                }
                    break
                case 'ans4': {
                    const input = {
                        text: event.target.ans4.value,
                        valid: false
                    }
                    if (event.target.check.checked) input.valid = true
                    getInput(type, input)
                    modalClose()
                }
                    break
            }

        }}>
            <div className='modal-answer__container'>
                <input className={titleClass} type="text" placeholder="Type answer here..." name={type} autoFocus required></input>
                <input type="checkbox" name="check" id="checkbox 1"></input>
                <label for="checkbox 1"><span>√</span></label>
                <input type="submit" className="modal-answer__submit" value="Submit"></input>
                <div className="modal-answer__close" onClick={event => {
                    event.preventDefault()

                    modalClose()
                }}>✖︎</div>
            </div>
        </form>
    </div>

}