import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../server/src/config/createClient'
import catNormal from '../assets/normal.PNG'
import catCorrect from '../assets/correct.PNG'
import catWrong from '../assets/wrong.PNG'

const WriteMeow = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    const retryVocabList = location.state?.retryVocabList

    const [vocabList, setVocabList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState('')
    const [result, setResult] = useState('')
    const [mode, setMode] = useState('en')
    const [score, setScore] = useState(0)
    const [skippedVocab, setSkippedVocab] = useState([])
    const [catImage, setCatImage] = useState(catNormal)

    useEffect(() => {
        if (retryVocabList && retryVocabList.length > 0) {
            setVocabList(retryVocabList)
            setMode(Math.random() < 0.5 ? 'en' : 'th')
            setCurrentIndex(0)
            setScore(0)
            setSkippedVocab([])
            setCatImage(catNormal)
        } else if (id) {
            fetchVocab()
        }
    }, [id, retryVocabList])

    async function fetchVocab() {
        if (!id) return

        const { data, error } = await supabase
            .from('vocabularies')
            .select('*')
            .eq('set_id', id)

        if (error) {
            console.error('Error fetching data:', error)
        } else {
            setVocabList(data)
            setMode(Math.random() < 0.5 ? 'en' : 'th')
            setCurrentIndex(0)
            setScore(0)
            setSkippedVocab([])
            setCatImage(catNormal)
        }
    }

    function checkAnswer(e) {
        e.preventDefault()

        if (!answers.trim()) {
            setResult('กรุณากรอกคำตอบก่อนกดส่ง!')
            return
        }

        const currentVocab = vocabList[currentIndex]
        const cleanUserAnswer = answers.trim().toLowerCase()

        if (mode === 'en') {
            const cleanCorrectAnswer = currentVocab.word.trim().toLowerCase()
            if (cleanUserAnswer === cleanCorrectAnswer) {
                setResult('ถูกต้อง!')
                setCatImage(catCorrect)
                setScore(prev => prev + 1)
            } else {
                setResult(`ผิด! คำตอบที่ถูกต้องคือ: ${currentVocab.word}`)
                setCatImage(catWrong)
                setSkippedVocab(prev => [...prev, currentVocab])
            }
        } else {
            const cleanCorrectAnswer = currentVocab.translation.trim().toLowerCase()
            if (cleanUserAnswer === cleanCorrectAnswer) {
                setResult('ถูกต้อง!')
                setCatImage(catCorrect)
                setScore(prev => prev + 1)
            } else {
                setResult(`ผิด! คำตอบที่ถูกต้องคือ: ${currentVocab.translation}`)
                setCatImage(catWrong)
                setSkippedVocab(prev => [...prev, currentVocab])
            }
        }
    }

    function handleSkip() {
        const currentVocab = vocabList[currentIndex]
        const correctAnswer = mode === 'en' ? currentVocab.word : currentVocab.translation
        setResult(`ข้ามข้อนี้! คำตอบที่ถูกต้องคือ: ${correctAnswer}`)
        setCatImage(catWrong)
        setSkippedVocab(prev => [...prev, currentVocab])
    }

    function nextQuestion() {
        if (currentIndex + 1 >= vocabList.length) {
            navigate('/summary', { 
                state: { 
                    score: score, 
                    total: vocabList.length,
                    setId: id,
                    skippedVocabList: skippedVocab
                } 
            })
            return
        }

        setAnswers('')
        setResult('')
        setCatImage(catNormal)
        setMode(Math.random() < 0.5 ? 'en' : 'th')
        setCurrentIndex(prev => prev + 1)
    }

    if (vocabList.length === 0) {
        return (
            <div className='min-h-screen bg-[#EBF5FF] flex items-center justify-center font-sans text-gray-600'>
                กำลังโหลดคำศัพท์ หรือไม่มีคำศัพท์ในเซตนี้...
            </div>
        )
    }

    const currentVocab = vocabList[currentIndex]

    return (
        <div className='min-h-screen bg-[#EBF5FF] flex items-center justify-center p-4 font-sans'>
            <div className='relative bg-white rounded-3xl p-8 shadow-md w-full max-w-sm pt-20 text-center my-auto'>
                
                <div className='absolute -top-28 left-1/2 -translate-x-1/2 w-72 h-72 pointer-events-none'>
                    <img 
                        src={catImage} 
                        alt='Cat' 
                        className='w-full h-full object-contain'
                    />
                </div>

                {/* <div className='mb-6'>
                    <button 
                        type='button' 
                        className='bg-[#FDE3A7] text-[#C47B2B] text-sm font-medium px-6 py-1.5 rounded-full shadow-sm hover:bg-[#fcd788] transition-colors'
                    >
                        Listen
                    </button>
                </div> */}

                <form onSubmit={checkAnswer} className='flex flex-col gap-4 text-left'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-700 mb-1 ml-1'>
                            English
                        </label>
                        {mode === 'en' ? (
                            <input 
                                type='text' 
                                placeholder='English' 
                                value={answers}
                                onChange={(e) => setAnswers(e.target.value)}
                                disabled={!!result && result !== 'กรุณากรอกคำตอบก่อนกดส่ง!'}
                                className='w-full px-4 py-2 text-sm border border-gray-400 rounded-2xl outline-none focus:border-amber-400 placeholder-gray-300 disabled:bg-gray-100'
                            />
                        ) : (
                            <input 
                                type='text' 
                                placeholder='English' 
                                value={currentVocab.word}
                                readOnly
                                className='w-full px-4 py-2 text-sm border border-gray-400 rounded-2xl bg-gray-50 outline-none text-gray-600 placeholder-gray-300'
                            />
                        )}
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-gray-700 mb-1 ml-1'>
                            Thai
                        </label>
                        {mode === 'th' ? (
                            <input 
                                type='text' 
                                placeholder='Thai' 
                                value={answers}
                                onChange={(e) => setAnswers(e.target.value)}
                                disabled={!!result && result !== 'กรุณากรอกคำตอบก่อนกดส่ง!'}
                                className='w-full px-4 py-2 text-sm border border-gray-400 rounded-2xl outline-none focus:border-amber-400 placeholder-gray-300 disabled:bg-gray-100'
                            />
                        ) : (
                            <input 
                                type='text' 
                                placeholder='Thai' 
                                value={currentVocab.translation}
                                readOnly
                                className='w-full px-4 py-2 text-sm border border-gray-400 rounded-2xl bg-gray-50 outline-none text-gray-600 placeholder-gray-300'
                            />
                        )}
                    </div>

                    <div className='text-center text-xs font-semibold text-gray-600 mt-1'>
                        {currentIndex + 1}/{vocabList.length}
                    </div>

                    <div className='flex gap-2 mt-1'>
                        <button 
                            type='button'
                            onClick={handleSkip}
                            disabled={!!result && result !== 'กรุณากรอกคำตอบก่อนกดส่ง!'}
                            className='flex-1 bg-gray-100 text-gray-500 font-semibold py-2.5 rounded-full hover:bg-gray-200 transition-colors text-sm disabled:opacity-50'
                        >
                            ข้าม
                        </button>
                        <button 
                            type='submit'
                            disabled={!!result && result !== 'กรุณากรอกคำตอบก่อนกดส่ง!'}
                            className='flex-1 bg-[#FDE3A7] text-[#C47B2B] font-semibold py-2.5 rounded-full hover:bg-[#fcd788] transition-colors shadow-sm text-sm disabled:opacity-50'
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {result && (
                    <div className='mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200'>
                        <p className={`text-xs font-semibold mb-2 ${
                            result === 'ถูกต้อง!' 
                                ? 'text-green-600' 
                                : result.startsWith('ข้าม') 
                                    ? 'text-amber-600' 
                                    : 'text-red-500'
                        }`}>
                            {result}
                        </p>
                        {result !== 'กรุณากรอกคำตอบก่อนกดส่ง!' && (
                            <button 
                                onClick={nextQuestion}
                                className='text-xs bg-amber-400 text-white px-4 py-1.5 rounded-full font-medium hover:bg-amber-500 transition-colors shadow-sm'
                            >
                                {currentIndex + 1 >= vocabList.length ? 'ดูสรุปคะแนน' : 'ข้อถัดไป'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WriteMeow