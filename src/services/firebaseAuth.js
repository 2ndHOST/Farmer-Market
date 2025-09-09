import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase.js'

// Global reCAPTCHA verifier instance
let recaptchaVerifier = null

// Initialize reCAPTCHA verifier
export function initializeRecaptcha() {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved:', response)
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired')
      }
    })
  }
  return recaptchaVerifier
}

// Firebase test phone numbers (work without billing)
const TEST_PHONE_NUMBERS = [
  '+1 650-555-3434',
  '+1 650-555-3435', 
  '+1 650-555-3436',
  '+1 650-555-3437',
  '+1 650-555-3438'
]

// Development OTP codes
const DEV_OTP_CODES = ['123456', '000000']

// Error messages mapping
const ERROR_MESSAGES = {
  'auth/invalid-phone-number': 'Invalid phone number format. Please use international format (+1234567890)',
  'auth/too-many-requests': 'Too many requests. Please try again later.',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.'
}

// Check if phone number is a test number
function isTestNumber(phoneNumber) {
  return TEST_PHONE_NUMBERS.some(testNum => 
    phoneNumber.replace(/\s/g, '') === testNum.replace(/\s/g, '')
  )
}

// Create development mode confirmation result
function createDevConfirmationResult(phoneNumber) {
  return {
    confirm: async (code) => {
      if (DEV_OTP_CODES.includes(code)) {
        return {
          user: {
            uid: 'dev-user-' + Date.now(),
            phoneNumber: phoneNumber,
            displayName: null
          }
        }
      }
      throw new Error(`Invalid OTP. Use ${DEV_OTP_CODES.join(' or ')} for development.`)
    }
  }
}

// Send OTP to phone number
export async function sendOTP(phoneNumber) {
  try {
    console.log('Sending OTP to:', phoneNumber)
    
    const isTest = isTestNumber(phoneNumber)
    console.log(isTest ? 'Using Firebase test number' : 'Using development mode')
    
    // Initialize reCAPTCHA
    const recaptcha = initializeRecaptcha()
    
    // Try to send OTP via Firebase
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
    console.log('OTP sent successfully')
    
    return {
      success: true,
      confirmationResult,
      message: isTest ? 'Test OTP sent successfully' : 'OTP sent successfully'
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    
    // Handle billing not enabled - use development mode
    if (error.code === 'auth/billing-not-enabled') {
      console.warn('Firebase billing not enabled. Using development mode.')
      return {
        success: true,
        confirmationResult: createDevConfirmationResult(phoneNumber),
        message: `Development mode: Use OTP ${DEV_OTP_CODES.join(' or ')}`,
        devMode: true
      }
    }
    
    // Handle specific error cases
    const errorMessage = ERROR_MESSAGES[error.code] || error.message || 'Failed to send OTP'
    return {
      success: false,
      error: errorMessage
    }
  }
}

// Verify OTP code
export async function verifyOTP(confirmationResult, otpCode) {
  try {
    console.log('Verifying OTP:', otpCode)
    
    const result = await confirmationResult.confirm(otpCode)
    const user = result.user
    
    console.log('OTP verified successfully for user:', user.uid)
    
    return {
      success: true,
      user: {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName
      },
      message: 'OTP verified successfully'
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    
    // Handle specific error cases
    const errorMessages = {
      'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
      'auth/code-expired': 'OTP code has expired. Please request a new one.'
    }
    
    const errorMessage = errorMessages[error.code] || error.message || 'Failed to verify OTP'
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

// Sign out user
export async function signOut() {
  try {
    await firebaseSignOut(auth)
    console.log('User signed out successfully')
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return {
      success: false,
      error: error.message || 'Failed to sign out'
    }
  }
}

// Listen to auth state changes
export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback)
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser
}

// Clear reCAPTCHA verifier
export function clearRecaptcha() {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear()
    recaptchaVerifier = null
  }
}

// Default export object with all functions
export default {
  sendOTP,
  verifyOTP,
  signOut,
  onAuthStateChanged,
  getCurrentUser,
  clearRecaptcha,
  initializeRecaptcha
}