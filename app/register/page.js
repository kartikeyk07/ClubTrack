// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useAuth } from '@/context/AuthContext'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Eye, EyeOff, UserPlus } from 'lucide-react'
// import toast from 'react-hot-toast'
// // import {
// //   createUserWithEmailAndPassword,
// //   updateProfile,
// //   onAuthStateChanged,
// //   signInWithEmailAndPassword,
// //   signOut
// // } from 'firebase/auth'
// // import { auth } from '@/firebase/config'


// export default function RegisterPage() {
//   const { register } = useAuth()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: ''
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//     setError('')
//   }

//   const handleRoleChange = (value) => {
//     setFormData({
//       ...formData,
//       role: value
//     })
//     setError('')
//   }

//   const validateForm = () => {
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
//       return 'Please fill in all fields'
//     }

//     if (formData.password !== formData.confirmPassword) {
//       return 'Passwords do not match'
//     }

//     if (formData.password.length < 6) {
//       return 'Password must be at least 6 characters long'
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       return 'Please enter a valid email address'
//     }

//     return null
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError('')

//     const validationError = validateForm()
//     if (validationError) {
//       setError(validationError)
//       setIsLoading(false)
//       return
//     }

//     const result = await register(formData.name, formData.email, formData.password, formData.role)
    
//     if (result.success) {
//       toast.success('Registration successful!')
//     } else {
//       setError(result.error)
//       toast.error(result.error)
//     }
    
//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-md space-y-6">
//         {/* Logo and Header */}
//         <div className="text-center">
//           <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
//             <span className="text-primary-foreground font-bold text-xl">R</span>
//           </div>
//           <h1 className="text-3xl font-bold text-foreground">Join ClubTrack</h1>
//           <p className="text-muted-foreground mt-2">Create your account to get started</p>
//         </div>

//         {/* Register Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Create Account</CardTitle>
//             <CardDescription>
//               Fill in your details to create a new account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <Select value={formData.role} onValueChange={handleRoleChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select your role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="admin">Admin</SelectItem>
//                     <SelectItem value="user">User</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </Button>
//                 </div>
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
//                 ) : (
//                   <>
//                     <UserPlus size={16} className="mr-2" />
//                     Create Account
//                   </>
//                 )}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-muted-foreground">
//                 Already have an account?{' '}
//                 <Link href="/login" className="text-primary hover:underline font-medium">
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
    // Removed role from initial state
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  // Removed handleRoleChange function

  const validateForm = () => {
    // Removed role validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    // Pass a default role or let the register function handle it
    const result = await register(formData.name, formData.email, formData.password, 'user')
    
    if (result.success) {
      toast.success('Registration successful!')
    } else {
      setError(result.error)
      toast.error(result.error)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-xl">R</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join ClubTrack</h1>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Removed role selection section */}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
