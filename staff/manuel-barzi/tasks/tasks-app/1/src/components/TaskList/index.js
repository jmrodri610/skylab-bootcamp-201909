import React from 'react'
import './index.sass'
import Task from '../Task'

export default function ({ tasks, onChangeTaskStatus }) {
    return <ul className="task-list">
        {tasks.map(task => <li className="task-list__item" key={task.id}><Task task={task} onChangeStatus={onChangeTaskStatus} /></li>)}
    </ul>
}