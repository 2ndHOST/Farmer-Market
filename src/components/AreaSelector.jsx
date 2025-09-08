import { useState } from 'react'
import { MapPin, Navigation, RefreshCw, CheckCircle } from 'lucide-react'
import { useLocation } from '../contexts/LocationContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function AreaSelector() {
  const { 
    location, 
    radius, 
    isLoading, 
    error, 
    isLocationSet,
    setLocation, 
    setRadius, 
    setLoading, 
    setError 
  } = useLocation()
  
  const { t } = useLanguage()
  const [manualLocation, setManualLocation] = useState('')

  // Get current location using Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setLoading()
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocoding to get address (using a free service)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await response.json()
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: data.localityInfo?.administrative?.[0]?.name || 
                    data.localityInfo?.administrative?.[1]?.name || 
                    `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }
          
          setLocation(locationData)
        } catch (error) {
          // Fallback if reverse geocoding fails
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }
          setLocation(locationData)
        }
      },
      (error) => {
        let errorMessage = 'Failed to get location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Handle manual location entry (simplified for demo)
  const handleManualLocation = () => {
    if (!manualLocation.trim()) {
      setError('Please enter a location')
      return
    }
    
    // For demo purposes, use a mock location
    const mockLocation = {
      lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Mumbai area with some variation
      lng: 72.8777 + (Math.random() - 0.5) * 0.1,
      address: manualLocation.trim()
    }
    
    setLocation(mockLocation)
    setManualLocation('')
  }

  return (
    <div className="bg-green-50 rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">{t('setYourArea')}</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        {t('areaSubtitle')}
      </p>

      {/* Location Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('location')}</h3>
        
        {!isLocationSet ? (
          <div className="space-y-4">
            <button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {isLoading ? t('detectingLocation') : t('autoDetectLocation')}
            </button>
            
            <div className="text-center text-gray-500">{t('or')}</div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('manualLocationPlaceholder')}
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={handleManualLocation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('setLocation')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">{location.address}</p>
                <p className="text-sm text-gray-500">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setLocation(null)
                setError(null)
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* Radius Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Search Radius: {radius} km
        </h3>
        
        <div className="space-y-3">
          <input
            type="range"
            min="1"
            max="100"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full accent-green-600"
          />
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>1 km</span>
            <span>50 km</span>
            <span>100 km</span>
          </div>
          
          {/* Quick radius buttons */}
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 25, 50].map((value) => (
              <button
                key={value}
                onClick={() => setRadius(value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  radius === value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {value} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Status */}
      {isLocationSet && (
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-gray-900 mb-2">Current Settings</h4>
          <p className="text-sm text-gray-600">
            <strong>Location:</strong> {location.address}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Radius:</strong> {radius} km
          </p>
          <p className="text-xs text-green-600 mt-2">
            ✓ This area will be used to filter listings across all pages
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
