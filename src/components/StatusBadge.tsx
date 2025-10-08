import React from 'react'
import { FlightStatus } from '../data/mock'

const colors: Record<FlightStatus, string> = {
  confirmed: 'bg-primary-strong/10 text-primary-strong',
  delayed: 'bg-accent-red/10 text-accent-red',
  cancelled: 'bg-accent-red/20 text-accent-red'
}

export default function StatusBadge({status}:{status:FlightStatus}){
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  )
}
