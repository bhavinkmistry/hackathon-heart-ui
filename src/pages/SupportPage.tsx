import React from 'react'
import { useRoute, Link } from 'wouter'
import { MOCK_PASSENGERS } from '../data/mock'
import ThemeToggle from '../components/ThemeToggle'
import PassengerInfo from '../components/PassengerInfo'
import ChatInterface from '../components/ChatInterface'
import HeartLogo from '../images/Heart_UI_Logo.png'


export default function SupportPage(){
  const [match, params] = useRoute('/support/:id')
  const id = params?.id
  const passenger = MOCK_PASSENGERS.find(p=> p.id === id) || MOCK_PASSENGERS[0]

  const getPassengerStatus = () => {
    const today = new Date()
    const recentFlight = passenger.flights.find(f => new Date(f.date) < today)
    const upcomingFlight = passenger.flights.find(f => new Date(f.date) >= today)
    
    if (upcomingFlight) return "Customer going to travel soon"
    if (recentFlight) return "Customer recently travelled"
    return "Customer status unknown"
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img src={HeartLogo} alt="HEART logo" className="rounded-md max-w-full h-auto cursor-pointer" />
          </Link>
          <div className="text-lg font-semibold"></div>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex gap-6">
        <aside style={{width:380}} className="border border-blue-700 rounded-md">
          <PassengerInfo p={passenger} />
        </aside>

        <section className="flex-1" style={{minWidth:'60%'}}>
          <div className="bg-white dark:bg-gray-800 rounded-md shadow p-3 mb-4 border border-red-600">
            <div className="font-bold text-gray-900 dark:text-white text-left">{getPassengerStatus()}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-md shadow h-[70vh] flex flex-col border border-red-600">
            <div className="p-3 border-b text-gray-900 dark:text-white">Chat with passenger</div>
            <div className="flex-1">
              <ChatInterface />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
