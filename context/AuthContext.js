

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile, // ✅ ADDED this
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase' // ✅ make sure this is correctly imported
import { getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context // ✅ Moved outside the if block
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // ✅ Get role from Firestore
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('User role not found in Firestore')
    }

    const userData = docSnap.data()

    const userInfo = {
      id: user.uid,
      email: user.email,
      role: userData.role,
      name: user.displayName || userData.name || 'User'
    }

    setUser(userInfo)
    localStorage.setItem('user', JSON.stringify(userInfo))

    router.push(userInfo.role === 'admin' ? '/dashboard' : '/events')
    return { success: true }

  } catch (error) {
    console.error('Login error:', error.message)
    return { success: false, error: error.message }
  }
}



const register = async (name, email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, { displayName: name })

    // ✅ Save role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role,
    })

    const newUser = {
      uid: user.uid,
      email: user.email,
      name,
      role,
    }

    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))

    router.push(role === 'admin' ? '/dashboard' : '/events')

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error.message)
    return { success: false, error: error.message }
  }
}


  const logout = async () => {
    await signOut(auth)
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  // ✅ Combined into single useEffect
  useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}

    const newUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || userData.name || '',
      role: userData.role || 'user'
    }

    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  } else {
    setUser(null)
    localStorage.removeItem('user')
  }
})


    return () => unsubscribe()
  }, [pathname])

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
