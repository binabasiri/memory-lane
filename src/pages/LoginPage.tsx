import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { loginFormSchema, type LoginFormData } from '@/schemas'
import { useEffect } from 'react'
type LoginResponse = {
  id: string
  name: string
  email: string
  memoryLane: {
    id: string
    title: string
    description: string | null
    userId: string
  } | null
  createdAt: string
  updatedAt: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
    },
  })
  useEffect(() => {
    const userData = localStorage.getItem('memory_lane_user')
    if (userData) {
      const user = JSON.parse(userData)
      navigate(`/memory-lane/${user.memoryLane?.id}/edit`)
    }
  }, [navigate])

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormData) => {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      return response.json() as Promise<LoginResponse>
    },
    onSuccess: (data) => {
      // Save user data to localStorage and navigate to memory lane edit page
      localStorage.setItem('memory_lane_user', JSON.stringify(data))
      navigate(`/memory-lane/${data.memoryLane?.id}/edit`)
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
  })

  function onSubmit(values: LoginFormData) {
    loginMutation.mutate(values)
  }

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full'
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Loading...' : 'Login'}
              </Button>
              {loginMutation.isError && (
                <p className='text-sm text-red-500 mt-2'>
                  {loginMutation.error.message}
                </p>
              )}
            </form>
          </Form>
          <div className='text-center mt-4 text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
