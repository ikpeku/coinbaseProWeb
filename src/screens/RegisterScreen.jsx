
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Inputelement } from '../components/Inputelement'
import { Link } from 'react-router-dom'
import { DatePicker, Button, Alert } from 'antd'
import dayjs from 'dayjs';
import { useRegister } from '../hooks/useRegister'
import { Timestamp } from 'firebase/firestore'


export const RegisterScreen = () => {
    const { CreateWithEmail, error, isLoading } = useRegister()
    const [DOB, setDOB] = useState('2015/01/01')
    const dateFormat = 'YYYY/MM/DD';
    const onChange = (date, dateString) => {
        // console.log(dateString);
        setDOB(dateString)

        // console.log(date)
    };

    const { handleSubmit, control, watch } = useForm({
        defaultValues: {
            First_Name: "",
            Last_Name: "",
            Email: "",
            Password: "",
            Confirm_Password: ""
        }
    })

    // console.log(serverTimestamp(DOB))
    // console.log(DOB)
    // console.log("NEW DATE", new Date(DOB))
    // console.log(Timestamp.fromDate(new Date(DOB)))
    const password = watch("Password")

    const submitPress = async (data) => {




        const email = data.Email
        const password = data.Password
        const fullName = `${data.First_Name} ${data.Last_Name}`
        const date = Timestamp.fromDate(new Date(DOB))

        await CreateWithEmail(email, password, fullName, date)



    }



    return (
        <section className="bg-white">

            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <aside
                    className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6"
                >
                    <img
                        alt="Pattern"
                        src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </aside>

                <main
                    aria-label="Main"
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
                >
                    <div className="max-w-xl lg:max-w-3xl">

                        <h1
                            className="mt-6 text-2xl font-bold text-blue-700 sm:text-3xl md:text-4xl"
                        >
                            CoinbasePro 🪙
                        </h1>



                        <form onSubmit={handleSubmit(submitPress)} className="mt-8 grid grid-cols-6 gap-6 ">
                            <div className="col-span-6 sm:col-span-3">
                                <Inputelement label="First Name" name="First_Name" control={control} rules={{ required: true }} />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <Inputelement label="Last Name" name="Last_Name" control={control} rules={{ required: true }} />

                            </div>

                            <div className="col-span-6">
                                <Inputelement label="Email" name="Email" control={control} rules={{
                                    required: "This field is required.", pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'Enter a valid e-mail address',
                                    }
                                }} />

                            </div>
                            <div className="col-span-6">
                                <p>Date of Birth</p>

                                <DatePicker onChange={onChange} className='w-full py-3' defaultValue={dayjs('2015/01/01', dateFormat)} format={dateFormat} />
                            </div>

                            <div className="col-span-6 sm:col-span-3 relative ">
                                <Inputelement icon={true} label="Password" name="Password" control={control} rules={{ required: true, minLength: { value: 7, message: "password should be atleast 7 characters." } }} />

                            </div>

                            <div className="col-span-6 sm:col-span-3 relative">
                                <Inputelement icon={true} label="Confirm Password" name="Confirm_Password" control={control} rules={{ required: true, validate: value => value === password || "password do not match" }} />

                            </div>


                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                {/* <button
                                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                >
                                    Create an account
                                </button> */}
                                {!isLoading ?
                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                                    >
                                        Create account
                                    </button>
                                    :
                                    <Button size='middle' className=" rounded-lg text-sm font-bold" loading>
                                        Loading
                                    </Button>}

                                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                    Already have an account?
                                    <Link to="/login" className="text-gray-700 underline">Log in</Link>.
                                </p>

                            </div>

                            <div className="col-span-6">
                                {error &&
                                    <Alert
                                        message="Error"
                                        description={error}
                                        type="error"
                                        showIcon
                                        closable

                                    />}

                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    )
}
