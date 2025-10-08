import React from 'react'
import { Passenger } from '../data/mock'
import StatusBadge from './StatusBadge'

export default function PassengerInfo({p}:{p:Passenger}){
  const [open,setOpen] = React.useState<Record<string,boolean>>({})
  const [openSection,setOpenSection] = React.useState<Record<string,boolean>>({behaviors:false, suggestions:true})

  const mockBehaviors = [
    {id:'b1', ts:'2025-10-01 08:12', text: 'Called support about delayed bag, asked for ETA and compensation.'},
    {id:'b2', ts:'2025-09-25 14:03', text: 'Opened chat asking about seat upgrade; agent offered paid upgrade.'},
    {id:'b3', ts:'2025-09-10 09:45', text: 'Checked-in online and selected aisle seat.'}
  ]

  const mockSuggestions = [
    {id:'so1', flight:'FC321', date:'2025-10-11', from:'JFK', to:'LAX', depart:'10:30', arrive:'13:40', note:'Rebook option, seat available'},
    {id:'so2', flight:'FC654', date:'2025-10-12', from:'JFK', to:'LAX', depart:'15:00', arrive:'18:10', note:'Standby with voucher'},
    {id:'so3', flight:'FC987', date:'2025-10-13', from:'JFK', to:'LAX', depart:'07:20', arrive:'10:30', note:'Alternate carrier option'}
  ]
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md shadow border border-gray-400">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-sm text-muted">{p.email} · {p.phone}</div>
            <div className="mt-2 text-xs uppercase text-muted">Rapid Reward #</div>
            <div className="font-mono text-sm">{p.loyaltyId || p.bookingRef}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow border border-gray-400">
        <h4 className="font-semibold mb-2 text-red-500">Customer Flights</h4>
        <div className="space-y-2">
          {p.flights.map(f=> {
            // determine flight timing: past, within 24h, future
            const departIso = `${f.date}T${f.departTime}:00` // naive local
            const departTs = new Date(departIso).getTime()
            const now = Date.now()
            const ms24 = 24 * 60 * 60 * 1000
            const isPast = departTs < now
            const isSoon = (departTs >= now) && (departTs - now <= ms24)
            const rowClass = isPast ? 'bg-yellow-50 border-yellow-300' : isSoon ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'

            return (
              <div key={f.id} className={`border rounded-md overflow-hidden ${rowClass}`}>
                <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(s=>({...s,[f.id]:!s[f.id]}))}>
                  <div className="flex gap-3 items-center">
                    <div className="font-mono font-semibold">{f.number}</div>
                    <div className="text-sm text-muted">{f.date}</div>
                    <div className="text-sm">{f.from} → {f.to}</div>
                  </div>
                  <StatusBadge status={f.status} />
                </button>
                {open[f.id] && (
                  <div className="p-3 text-sm" style={{backgroundColor: 'transparent'}}>
                    <div><strong>Departure:</strong> {f.from} · {f.departTime}</div>
                    <div><strong>Arrival:</strong> {f.to} · {f.arriveTime}</div>
                    <div className="mt-2">Full details and seat/terminal info can go here.</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Customer Behaviors */}
      <div className="bg-white p-4 rounded-md shadow border border-gray-400">
        <button className="w-full text-left flex items-center justify-between" onClick={()=>setOpenSection(s=>({...s,behaviors:!s.behaviors}))}>
          <div className="font-semibold text-red-500">Customer Behaviors</div>
          <div className="text-sm text-muted">{openSection.behaviors ? 'Collapse' : 'Expand'}</div>
        </button>
        {openSection.behaviors && (
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {mockBehaviors.map(b=> (
              <div key={b.id} className="border rounded-md p-2 bg-gray-50">
                <div className="text-xs text-muted">{b.ts}</div>
                <div className="mt-1">{b.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Options */}
      <div className="bg-white p-4 rounded-md shadow border border-gray-400">
        <button className="w-full text-left flex items-center justify-between" onClick={()=>setOpenSection(s=>({...s,suggestions:!s.suggestions}))}>
          <div className="font-semibold text-red-500">Suggested Options</div>
          <div className="text-sm text-muted">{openSection.suggestions ? 'Collapse' : 'Expand'}</div>
        </button>
        {openSection.suggestions && (
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {mockSuggestions.map(s=> (
              <div key={s.id} className="border rounded-md p-2 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold">{s.flight} · {s.date}</div>
                  <div className="text-sm text-muted">{s.from} → {s.to} · {s.depart} - {s.arrive}</div>
                  <div className="mt-1">{s.note}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-3 py-1 rounded-md bg-primary-strong text-white">Select</button>
                  <button className="px-3 py-1 rounded-md border">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
