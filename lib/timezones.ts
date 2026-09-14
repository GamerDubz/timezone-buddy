export type Region = 'Americas' | 'Europe & Africa' | 'Asia Pacific'

export interface TimezoneEntry {
  id: string
  city: string
  country: string
  tz: string
  region: Region
}

export const TIMEZONES: TimezoneEntry[] = [
  { id: 'UTC', city: 'UTC', country: 'Coordinated Universal Time', tz: 'UTC', region: 'Europe & Africa' },
  { id: 'NY', city: 'New York', country: 'United States', tz: 'America/New_York', region: 'Americas' },
  { id: 'LA', city: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', region: 'Americas' },
  { id: 'Chicago', city: 'Chicago', country: 'United States', tz: 'America/Chicago', region: 'Americas' },
  { id: 'Denver', city: 'Denver', country: 'United States', tz: 'America/Denver', region: 'Americas' },
  { id: 'Toronto', city: 'Toronto', country: 'Canada', tz: 'America/Toronto', region: 'Americas' },
  { id: 'Mexico', city: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City', region: 'Americas' },
  { id: 'SaoPaulo', city: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo', region: 'Americas' },
  { id: 'London', city: 'London', country: 'United Kingdom', tz: 'Europe/London', region: 'Europe & Africa' },
  { id: 'Lisbon', city: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon', region: 'Europe & Africa' },
  { id: 'Paris', city: 'Paris', country: 'France', tz: 'Europe/Paris', region: 'Europe & Africa' },
  { id: 'Berlin', city: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', region: 'Europe & Africa' },
  { id: 'Athens', city: 'Athens', country: 'Greece', tz: 'Europe/Athens', region: 'Europe & Africa' },
  { id: 'Cairo', city: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo', region: 'Europe & Africa' },
  { id: 'Johannesburg', city: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg', region: 'Europe & Africa' },
  { id: 'Moscow', city: 'Moscow', country: 'Russia', tz: 'Europe/Moscow', region: 'Europe & Africa' },
  { id: 'Dubai', city: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai', region: 'Asia Pacific' },
  { id: 'Mumbai', city: 'Mumbai', country: 'India', tz: 'Asia/Kolkata', region: 'Asia Pacific' },
  { id: 'Bangkok', city: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok', region: 'Asia Pacific' },
  { id: 'Singapore', city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', region: 'Asia Pacific' },
  { id: 'HongKong', city: 'Hong Kong', country: 'China', tz: 'Asia/Hong_Kong', region: 'Asia Pacific' },
  { id: 'Shanghai', city: 'Shanghai', country: 'China', tz: 'Asia/Shanghai', region: 'Asia Pacific' },
  { id: 'Seoul', city: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', region: 'Asia Pacific' },
  { id: 'Tokyo', city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', region: 'Asia Pacific' },
  { id: 'Sydney', city: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', region: 'Asia Pacific' },
  { id: 'Perth', city: 'Perth', country: 'Australia', tz: 'Australia/Perth', region: 'Asia Pacific' },
  { id: 'Auckland', city: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland', region: 'Asia Pacific' },
]

export const DEFAULT_SELECTED = ['UTC', 'NY', 'London', 'Tokyo', 'Sydney']

export const REGIONS: Region[] = ['Americas', 'Europe & Africa', 'Asia Pacific']
