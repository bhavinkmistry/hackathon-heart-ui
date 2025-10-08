export type FlightStatus = 'confirmed' | 'delayed' | 'cancelled'

export interface Flight {
  id: string
  number: string
  date: string
  from: string
  to: string
  departTime: string
  arriveTime: string
  status: FlightStatus
}

export interface Passenger {
  id: string
  name: string
  email: string
  phone: string
  bookingRef: string
  loyaltyId?: string
  flights: Flight[]
}

export const MOCK_PASSENGERS: Passenger[] = [
  {
    id: 'p1',
    name: 'Bhavin Mistry',
    email: 'bhavin.m@example.com',
    phone: '+1 555-123-4567',
    bookingRef: 'ABC123',
    loyaltyId: '123456789',
    flights: [
      {
        id: 'f1',
        number: 'FC123',
        date: '2025-10-10',
        from: 'JFK',
        to: 'LAX',
        departTime: '08:30',
        arriveTime: '11:45',
        status: 'confirmed'
      },
      {
        id: 'f2',
        number: 'FC456',
        date: '2025-10-12',
        from: 'LAX',
        to: 'SFO',
        departTime: '14:00',
        arriveTime: '15:20',
        status: 'delayed'
      },
      {
        id: 'f3',
        number: 'FC789',
        date: '2025-10-15',
        from: 'SFO',
        to: 'SEA',
        departTime: '09:00',
        arriveTime: '11:10',
        status: 'cancelled'
      }
    ]
  }
  ,
  {
    id: 'p2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-987-6543',
    bookingRef: 'XYZ789',
    loyaltyId: '987654321',
    flights: [
      {
        id: 'f4',
        number: 'FC999',
        date: '2025-11-01',
        from: 'ORD',
        to: 'MIA',
        departTime: '07:15',
        arriveTime: '11:05',
        status: 'confirmed'
      },
      {
        id: 'f5',
        number: 'FC100',
        date: '2025-11-05',
        from: 'MIA',
        to: 'ATL',
        departTime: '13:30',
        arriveTime: '15:10',
        status: 'delayed'
      }
    ]
  }
]
