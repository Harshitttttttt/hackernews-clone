import { useState } from 'react'
import styles from '../styles/submitBody.module.css'
import { useNavigate } from '@tanstack/react-router'

export default function SubmitBody() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const postData = {
        title: title,
        url: url,
        content: text,
      }
      console.log('Post Data', postData)
      const reqUrl = '/api/posts/create'
      const response = await fetch(reqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include', // Ensure cookies are sent with the request
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error creating post:', errorText)
        throw new Error(`Failed to create post: ${errorText}`)
      }

      const json = await response.json()
      console.log(json)

      navigate({ to: '/' })
    } catch (error) {
      console.error('Error during post submission:', error)
      // Optionally, you can set an error state to display to the user
      alert('Failed to submit post. Please try again later.')
    }
  }

  return (
    <div className={styles.main}>
      <form action="submit post" onSubmit={handleSubmit}>
        <span className={styles.title_span}>title: </span>
        <input
          type="text"
          className={styles.title_input}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <span className={styles.url_span}>url: </span>
        <input
          type="text"
          className={styles.url_input}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
          }}
        />
        <span className={styles.text_span}>text: </span>
        <textarea
          rows={4}
          cols={49}
          className={styles.text_input}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
        <span className={styles.submit_span}></span>
        <button type="submit" className={styles.submit}>
          submit
        </button>
      </form>
      <p>
        Leave url blank to submit a question for discussion. If there is no url,
        text will appear at the top of the thread. If there is a url, text is
        optional.
      </p>
    </div>
  )
}
