import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import catCorrect from '../assets/correct.PNG'

const Summary = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { score = 0, total = 0, setId, skippedVocabList = [] } = location.state || {}

    const handleRetrySkipped = () => {
        navigate(`/write-meow/${setId}`, {
            state: { retryVocabList: skippedVocabList }
        })
    }

    return (
        <div className='min-h-screen bg-[#EBF5FF] flex items-center justify-center p-4 font-sans'>
            <div className='relative bg-white rounded-3xl p-8 shadow-md w-full max-w-sm pt-14 text-center'>
                
                <div className='absolute -top-40 left-1/2 -translate-x-1/2 w-80 h-80'>
                                    <img 
                                        src={catCorrect} 
                                        alt='Cat' 
                                        className='w-full h-full object-contain'
                                    />
                                </div>
                

                <h1 className='text-3xl font-bold text-gray-800 mb-1'>Quiz Summary</h1>
                
                <div className='mb-6'>
                    <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>total score</p>
                    <p className='text-2xl font-extrabold text-[#C47B2B] mt-0.5'>
                        {score} / {total}
                    </p>
                </div>

                <div className='bg-[#FDF8EE] border border-[#FDE3A7] rounded-2xl p-5 mb-6 text-center'>
                    <p className='text-sm font-semibold text-[#C47B2B] mb-1'>
                        {score === total ? '🎉 เก่งมาก! ถูกต้องทั้งหมด' : '🐾 ทำได้ดีมาก พยายามต่อไปนะ!'}
                    </p>
                    <p className='text-xs text-gray-500'>
                        คะแนนของคุณคือ {Math.round((score / (total || 1)) * 100)}%
                    </p>
                </div>

                <div className='flex flex-col gap-2.5'>
                    {skippedVocabList.length > 0 && (
                        <button 
                            onClick={handleRetrySkipped}
                            className='w-full bg-[#FDE3A7] text-[#C47B2B] font-semibold py-2.5 rounded-full hover:bg-[#fcd788] transition-colors shadow-sm text-sm'
                        >
                            ทำเฉพาะข้อที่ข้าม/ทำผิด ({skippedVocabList.length} ข้อ)
                        </button>
                    )}
                    <button 
                        onClick={() => navigate(`/write-meow/${setId}`, { state: null })}
                        className='w-full bg-gray-100 text-gray-600 font-semibold py-2.5 rounded-full hover:bg-gray-200 transition-colors text-sm'
                    >
                        Restart (ทำใหม่ทั้งหมด)
                    </button>
                    <button 
                        onClick={() => navigate(`/vocabPage/${setId}`)}
                        className='w-full text-gray-400 hover:text-gray-600 font-semibold py-1.5 transition-colors text-xs'
                    >
                        Back to Vocab List
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Summary