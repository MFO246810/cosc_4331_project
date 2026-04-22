import LiveStreamPlayer from "../components/livestream_card"

export default function Stream_Page(){
    return(
        <>
            <div className="min-h-screen bg-black text-white font-sans uppercase overflow-hidden flex select-none">

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col pt-4 pr-4 pb-4">

                    {/* Video Feed Wrapper */}
                    <div className="flex-grow flex flex-col items-center justify-start mt-8">
                    <div className="w-full max-w-5xl pl-4">
                        
                        <LiveStreamPlayer streamUrl="http://10.66.66.2:8080/hls/test.m3u8" />
                        
                        {/* Lower Data Readout */}
                        <div className="mt-4 flex gap-4">
                            <div className="h-6 w-32 bg-[#9999cc] rounded-full flex items-center justify-center text-black font-bold text-xs">
                                FPS: 30
                            </div>
                            <div className="h-6 w-32 bg-[#ffcc99] rounded-full flex items-center justify-center text-black font-bold text-xs">
                                RES: 480P
                            </div>
                            <div className="h-6 w-32 bg-[#cc99cc] rounded-full flex items-center justify-center text-black font-bold text-xs">
                                LIVE INT
                            </div>
                        </div>

                    </div>
                    </div>
                </div>

            </div>
        </>
    )
    
}