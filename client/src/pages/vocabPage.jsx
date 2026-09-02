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
        <div>
            <h1>Vocab</h1>
            <button onClick={() => navigate('/')}>Back</button>
            <button onClick={() => navigate(`/write-meow/${id}`)}>
                ทำแบบฝึกหัด
            </button>
            <form onSubmit={createNewVocab}>
                <input type='text' placeholder='vocab' name='word' onChange={fetchChangeVocab} value={formData.word} />
                <input type='text' placeholder='translation' name='translation' onChange={fetchChangeVocab} value={formData.translation} />
                <input type='text' placeholder='example' name='example' onChange={fetchChangeVocab} value={formData.example} />
                <button type='submit'>+ add</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Translation</th>
                        <th>Example</th>
                    </tr>
                </thead>
                <tbody>
                    {vocabList.map((vocab) => (
                        <tr key={vocab.id}>
                            <td>{vocab.word}</td>
                            <td>{vocab.translation}</td>
                            <td>{vocab.example}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default VocabPage