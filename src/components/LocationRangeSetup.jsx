import React, { useState, useEffect } from 'react'
import { useLocationRange } from '../contexts/LocationRangeContext'
import { MapPin, Settings, Check, Loader2, Navigation, AlertCircle } from 'lucide-react'

const LocationRangeSetup = ({ isOnboarding = false, isBuyer = false, onComplete }) => {
  const { updateFarmerLocation, updateBuyerLocation, farmerLocation, buyerLocation, getCoordinatesFromLocation } = useLocationRange()
  const [formData, setFormData] = useState({
    baseLocation: '',
    city: '',
    state: '',
    pincode: '',
    deliveryRadius: 50
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [autoDetectedCoords, setAutoDetectedCoords] = useState(null)

  // Initialize form with existing data
  useEffect(() => {
    const locationData = isBuyer ? buyerLocation : farmerLocation
    if (locationData.isSet) {
      setFormData({
        baseLocation: `${locationData.city}, ${locationData.state}`,
        city: locationData.city,
        state: locationData.state,
        pincode: locationData.pincode,
        deliveryRadius: isBuyer ? locationData.searchRadius : locationData.deliveryRadius
      })
    }
  }, [farmerLocation, buyerLocation, isBuyer])

  // Auto-detect location on component mount
  useEffect(() => {
    if (isOnboarding && !isDetectingLocation) {
      autoDetectLocation()
    }
  }, [isOnboarding])

  // Reverse geocoding function using OpenStreetMap Nominatim API
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.address) {
        const address = data.address
        return {
          city: address.city || address.town || address.village || address.suburb || '',
          state: address.state || address.region || '',
          pincode: address.postcode || '',
          country: address.country || ''
        }
      }
      throw new Error('Unable to get address details')
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      throw error
    }
  }

  // Auto-detect user location using browser geolocation API
  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }

    setIsDetectingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setAutoDetectedCoords({ latitude, longitude })
          
          // Perform reverse geocoding
          const addressData = await reverseGeocode(latitude, longitude)
          
          // Pre-fill form with detected data
          setFormData(prev => ({
            ...prev,
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            baseLocation: `${addressData.city}, ${addressData.state}`
          }))
          
          setIsDetectingLocation(false)
        } catch (error) {
          setLocationError('Failed to get address details. Please enter manually.')
          setIsDetectingLocation(false)
        }
      },
      (error) => {
        let errorMessage = 'We couldn\'t detect your location. Please enter manually.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enter your location manually.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please enter manually.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please enter manually.'
            break
        }
        
        setLocationError(errorMessage)
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use auto-detected coordinates if available, otherwise get coordinates from location
      let coordinates
      if (autoDetectedCoords) {
        coordinates = {
          lat: autoDetectedCoords.latitude,
          lon: autoDetectedCoords.longitude
        }
      } else {
        coordinates = await getCoordinatesFromLocation(`${formData.city}, ${formData.state}`)
      }
      
      if (isBuyer) {
        await updateBuyerLocation({
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          searchRadius: parseInt(formData.deliveryRadius),
          latitude: coordinates.lat,
          longitude: coordinates.lon
        })
      } else {
        await updateFarmerLocation({
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          deliveryRadius: parseInt(formData.deliveryRadius),
          latitude: coordinates.lat,
          longitude: coordinates.lon
        })
      }

      setShowSuccess(true)
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        if (onComplete) onComplete()
      }, 3000)

    } catch (error) {
      console.error('Error setting up location range:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const radiusOptions = [
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' },
    { value: 200, label: '200 km' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${isBuyer ? 'bg-blue-100' : 'bg-green-100'}`}>
          <MapPin className={`h-5 w-5 ${isBuyer ? 'text-blue-600' : 'text-green-600'}`} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isOnboarding 
              ? (isBuyer ? 'Set Your Location' : 'Set Your Delivery Range')
              : (isBuyer ? 'Update Location' : 'Update Delivery Range')
            }
          </h2>
          <p className="text-gray-600 text-sm">
            {isBuyer 
              ? 'Configure your location and search radius to find nearby farmers'
              : 'Configure your base location and delivery radius to receive relevant orders'
            }
          </p>
        </div>
      </div>

      {/* Auto-detection status */}
      {isDetectingLocation && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <p className="text-blue-800 font-medium">Detecting your location...</p>
            <p className="text-blue-700 text-sm">
              Please allow location access when prompted by your browser.
            </p>
          </div>
        </div>
      )}

      {/* Location error */}
      {locationError && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-yellow-800 font-medium">Location Detection Failed</p>
            <p className="text-yellow-700 text-sm">{locationError}</p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Location range updated successfully!</p>
            <p className="text-green-700 text-sm">
              Your {isBuyer ? 'search area' : 'delivery range'} has been saved and will be used across the platform.
            </p>
          </div>
        </div>
      )}

      {/* Auto-detect button */}
      {!isDetectingLocation && locationError && (
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={autoDetectLocation}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Navigation className="h-4 w-4" />
            Try Auto-Detect Again
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
              {autoDetectedCoords && (
                <span className="text-green-600 text-xs ml-2">✓ Auto-detected</span>
              )}
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="e.g., Mumbai"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
              {autoDetectedCoords && (
                <span className="text-green-600 text-xs ml-2">✓ Auto-detected</span>
              )}
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="e.g., Maharashtra"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
              {autoDetectedCoords && (
                <span className="text-green-600 text-xs ml-2">✓ Auto-detected</span>
              )}
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="e.g., 400001"
              maxLength="6"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Delivery/Search Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isBuyer ? 'Search Radius' : 'Delivery Radius'} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.deliveryRadius}
              onChange={(e) => handleInputChange('deliveryRadius', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {radiusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium mb-1">How this works:</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• You'll only receive orders from buyers within your delivery radius</li>
                <li>• Buyers will see "Delivers up to {formData.deliveryRadius}km from {formData.city || 'your location'}" on your listings</li>
                <li>• You can update this anytime in your profile settings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Setting up...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                {isOnboarding ? 'Complete Setup' : 'Update Range'}
              </>
            )}
          </button>
          
          {!isOnboarding && (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition font-semibold text-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default LocationRangeSetup
