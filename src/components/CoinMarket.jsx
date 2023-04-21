import React from 'react'

export const CoinMarket = () => {
    return (
        <>
            <h2 className='text-center font-extrabold text-2xl py-3 text-blue-950'>Market Trend</h2>

            <div className=" h-full">
                <div className="w-full h-full" style={{ overflow: "hidden" }}>
                    <iframe src="https://www.widgets.investing.com/top-cryptocurrencies?theme=darkTheme&amp;roundedCorners=true" width={"100%"} height={"100%"} style={{ marginTop: -50 }}></iframe>
                </div>
            </div>
        </>
    )
}
