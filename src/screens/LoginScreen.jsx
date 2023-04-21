import React, { useState } from 'react'
import { Inputelement } from '../components/Inputelement'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { Button } from 'antd';

export const LoginScreen = () => {
    const { SignWithEmail, error, isLoading } = useLogin()

    const { handleSubmit, control } = useForm({
        defaultValues: {
            Email: "",
            Password: ""
        }
    })

    const submitPress = async (data) => {

        const email = data?.Email
        const password = data?.Password
        await SignWithEmail(email, password)

    }
    return (
        <section className="relative flex flex-wrap lg:h-screen lg:items-center">
            <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

                    {/* <p className="mt-4 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla
                        eaque error neque ipsa culpa autem, at itaque nostrum!
                    </p> */}
                </div>

                <form onSubmit={handleSubmit(submitPress)} className="mx-auto mt-8 mb-0 max-w-md space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>

                        <div className="relative">
                            <Inputelement name="Email" label="Email" control={control} rules={{
                                required: "This field is required.", pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Enter a valid e-mail address',
                                }
                            }} />

                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>

                        <div className="relative">
                            <Inputelement icon={true} label="Password" name="Password" control={control} rules={{ required: true }} />

                        </div>
                    </div>
                    {error && <p className='text-red-700'>{error}</p>}

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            No account?
                            <Link className="underline" to="/register">Sign up</Link>
                        </p>
                        {!isLoading ?
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                            >
                                Sign in
                            </button>
                            :
                            <Button size='middle' className=" rounded-lg text-sm font-bold" loading>
                                Loading
                            </Button>}

                    </div>
                </form>
            </div>

            <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
                <img
                    alt="Welcome"
                    src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </section>

    )
}
