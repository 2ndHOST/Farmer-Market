import React, { createContext, useContext, useState, useEffect } from 'react'

const LocationRangeContext = createContext()

export const useLocationRange = () => {
  const context = useContext(LocationRangeContext)
  if (!context) {
    throw new Error('useLocationRange must be used within a LocationRangeProvider')
  }
  return context
}

export const LocationRangeProvider = ({ children }) => {
  const [farmerLocation, setFarmerLocation] = useState({
    baseLocation: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
    deliveryRadius: 50, // Default 50km
    isSet: false
  })

  const [buyerLocation, setBuyerLocation] = useState({
    location: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
    isSet: false
  })

  const [searchRadius, setSearchRadius] = useState(50) // Default search radius for buyers

  // Load saved location data from localStorage on mount
  useEffect(() => {
    const savedFarmerLocation = localStorage.getItem('farmerLocation')
    const savedBuyerLocation = localStorage.getItem('buyerLocation')
    const savedSearchRadius = localStorage.getItem('searchRadius')

    if (savedFarmerLocation) {
      setFarmerLocation(JSON.parse(savedFarmerLocation))
    }
    if (savedBuyerLocation) {
      setBuyerLocation(JSON.parse(savedBuyerLocation))
    }
    if (savedSearchRadius) {
      setSearchRadius(parseInt(savedSearchRadius))
    }
  }, [])

  // Save farmer location to localStorage whenever it changes
  const updateFarmerLocation = (locationData) => {
    const updatedLocation = { ...farmerLocation, ...locationData, isSet: true }
    setFarmerLocation(updatedLocation)
    localStorage.setItem('farmerLocation', JSON.stringify(updatedLocation))
  }

  // Save buyer location to localStorage whenever it changes
  const updateBuyerLocation = (locationData) => {
    const updatedLocation = { ...buyerLocation, ...locationData, isSet: true }
    setBuyerLocation(updatedLocation)
    localStorage.setItem('buyerLocation', JSON.stringify(updatedLocation))
  }

  // Update search radius
  const updateSearchRadius = (radius) => {
    setSearchRadius(radius)
    localStorage.setItem('searchRadius', radius.toString())
  }

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null

    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c // Distance in kilometers
    return Math.round(distance * 10) / 10 // Round to 1 decimal place
  }

  // Check if a buyer location is within farmer's delivery range
  const isWithinDeliveryRange = (farmerLat, farmerLon, farmerRadius, buyerLat, buyerLon) => {
    const distance = calculateDistance(farmerLat, farmerLon, buyerLat, buyerLon)
    return distance !== null && distance <= farmerRadius
  }

  // Get coordinates from location string (mock implementation - in real app would use geocoding API)
  const getCoordinatesFromLocation = async (locationString) => {
    // Mock coordinates for common Indian cities
    const mockCoordinates = {
      'mumbai': { lat: 19.0760, lon: 72.8777 },
      'delhi': { lat: 28.7041, lon: 77.1025 },
      'bangalore': { lat: 12.9716, lon: 77.5946 },
      'pune': { lat: 18.5204, lon: 73.8567 },
      'hyderabad': { lat: 17.3850, lon: 78.4867 },
      'chennai': { lat: 13.0827, lon: 80.2707 },
      'kolkata': { lat: 22.5726, lon: 88.3639 },
      'ahmedabad': { lat: 23.0225, lon: 72.5714 },
      'jaipur': { lat: 26.9124, lon: 75.7873 },
      'lucknow': { lat: 26.8467, lon: 80.9462 }
    }

    const cityKey = locationString.toLowerCase().split(',')[0].trim()
    return mockCoordinates[cityKey] || { lat: 20.5937, lon: 78.9629 } // Default to center of India
  }

  // Filter items based on location range
  const filterByLocationRange = (items, userLat, userLon, radius) => {
    if (!userLat || !userLon) return items

    return items.filter(item => {
      if (!item.farmerLatitude || !item.farmerLongitude) return true // Include items without location data
      const distance = calculateDistance(userLat, userLon, item.farmerLatitude, item.farmerLongitude)
      return distance === null || distance <= radius
    })
  }

  const value = {
    farmerLocation,
    buyerLocation,
    searchRadius,
    updateFarmerLocation,
    updateBuyerLocation,
    updateSearchRadius,
    calculateDistance,
    isWithinDeliveryRange,
    getCoordinatesFromLocation,
    filterByLocationRange
  }

  return (
    <LocationRangeContext.Provider value={value}>
      {children}
    </LocationRangeContext.Provider>
  )
}
