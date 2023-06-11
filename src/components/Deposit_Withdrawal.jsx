import React from 'react'
import { Avatar } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import moment from 'moment';


export const Deposit_Withdrawal = ({ history }) => {
    const { amount, name, time, status, type } = history

    return (
        <div className='border-b-2 border-gray'>

            <div className='flex  items-center p-4 py-2'>
                <div className='flex gap-3 items-center '>

                    <div>
                        <h3 className='capitalize'>{type} </h3>
                        <div className='flex items-center'>
                            {type === "deposit" ? <ArrowUpOutlined className='text-green-800 mr-3' /> : <ArrowDownOutlined className='text-red-800 mr-3' />}<span >${name} </span><span className={type === "deposit" ? 'text-green-800 ml-1' : 'text-red-800 ml-1'}>${amount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className='ml-auto text-sm'>
                    <span>{moment(time.toDate()).fromNow()}</span>
                    <p className={status ? 'text-green-800' : 'text-red-800'}>{!status ? "Pending" : "Approved"}</p>
                </div>
            </div>
        </div>
    )
}
