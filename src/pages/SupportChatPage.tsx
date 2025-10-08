import React from 'react'
import { useRoute, Link } from 'wouter'
import { MOCK_PASSENGERS } from '../data/mock'
import ThemeToggle from '../components/ThemeToggle'
import PassengerInfo from '../components/PassengerInfo'
import ChatInterface from '../components/ChatInterface'
import HeartLogo from '../images/Heart_UI_Logo.png'

export default function SupportChatPage(){
  const [match, params] = useRoute('/support/:id/chat')
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

  const [appendFn, setAppendFn] = React.useState<((t:string)=>void) | null>(null)
  const [listening, setListening] = React.useState(false)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<BlobPart[]>([])

  async function startRecording(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return alert('Microphone not available')
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      mr.ondataavailable = (ev:any) => audioChunksRef.current.push(ev.data)
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('file', blob, 'recording.webm')
        try{
          const res = await fetch('http://localhost:3001/api/whisper', { method: 'POST', body: form })
          if(!res.ok) throw new Error(await res.text())
          const json = await res.json()
          const text = json.transcript || json.text || ''
          if(appendFn && text) appendFn(text)
        }catch(err:any){
          console.error('transcribe error', err)
          alert('Transcription failed: '+(err.message||err))
        }
        // stop all tracks
        stream.getTracks().forEach(t=>t.stop())
        setListening(false)
      }
      mediaRecorderRef.current = mr
      mr.start()
      setListening(true)
    }catch(e:any){
      console.error(e)
      alert('Could not start microphone: '+(e.message||e))
    }
  }

  function stopRecording(){
    const mr = mediaRecorderRef.current
    if(mr && mr.state !== 'inactive') mr.stop()
    setListening(false)
  }

  function toggleListen(){
    if(listening) stopRecording()
    else startRecording()
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
            <div className="p-3 border-b text-gray-900 dark:text-white flex items-center justify-between">
              <div>Voice Chat</div>
              <div className="flex items-center gap-2">
                <button onClick={toggleListen} className={`px-3 py-1 rounded-md ${listening ? 'bg-red-500 text-white' : 'border'}`}>
                  {listening ? 'Stop' : 'Start'} Voice
                </button>
              </div>
            </div>
            <div className="flex-1">
              <ChatInterface registerAppend={fn=>setAppendFn(()=>fn)} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
