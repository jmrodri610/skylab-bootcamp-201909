import React from 'react'
import './index.sass'

export default function Modal({ type, getInput, modalClose }) {
    
    return <div className="modal">
        <div className="modal__container">
            <form onSubmit={event => {
                event.preventDefault()
                

                switch (type) {

                    case 'title': {
                        const input = event.target.title.value
                        getInput(type, input)
                        modalClose()
                    }
                        break

                    case 'description': {
                        const input = event.target.description.value
                        getInput(type, input)
                        modalClose()
                    }
                        break
                    case 'tit': {
                        const input = event.target.tit.value
                        getInput(type, input)
                        modalClose()
                    }
                        break
                }

            }}>
                <input className="modal__title" type="text" placeholder="Enter Quiz title" name={type} autoFocus required></input>
                <input type="submit" className="modal__submit" value="Submit"></input>
                <div className="modal__close" onClick={event => {
                    event.preventDefault()

                    modalClose()
                }}>✖︎</div>
            </form>
        </div>
    </div>

}