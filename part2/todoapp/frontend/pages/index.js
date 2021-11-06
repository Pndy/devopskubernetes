import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import TodoPanel from '../components/TodoPanel'
import axios from 'axios'

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>TodoApp</title>
      </Head>

      <main>
        <h2>Todo App</h2>
        <img
          src="/api/image"
          width="300"
          height="300"
        />
        
        <TodoPanel />
      </main>
    </div>
  )
}
