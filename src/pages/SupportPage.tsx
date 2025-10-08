import React from 'react'
import { useRoute, Link } from 'wouter'
import { MOCK_PASSENGERS } from '../data/mock'
import ThemeToggle from '../components/ThemeToggle'
import PassengerInfo from '../components/PassengerInfo'
import ChatInterface from '../components/ChatInterface'

export default function SupportPage(){
  const [match, params] = useRoute('/support/:id')
  const id = params?.id
  const passenger = MOCK_PASSENGERS.find(p=> p.id === id) || MOCK_PASSENGERS[0]

  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="px-2 py-1 border rounded">Back</Link>
          <div className="logo-square">H</div>
          <div className="text-lg font-semibold">{passenger.name}</div>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex gap-6">
        <aside style={{width:380}}>
          <PassengerInfo p={passenger} />
        </aside>

        <section className="flex-1" style={{minWidth:'60%'}}>
          <div className="bg-white rounded-md shadow h-[80vh] flex flex-col">
            <div className="p-3 border-b">Chat with passenger</div>
            <div className="flex-1">
              <ChatInterface />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
