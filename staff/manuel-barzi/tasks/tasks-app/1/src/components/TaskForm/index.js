import React, { useState } from 'react'

export default function ({ onSubmit }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    return <section className="view">
        <h2>New task</h2>
        <form onSubmit={event => {
            event.preventDefault()

            onSubmit(title, description)

            setTitle('')
            setDescription('')
        }}>
            <input type="text" name="title" value={title} onChange={event => setTitle(event.target.value)} />
            <input type="text" name="description" value={description} onChange={event => setDescription(event.target.value)}/>
            <button>Add</button>
        </form>
    </section>
}