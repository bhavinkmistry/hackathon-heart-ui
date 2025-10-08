import React from 'react'

type Sender = 'agent' | 'passenger' | 'assistant'

type Message = {
  id: string
  from: Sender
  text: string
  ts: string
}

type Suggestion = { id: string; text: string }

export default function ChatInterface({onSend, registerAppend}:{onSend?:(m:Message)=>void, registerAppend?:(fn:(text:string)=>void)=>void}){
  const [messages,setMessages] = React.useState<Message[]>([
    {id:'m1',from:'passenger',text:'Hi, I need help with my booking. My flight was delayed.',ts:'09:12'},
    {id:'m2',from:'agent',text:'Sure — can I have your booking reference?',ts:'09:13'}
  ])

  const [input,setInput] = React.useState('')
  const [typing,setTyping] = React.useState<{who:Sender, val:boolean}>({who:'assistant', val:false})
  const [suggestions,setSuggestions] = React.useState<Suggestion[]>([])
  const [selectedSuggestion,setSelectedSuggestion] = React.useState<string|undefined>(undefined)

  // simple mock LLM that generates suggestions based on last passenger message
  function generateSuggestions(contextText:string){
    // naive heuristics to create suggestions
    const out:Suggestion[] = []
    const lower = contextText.toLowerCase()
    if(lower.includes('delay') || lower.includes('delayed')){
      out.push({id:'s1', text: 'Offer compensation options (voucher or refund)'});
      out.push({id:'s2', text: 'Check next available flights and rebooking options'})
      out.push({id:'s3', text: 'Apologize and explain cause if available'})
    } else if(lower.includes('cancel')){
      out.push({id:'s4', text: 'Offer rebooking or full refund'});
      out.push({id:'s5', text: 'Check seat availability on alternate flights'})
    } else if(lower.includes('baggage') || lower.includes('bag')){
      out.push({id:'s6', text: 'Initiate baggage trace and provide reference number'});
      out.push({id:'s7', text: 'Offer essentials kit and follow up timeline'})
    } else {
      out.push({id:'s8', text: 'Ask for booking reference and confirm passenger details'});
      out.push({id:'s9', text: 'Offer to hold while checking flight status'})
      out.push({id:'s10', text: 'Provide possible solutions: rebook, refund, standby'})
    }
    return out
  }

  function triggerAssistant(contextText:string){
    setTyping({who:'assistant', val:true})
    setSuggestions([])
    // call server-side chat to generate suggestions (if available), fallback to local mock
    ;(async ()=>{
      try{
        const apiBase = import.meta.env.VITE_API_BASE || ''
        const r = await fetch(`${apiBase}/api/chat`, {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ messages: [{ role: 'user', content: contextText }] })
        })
        if(r.ok){
          const json = await r.json()
          const assistantText = json.choices?.[0]?.message?.content || ''
          const assistMsg:Message = {id:Date.now().toString(), from:'assistant', text: assistantText, ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          setMessages(s=>[...s, assistMsg])
          // optional: parse assistantText into suggestions (naive split)
          const parts = assistantText.split('\n').slice(0,5).map((t: string, i: number) => ({id: 'srv'+i, text: (t||'').slice(0,240)}))
          setSuggestions(parts)
        } else {
          // fallback: local mock
          const sug = generateSuggestions(contextText)
          setSuggestions(sug)
          const assistMsg:Message = {id:Date.now().toString(), from:'assistant', text: `Suggested actions: ${sug.map(s=>s.text).slice(0,2).join(' · ')}`, ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          setMessages(s=>[...s, assistMsg])
        }
      }catch(e){
        const sug = generateSuggestions(contextText)
        setSuggestions(sug)
        const assistMsg:Message = {id:Date.now().toString(), from:'assistant', text: `Suggested actions: ${sug.map(s=>s.text).slice(0,2).join(' · ')}`, ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        setMessages(s=>[...s, assistMsg])
      } finally {
        setTyping({who:'assistant', val:false})
      }
    })()
  }

  // when agent sends a message, trigger assistant suggestions based on last passenger message
  function send(){
    if(!input.trim()) return
    const m:Message = {id:Date.now().toString(),from:'agent',text:input,ts:new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    setMessages(s=>[...s,m])
    setInput('')
    if(onSend) onSend(m)

    // find last passenger message to provide context
    const lastPassenger = [...messages].reverse().find(x=> x.from==='passenger')
    triggerAssistant(lastPassenger ? lastPassenger.text : m.text)
  }

  // allow parent to register a callback to append text into the draft
  React.useEffect(()=>{
    if(registerAppend){
      registerAppend((text:string)=>{
        setInput(s => (s && s.length > 0) ? `${s} ${text}` : text)
      })
    }
  },[registerAppend])

  function sendSuggestionAsAgent(s:Suggestion){
    const m:Message = {id:Date.now().toString(), from:'agent', text:s.text, ts:new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
    setMessages(s=>[...s,m])
    // remove suggestions after using
    setSuggestions([])
    setSelectedSuggestion(undefined)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(m=> (
          <div key={m.id} className={`max-w-[80%] ${m.from==='agent' ? 'bg-white self-start' : m.from==='passenger' ? 'bg-primary-strong text-white self-end' : 'bg-gray-100 self-start'} p-3 rounded-lg`}>
            <div className={m.from==='agent' ? 'text-sm text-gray-800' : m.from==='passenger' ? 'text-sm text-white' : 'text-sm text-gray-800'}>{m.text}</div>
            <div className="text-xs text-gray-500 mt-1">{m.ts}</div>
          </div>
        ))}

        {typing.val && typing.who === 'assistant' && (
          <div className="self-start bg-gray-100 p-2 rounded-md inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center font-semibold">AI</div>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" />
            </div>
            <div className="text-sm text-gray-600 ml-2">Assistant is generating suggestions...</div>
          </div>
        )}
      </div>

      {/* Suggestions panel */}
      <div className="p-3 border-t bg-white">
        {suggestions.length > 0 && (
          <div className="mb-3">
            <div className="text-sm font-semibold mb-2">AI Suggestions</div>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map(s=> (
                <button key={s.id} onClick={()=> setSelectedSuggestion(s.id)} className={`px-3 py-1 rounded-full border ${selectedSuggestion===s.id? 'bg-primary-strong text-white' : 'bg-gray-100'}`}>
                  {s.text}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>{
                const sel = suggestions.find(x=> x.id===selectedSuggestion) || suggestions[0]
                if(sel) setInput(sel.text)
              }} className="px-3 py-1 rounded-md border">Insert into draft</button>
              <button onClick={()=>{
                const sel = suggestions.find(x=> x.id===selectedSuggestion) || suggestions[0]
                if(sel) sendSuggestionAsAgent(sel)
              }} className="px-3 py-1 rounded-md bg-primary-strong text-white">Send suggestion</button>
              <button onClick={()=>{ setSuggestions([]); setSelectedSuggestion(undefined)}} className="px-3 py-1 rounded-md border">Dismiss</button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <textarea value={input} onChange={e=>setInput(e.target.value)} className="flex-1 rounded-md p-2 border" rows={2} />
          <div className="flex flex-col gap-2">
            <button onClick={send} className="px-4 bg-primary-strong hover:bg-primary text-white rounded-md">Send</button>
            <button onClick={()=>{
              // quick trigger: generate suggestions from last passenger message
              const lastPassenger = [...messages].reverse().find(x=> x.from==='passenger')
              triggerAssistant(lastPassenger ? lastPassenger.text : input)
            }} className="px-4 rounded-md border">Generate suggestions</button>
          </div>
        </div>
      </div>
    </div>
  )
}
