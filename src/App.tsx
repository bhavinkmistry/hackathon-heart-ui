import React from 'react'
import { Route, Switch, useLocation } from 'wouter'
import SearchPage from './pages/SearchPage'
import SupportPage from './pages/SupportPage'
import SupportChatPage from './pages/SupportChatPage'

export default function App(){
  const [loc] = useLocation()
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={SearchPage} />
  <Route path="/support/:id" component={SupportPage} />
  <Route path="/support/:id/chat" component={SupportChatPage} />
      </Switch>
    </div>
  )
}
