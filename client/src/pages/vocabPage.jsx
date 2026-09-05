import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../../server/src/config/createClient'

const VocabPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vocabList, setVocabList] = useState([])
    const [formData, setFormData] = useState({
        word: '',
        translation: '',
        example: ''
    })

    useEffect(() => {
        fetchVocab()
    }, [id])

    async function fetchVocab() {
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

    function fetchChangeVocab(e) {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }))
    }

    async function createNewVocab(e) {
        e.preventDefault()

        if (!formData.word.trim() || !formData.translation.trim()) return

        const { error } = await supabase
            .from('vocabularies')
            .insert([{ ...formData, set_id: id }])

        if (error) {
            console.error('Error inserting data:', error)
        } else {
            setFormData({ word: '', translation: '', example: '' })
            fetchVocab()
        }
    }

    return (
        <div className='min-h-screen bg-[#EBF5FF] flex flex-col items-center p-6 font-sans text-gray-700'>
            <div className='w-full max-w-3xl bg-white rounded-3xl p-8 shadow-md text-center my-auto'>
                
                <div className='flex items-center justify-between mb-6'>
                    <button 
                        onClick={() => navigate('/')}
                        className='bg-gray-100 text-gray-600 font-medium px-4 py-1.5 rounded-full text-xs hover:bg-gray-200 transition-colors'
                    >
                        ← Back
                    </button>

                    <div className='flex items-center gap-2'>
                        <h1 className='text-2xl font-bold text-[#C47B2B]'>Vocab List</h1>
                    </div>

                    <button 
                        onClick={() => navigate(`/write-meow/${id}`)}
                        className='bg-[#FDE3A7] text-[#C47B2B] font-semibold px-4 py-1.5 rounded-full text-xs hover:bg-[#fcd788] transition-colors shadow-sm'
                    >
                        ทำแบบฝึกหัด
                    </button>
                </div>

                <form onSubmit={createNewVocab} className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 bg-[#FDF8EE] p-4 rounded-2xl border border-[#FDE3A7] text-left'>
                    <div>
                        <input 
                            type='text' 
                            placeholder='Vocab (คำศัพท์)' 
                            name='word' 
                            onChange={fetchChangeVocab} 
                            value={formData.word} 
                            className='w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-amber-400 bg-white'
                        />
                    </div>
                    <div>
                        <input 
                            type='text' 
                            placeholder='Translation (คำแปล)' 
                            name='translation' 
                            onChange={fetchChangeVocab} 
                            value={formData.translation} 
                            className='w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-amber-400 bg-white'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='text' 
                            placeholder='Example (ตัวอย่าง)' 
                            name='example' 
                            onChange={fetchChangeVocab} 
                            value={formData.example} 
                            className='w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-amber-400 bg-white'
                        />
                        <button 
                            type='submit'
                            className='bg-[#FDE3A7] text-[#C47B2B] font-semibold px-4 py-2 text-sm rounded-xl hover:bg-[#fcd788] transition-colors shadow-sm whitespace-nowrap'
                        >
                            + Add
                        </button>
                    </div>
                </form>

                <div className='overflow-hidden rounded-2xl border border-gray-200 shadow-sm'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-[#FDE3A7]/40 text-[#C47B2B] font-semibold text-sm'>
                            <tr>
                                <th className='py-3 px-5'>Word</th>
                                <th className='py-3 px-5'>Translation</th>
                                <th className='py-3 px-5'>Example</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 text-sm'>
                            {vocabList.map((vocab) => (
                                <tr key={vocab.id} className='hover:bg-amber-50/50 transition-colors'>
                                    <td className='py-3.5 px-5 font-medium text-gray-800'>{vocab.word}</td>
                                    <td className='py-3.5 px-5 text-gray-600'>{vocab.translation}</td>
                                    <td className='py-3.5 px-5 text-gray-400 italic'>{vocab.example || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VocabPage