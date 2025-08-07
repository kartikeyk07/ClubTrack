// 'use client'

// import { useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { Navbar } from '@/components/Navbar'

// export default function HomePage() {
//   const { user, loading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         // Redirect based on role
//         if (user.role === 'admin') {
//           router.push('/dashboard')
//         } else {
//           router.push('/events')
//         }
//       } else {
//         router.push('/login')
//       }
//     }
//   }, [user, loading, router])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to BidOut</h1>
//           <p className="text-muted-foreground">Redirecting you to the appropriate dashboard...</p>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admin') {
          router.push('/dashboard')
        } else {
          router.push('/events')
        }
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to ClubTrack</h1>
          <p className="text-muted-foreground">Redirecting you to the appropriate dashboard...</p>
        </div>
      </div>
    </div>
  )
}
