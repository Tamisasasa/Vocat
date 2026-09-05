import React, { useState, useEffect } from 'react'
import { supabase } from '../../../server/src/config/createClient'
import '../index.css'
import catIcon from '../assets/normal.PNG'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    const [vocabSets, setVocabSets] = useState([])
    const [sets, setSets] = useState({
        title: '',
        description: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        const { data, error } = await supabase
            .from('vocabulary_sets')
            .select('*')

        if (error) {
            console.error('Error fetching data:', error)
        } else {
            setVocabSets(data)
        }
    }

    function fetchChange(e) {
        setSets(prevFormData => {
            return {
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        })
    }

    async function createSet(e) {
        e.preventDefault()

        if (!sets.title.trim()) return

        const { error } = await supabase
            .from('vocabulary_sets')
            .insert([sets])

        if (error) {
            console.error('Error inserting data:', error)
        } else {
            setSets({ title: '', description: '' })
            fetchData()
        }
    }

    return (
        <div className='min-h-screen bg-[#EBF5FF] flex flex-col items-center justify-center p-6 font-sans text-gray-700'>
            <div className='relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-md text-center pt-20 my-auto'>
                <div className='absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96'>
                    <img 
                        src={catIcon} 
                        alt='Cat' 
                        className='w-full h-full object-contain'
                    />
                </div>

                <div className='flex items-center justify-center gap-3 mb-6'>
                   
                </div>

                <form onSubmit={createSet} className='flex flex-col sm:flex-row gap-3 mb-8 bg-[#FDF8EE] p-4 rounded-2xl border border-[#FDE3A7]'>
                    <input
                        type='text'
                        placeholder='Title (ชื่อชุดศัพท์)'
                        onChange={fetchChange}
                        name='title'
                        value={sets.title}
                        className='flex-1 px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-amber-400 bg-white'
                    />
                    <input
                        type='text'
                        placeholder='Description (คำอธิบาย)'
                        onChange={fetchChange}
                        name='description'
                        value={sets.description}
                        className='flex-1 px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-amber-400 bg-white'
                    />
                    <button 
                        type='submit'
                        className='bg-[#FDE3A7] text-[#C47B2B] font-semibold px-5 py-2 text-sm rounded-xl hover:bg-[#fcd788] transition-colors shadow-sm whitespace-nowrap'
                    >
                        Add Set
                    </button>
                </form>

                <div className='overflow-hidden rounded-2xl border border-gray-200 shadow-sm'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-[#FDE3A7]/40 text-[#C47B2B] font-semibold text-sm'>
                            <tr>
                                <th className='py-3 px-5'>Title</th>
                                <th className='py-3 px-5 text-center'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 text-sm'>
                            {vocabSets.map((item) => (
                                <tr key={item.id} className='hover:bg-amber-50/50 transition-colors'>
                                    <td className='py-3.5 px-5 font-medium text-gray-800'>{item.title}</td>
                                    <td className='py-3.5 px-5 text-center'>
                                        <button
                                            onClick={() => navigate(`/vocabPage/${item.id}`)}
                                            className='bg-[#FDE3A7] text-[#C47B2B] font-medium px-4 py-1.5 rounded-full text-xs hover:bg-[#fcd788] transition-colors shadow-sm'
                                        >
                                            View Vocab
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home