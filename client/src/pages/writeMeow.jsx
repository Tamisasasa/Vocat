import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../../server/src/config/createClient'

const WriteMeow = () => {
    const { id } = useParams()
    const [vocabList, setVocabList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState('')
    const [result, setResult] = useState('')

    useEffect(() => {
        if (id) {
            fetchVocab()
        }
    }, [id])

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
        }
    }

    function checkAnswer(e) {
        e.preventDefault()
        const currentVocab = vocabList[currentIndex]

        const cleanUserAnswer = answers.trim().toLowerCase()
        const cleanCorrectAnswer = currentVocab.word.trim().toLowerCase()

        if (cleanUserAnswer === cleanCorrectAnswer) {
            setResult('ถูกต้อง!')
        } else {
            setResult(`ผิด! คำตอบที่ถูกต้องคือ: ${currentVocab.word}`)
        }
    }

    function nextQuestion() {
        setAnswers('')
        setResult('')
        setCurrentIndex(prev => (prev + 1) % vocabList.length)
    }

    if (vocabList.length === 0) {
        return <div>กำลังโหลดคำศัพท์ หรือไม่มีคำศัพท์ในเซตนี้...</div>
    }

    const currentVocab = vocabList[currentIndex]

    return (
        <div>
            <h1>แบบฝึกหัดทบทวนศัพท์</h1>
            
            <div>
                <h3>คำแปล: {currentVocab.translation}</h3>
                {currentVocab.example && <p>ตัวอย่าง: {currentVocab.example}</p>}
            </div>

            <form onSubmit={checkAnswer}>
                <input 
                    type='text' 
                    placeholder='พิมพ์คำศัพท์ภาษาอังกฤษ...' 
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                />
                <button type='submit'>ตรวจคำตอบ</button>
            </form>

            {result && (
                <div>
                    <p>{result}</p>
                    <button onClick={nextQuestion}>ข้อถัดไป</button>
                </div>
            )}
        </div>
    )
}

export default WriteMeow