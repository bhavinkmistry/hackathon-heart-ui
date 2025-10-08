import React from 'react'

export default function ThemeToggle(){
  const [dark, setDark] = React.useState(false)
  React.useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
  },[dark])
  return (
    <button aria-pressed={dark} onClick={()=>setDark(d=>!d)} className={`px-3 py-1 rounded-md border ${dark? 'bg-gray-800 text-white' : ''}`}>
      {dark ? 'Dark' : 'Light'}
    </button>
  )
}
