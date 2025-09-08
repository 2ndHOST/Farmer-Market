import { createContext, useContext, useReducer, useEffect } from 'react'

const LocationContext = createContext()

// Action types
const LOCATION_ACTIONS = {
  SET_LOCATION: 'SET_LOCATION',
  SET_RADIUS: 'SET_RADIUS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_LOCATION: 'CLEAR_LOCATION'
}

// Initial state
const initialState = {
  location: null, // { lat, lng, address }
  radius: 10, // km
  isLoading: false,
  error: null,
  isLocationSet: false
}

// Reducer
function locationReducer(state, action) {
  switch (action.type) {
    case LOCATION_ACTIONS.SET_LOCATION:
      return {
        ...state,
        location: action.payload,
        isLoading: false,
        error: null,
        isLocationSet: true
      }
    case LOCATION_ACTIONS.SET_RADIUS:
      return {
        ...state,
        radius: action.payload
      }
    case LOCATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case LOCATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isLocationSet: false
      }
    case LOCATION_ACTIONS.CLEAR_LOCATION:
      return {
        ...state,
        location: null,
        isLocationSet: false,
        error: null
      }
    default:
      return state
  }
}

// Provider component
export function LocationProvider({ children }) {
  const [state, dispatch] = useReducer(locationReducer, initialState)

  // Load saved location and radius from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('farmer_location')
    const savedRadius = localStorage.getItem('farmer_radius')
    
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        dispatch({ type: LOCATION_ACTIONS.SET_LOCATION, payload: location })
      } catch (error) {
        console.error('Failed to parse saved location:', error)
      }
    }
    
    if (savedRadius) {
      dispatch({ type: LOCATION_ACTIONS.SET_RADIUS, payload: parseInt(savedRadius) })
    }
  }, [])

  // Save to localStorage whenever location or radius changes
  useEffect(() => {
    if (state.location) {
      localStorage.setItem('farmer_location', JSON.stringify(state.location))
    }
    localStorage.setItem('farmer_radius', state.radius.toString())
  }, [state.location, state.radius])

  // Actions
  const setLocation = (location) => {
    dispatch({ type: LOCATION_ACTIONS.SET_LOCATION, payload: location })
  }

  const setRadius = (radius) => {
    dispatch({ type: LOCATION_ACTIONS.SET_RADIUS, payload: radius })
  }

  const setLoading = () => {
    dispatch({ type: LOCATION_ACTIONS.SET_LOADING })
  }

  const setError = (error) => {
    dispatch({ type: LOCATION_ACTIONS.SET_ERROR, payload: error })
  }

  const clearLocation = () => {
    dispatch({ type: LOCATION_ACTIONS.CLEAR_LOCATION })
    localStorage.removeItem('farmer_location')
  }

  const value = {
    ...state,
    setLocation,
    setRadius,
    setLoading,
    setError,
    clearLocation
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

// Custom hook to use location context
export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export default LocationContext
