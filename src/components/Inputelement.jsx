import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField';


export const Inputelement = ({ label, control, rules, name, icon = false, disable = false }) => {
    const [showPassword, setShowPassword] = useState(false);


    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => {
                return (
                    <>
                        <div className='relative' >
                            <TextField {...field} disabled={disable} type={icon ? showPassword ? "text" : "password" : "text"} label={label} variant="outlined" error={error ? true : false} className='w-full' />
                            {icon && <span
                                onClick={() => setShowPassword((current) => !current)}
                                className="absolute inset-y-0 right-0 grid place-content-center px-4  max-h-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </span>}
                        </div>

                        {error && <p className='text-red-700 flex justify-self-stretch text-sm font-light mt-1'>{error.message || "This field is required."}</p>}
                    </>
                )
            }

            }

        />
    )
}



