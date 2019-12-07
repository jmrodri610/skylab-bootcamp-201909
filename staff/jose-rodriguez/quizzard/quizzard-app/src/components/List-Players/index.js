import React from 'react'
import './index.sass'


export default function ({players}) {
    
    return  <ul className="lobby__list">
        {players && players.map(player => <li className="players" key={player.id}><p className="players__name">{player.nickname}</p></li>)}
    </ul>
}