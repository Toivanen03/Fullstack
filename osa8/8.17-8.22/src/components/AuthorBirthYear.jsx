import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const AuthorBirthYear = ({ authors, show, setError, setPage }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, { data: { editAuthor } }) => {
      const { allAuthors } = cache.readQuery({ query: ALL_AUTHORS })
        const updatedAuthors = allAuthors.map((author) =>
        author.name === editAuthor.name ? { ...author, born: editAuthor.born } : author
      )
        cache.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: updatedAuthors },
      })
    },
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name) {
      setError('Select author!')
      return
    }
    try {
      await editAuthor({ variables: { name, setBornTo: parseInt(born) } })
      setName('')
      setBorn('')
      setPage('authors')
    } catch (error) {
      setError(error)
    }
  }

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  if (!show) return null

  return (
    <div>
      <h2>Set Author Birth Year</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Author:
          <Select
            options={authorOptions}
            onChange={(selectedOption) => setName(selectedOption.value)}
            value={authorOptions.find((option) => option.value === name)}
          />
        </div>
        <div>
          Born Year:
          <input value={born} onChange={(e) => setBorn(e.target.value)} />
        </div>
        <button type="submit">Set Birth Year</button>
      </form>
    </div>
  )
}

export default AuthorBirthYear
