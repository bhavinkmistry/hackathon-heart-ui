import React from 'react'
import VoiceInput from './VoiceInput'

export default function SearchBox({onSearch}:{onSearch:(q:string,filter:string)=>void}){
  const [filter, setFilter] = React.useState('Name')
  const [q, setQ] = React.useState('')

  const handleVoiceTranscription = (text: string) => {
    setQ(text)
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4 justify-center">
        {['Name','Email','Phone'].map(f=> (
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1 rounded-full border ${filter===f? 'pill-active' : 'bg-white'}`}>
            {f}
          </button>
        ))}
      </div>
      <div>
        <div className="bg-white rounded-md shadow-sm px-4 py-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/></svg>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search by ${filter.toLowerCase()}`} className="ml-3 w-full outline-none text-lg" />
            <VoiceInput onTranscription={handleVoiceTranscription} />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button onClick={()=>onSearch(q,filter)} className="px-8 py-2 bg-primary-strong hover:bg-primary rounded-md text-white text-lg">Search</button>
        </div>
      </div>
    </div>
  )
}
