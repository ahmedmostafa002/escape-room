"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X, Search, MapPin, Tag } from "lucide-react"
import { getAllStatesFromDatabase, getCitiesWithCounts, getThemesWithCounts, getAllCountriesFromDatabase, getStatesWithRoomCounts } from "@/lib/supabase"

interface SearchFiltersProps {
  onFiltersChange?: (filters: {
    name: string
    city: string
    state: string
    country: string
    category: string
  }) => void
}

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [filters, setFilters] = useState({
    name: '',
    city: '',
    state: '',
    country: '',
    category: ''
  })
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<{abbreviation: string, fullName: string}[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFilterData()
  }, [])

  useEffect(() => {
    if (filters.country) {
      loadStatesForCountry(filters.country)
    } else {
      setStates([])
      setCities([])
    }
  }, [filters.country])

  useEffect(() => {
    if (filters.state) {
      loadCitiesForState(filters.state)
    } else {
      setCities([])
    }
  }, [filters.state])

  const loadFilterData = async () => {
    try {
      const [countriesData, themesData] = await Promise.all([
        getAllCountriesFromDatabase(),
        getThemesWithCounts()
      ])
      
      setCountries(countriesData.data || [])
      setThemes(themesData.data?.map(t => t.theme).filter(Boolean) || [])
    } catch (error) {
      console.error('Error loading filter data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStatesForCountry = async (country: string) => {
    try {
      const statesData = await getStatesWithRoomCounts(country)
      const statesWithNames = statesData.data?.map(s => ({
        abbreviation: s.state,
        fullName: s.fullName
      })).filter(s => s.abbreviation && s.fullName) || []
      setStates(statesWithNames)
    } catch (error) {
      console.error('Error loading states:', error)
      setStates([])
    }
  }

  const loadCitiesForState = async (state: string) => {
    try {
      // Convert full state name to abbreviation for the API call
      const stateAbbr = states.find(s => s.fullName === state)?.abbreviation || state
      const citiesData = await getCitiesWithCounts(stateAbbr)
      setCities(citiesData.data?.map(c => c.city).filter(Boolean) || [])
    } catch (error) {
      console.error('Error loading cities:', error)
      setCities([])
    }
  }

  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter))
    // Also clear the corresponding filter
    if (filter.includes('Name:')) {
      handleFilterChange('name', '')
    } else if (filter.includes('City:')) {
      handleFilterChange('city', '')
    } else if (filter.includes('State:')) {
      handleFilterChange('state', '')
      setCities([]) // Clear cities when state is removed
    } else if (filter.includes('Country:')) {
      handleFilterChange('country', '')
      setStates([]) // Clear states when country is removed
      setCities([]) // Clear cities when country is removed
    } else if (filter.includes('Theme:')) {
      handleFilterChange('category', '')
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    let newFilters = { ...filters, [key]: value }
    let filtersForBackend = { ...newFilters }
    
    // If country changes, clear state and city
    if (key === 'country') {
      newFilters = { ...newFilters, state: '', city: '' }
      filtersForBackend = { ...filtersForBackend, state: '', city: '' }
      if (value) {
        loadStatesForCountry(value)
      } else {
        setStates([])
        setCities([])
      }
    }
    // If state changes, clear the city
    else if (key === 'state') {
      newFilters = { ...newFilters, city: '' }
      filtersForBackend = { ...filtersForBackend, city: '' }
      // Convert full state name to abbreviation for backend
      if (value) {
        const stateAbbr = states.find(s => s.fullName === value)?.abbreviation || value
        filtersForBackend = { ...filtersForBackend, state: stateAbbr }
        loadCitiesForState(value)
      } else {
        setCities([])
      }
    }
    
    setFilters(newFilters)
    
    // Update selected filters for display
    const updatedFilters = [...selectedFilters]
    const filterPrefix = key === 'name' ? 'Name:' : key === 'city' ? 'City:' : key === 'state' ? 'State:' : key === 'country' ? 'Country:' : 'Theme:'
    
    // Remove existing filter of this type
    const existingIndex = updatedFilters.findIndex(f => f.startsWith(filterPrefix))
    if (existingIndex !== -1) {
      updatedFilters.splice(existingIndex, 1)
    }
    
    // If country changes, also remove state and city filters
    if (key === 'country') {
      const stateIndex = updatedFilters.findIndex(f => f.startsWith('State:'))
      if (stateIndex !== -1) {
        updatedFilters.splice(stateIndex, 1)
      }
      const cityIndex = updatedFilters.findIndex(f => f.startsWith('City:'))
      if (cityIndex !== -1) {
        updatedFilters.splice(cityIndex, 1)
      }
    }
    // If state changes, also remove city filter
    else if (key === 'state') {
      const cityIndex = updatedFilters.findIndex(f => f.startsWith('City:'))
      if (cityIndex !== -1) {
        updatedFilters.splice(cityIndex, 1)
      }
    }
    
    // Add new filter if value is not empty
    if (value) {
      updatedFilters.push(`${filterPrefix} ${value}`)
    }
    
    setSelectedFilters(updatedFilters)
    onFiltersChange?.(filtersForBackend)
  }



  const clearAllFilters = () => {
    const clearedFilters = {
      name: '',
      city: '',
      state: '',
      country: '',
      category: ''
    }
    setFilters(clearedFilters)
    setSelectedFilters([])
    setCities([])
    setStates([])
    onFiltersChange?.(clearedFilters)
  }

  return (
    <Card className="mb-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-escape-red/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Filter className="h-5 w-5 text-escape-red" />
          <span className="text-gray-900">Search & Filter Escape Rooms</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Room Name Search */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
            <Search className="h-4 w-4 text-escape-red" />
            Search by Room Name
          </label>
          <Input
            type="text"
            placeholder="Enter escape room name..."
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-escape-red focus:ring-escape-red transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-escape-red" />
              Country
            </label>
            <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-escape-red bg-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                {loading ? (
                  <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                ) : (
                  countries.map((country, index) => (
                    <SelectItem key={`country-${index}-${country}`} value={country} className="hover:bg-escape-red/10">
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-escape-red-600" />
              State
            </label>
            <Select value={filters.state} onValueChange={(value) => handleFilterChange('state', value)} disabled={!filters.country}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-escape-red-600 bg-white">
                <SelectValue placeholder={filters.country ? "Select state" : "Select country first"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                {loading ? (
                  <SelectItem value="loading" disabled>Loading states...</SelectItem>
                ) : (
                  states.map((state, index) => (
                    <SelectItem key={`state-${index}-${state.fullName}`} value={state.fullName} className="hover:bg-escape-red-600/10">
                      {state.fullName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-escape-red-700" />
              City
            </label>
            <Select 
              value={filters.city} 
              onValueChange={(value) => handleFilterChange('city', value)}
              disabled={!filters.state}
            >
              <SelectTrigger className="border-2 border-gray-200 focus:border-escape-red-700 bg-white disabled:opacity-50">
                <SelectValue placeholder={filters.state ? "Select city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                {cities.length === 0 && filters.state ? (
                  <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                ) : (
                  cities.map((city, index) => (
                    <SelectItem key={`city-${index}-${city}`} value={city} className="hover:bg-escape-red-700/10">
                      {city}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-escape-red-800" />
              Theme
            </label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-escape-red-800 bg-white">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                {loading ? (
                  <SelectItem value="loading" disabled>Loading themes...</SelectItem>
                ) : (
                  themes.map((theme, index) => (
                    <SelectItem key={`theme-${index}-${theme}`} value={theme} className="hover:bg-escape-red-800/10">
                      {theme}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter, index) => {
                const [type, ...valueParts] = filter.split(': ')
                const value = valueParts.join(': ')
                const colorMap: Record<string, string> = {
                  'Name': 'bg-escape-red hover:bg-escape-red-600',
                  'State': 'bg-escape-red-600 hover:bg-escape-red-700',
                  'City': 'bg-escape-red-700 hover:bg-escape-red-800',
                  'Theme': 'bg-escape-red-800 hover:bg-escape-red-900',
                  'Country': 'bg-escape-red hover:bg-escape-red-600'
                }
                return (
                  <Badge 
                    key={`filter-${index}-${filter}`} 
                    className={`flex items-center gap-2 text-white transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${colorMap[type] || 'bg-gray-500 hover:bg-gray-600'}`}
                    onClick={() => removeFilter(filter)}
                  >
                    <span className="text-xs font-medium">{type}</span>
                    <span className="text-xs">{value}</span>
                    <X className="h-3 w-3" />
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            onClick={clearAllFilters}
            variant="outline" 
            className="border-2 border-escape-red text-escape-red hover:bg-gradient-to-r hover:from-escape-red hover:to-escape-red-600 hover:text-white font-semibold px-6 py-2 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
