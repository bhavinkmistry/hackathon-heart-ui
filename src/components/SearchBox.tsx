import React from 'react'

export default function SearchBox({onSearch}:{onSearch:(q:string,filter:string)=>void}){
  const [filter, setFilter] = React.useState('Name')
  const [q, setQ] = React.useState('')
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        {['Name','Email','Phone'].map(f=> (
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1 rounded-full border ${filter===f? 'pill-active' : 'bg-white'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex items-center flex-1 bg-white rounded-md shadow-sm px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search by ${filter.toLowerCase()}`} className="ml-3 w-full outline-none" />
        </div>
  <button onClick={()=>onSearch(q,filter)} className="px-6 bg-primary-strong hover:bg-primary rounded-md text-white">Search</button>
      </div>
    </div>
  )
}
