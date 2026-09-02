import React, { useState, useEffect } from 'react'
import { supabase } from '../../../server/src/config/createClient'
import '../App.css'
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
        <div>
            <h1>VoCat</h1>
            <form onSubmit={createSet}>
                <input
                    type='text'
                    placeholder='title'
                    onChange={fetchChange}
                    name='title'
                    value={sets.title}
                />
                <input
                    type='text'
                    placeholder='description'
                    onChange={fetchChange}
                    name='description'
                    value={sets.description}
                />
                <button type='submit'>Add Vocab Set</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>title</th>
                        <th>description</th>
                        <th>Vocab</th>
                    </tr>
                </thead>
                <tbody>
                    {vocabSets.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td><button onClick={() => navigate(`/vocabPage/${item.id}`)}>
                                View Vocab
                            </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Home