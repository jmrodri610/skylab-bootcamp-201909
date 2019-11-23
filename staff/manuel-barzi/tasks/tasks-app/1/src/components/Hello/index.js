import React from 'react'

export default function({name}) {
    console.log(name)
    return <section className="view">
        <h1>Hello, {name}!</h1>
    </section>
}