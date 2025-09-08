// Utility functions for location-based filtering

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Filter items by location and radius
 * @param {Array} items - Array of items with location data
 * @param {Object} userLocation - User's location { lat, lng }
 * @param {number} radius - Radius in kilometers
 * @param {string} latKey - Key for latitude in item object (default: 'lat')
 * @param {string} lngKey - Key for longitude in item object (default: 'lng')
 * @returns {Array} Filtered items within radius
 */
export function filterByLocation(items, userLocation, radius, latKey = 'lat', lngKey = 'lng') {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return items // Return all items if no location is set
  }

  return items.filter(item => {
    if (!item[latKey] || !item[lngKey]) {
      return false // Exclude items without location data
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      item[latKey],
      item[lngKey]
    )

    return distance <= radius
  })
}

/**
 * Add distance information to items
 * @param {Array} items - Array of items with location data
 * @param {Object} userLocation - User's location { lat, lng }
 * @param {string} latKey - Key for latitude in item object (default: 'lat')
 * @param {string} lngKey - Key for longitude in item object (default: 'lng')
 * @returns {Array} Items with added distance property
 */
export function addDistanceToItems(items, userLocation, latKey = 'lat', lngKey = 'lng') {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return items.map(item => ({ ...item, distance: null }))
  }

  return items.map(item => {
    if (!item[latKey] || !item[lngKey]) {
      return { ...item, distance: null }
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      item[latKey],
      item[lngKey]
    )

    return { ...item, distance: Math.round(distance * 10) / 10 } // Round to 1 decimal place
  })
}

/**
 * Sort items by distance (closest first)
 * @param {Array} items - Array of items with distance property
 * @returns {Array} Sorted items
 */
export function sortByDistance(items) {
  return [...items].sort((a, b) => {
    if (a.distance === null && b.distance === null) return 0
    if (a.distance === null) return 1
    if (b.distance === null) return -1
    return a.distance - b.distance
  })
}

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance) {
  if (distance === null || distance === undefined) return 'Unknown'
  if (distance < 1) return `${Math.round(distance * 1000)}m`
  return `${distance}km`
}
