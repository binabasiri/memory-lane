import { useEffect } from 'react'
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
import { signupFormSchema, type SignupFormData } from '@/schemas'

type SignupResponse = {
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

export default function SignupPage() {
  const navigate = useNavigate()
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
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

  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormData) => {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      return response.json() as Promise<SignupResponse>
    },
    onSuccess: (data) => {
      localStorage.setItem('memory_lane_user', JSON.stringify(data))
      navigate(`/memory-lane/${data.memoryLane?.id}/edit`)
    },
    onError: (error) => {
      console.error('Signup error:', error)
    },
  })

  function onSubmit(values: SignupFormData) {
    signupMutation.mutate(values)
  }

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? 'Loading...' : 'Sign Up'}
              </Button>
              {signupMutation.isError && (
                <p className='text-sm text-red-500 mt-2'>
                  {signupMutation.error.message}
                </p>
              )}
            </form>
          </Form>
          <div className='text-center mt-4 text-sm text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
