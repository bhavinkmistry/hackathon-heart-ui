import React from 'react'
import SearchBox from '../components/SearchBox'
import ThemeToggle from '../components/ThemeToggle'
import { useLocation } from 'wouter'
import { MOCK_PASSENGERS } from '../data/mock'
import HeartLogo from '../images/Heart_UI_Logo.png'

export default function SearchPage(){
  const [,navigate] = useLocation()

  function handleSearch(q:string, filter:string){
    // naive search in mock data
    const found = MOCK_PASSENGERS.find(p=> p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q))
  if(found) navigate(`/support/${found.id}`)
  else alert('No passenger found in mock data. Try "Bhavin"')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center pt-10">
      <header className="w-full max-w-3xl flex items-center justify-between px-4 mb-8">
        <div className="flex items-center gap-3">
          <img src={HeartLogo} alt="HEART logo" className="rounded-md max-w-full h-auto" />
          <div className="text-lg font-semibold"></div>
        </div>
        <ThemeToggle />
      </header>

      <main className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Help Engine for Automated Rebooking & Travel</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-8">Search for a passenger to begin magic!</p>

        <div className="bg-white dark:bg-gray-800 border-2 border-red-500 rounded-2xl p-8 shadow-xl">
          <SearchBox onSearch={handleSearch} />
        </div>
      </main>
    </div>
  )
}
