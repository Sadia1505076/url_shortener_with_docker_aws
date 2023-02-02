import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useRef, Suspense, HtmlHTMLAttributes, FormEventHandler } from 'react';
import { Form, FormState } from 'lib/types';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [form, setForm] = useState<FormState>({ state: Form.Initial });

  const [url, setUrl] = useState("");
  
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setUrl(e.currentTarget.value);
  };

  const leaveEntry = async (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    console.log("url is:", url);
    const res = await fetch('/api/short_url', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({url: url.toString()})
    });
    console.log("inside leave entry, after the api call", res);
  };

  return (
    <>
      <Head>
        <title>Teeny-Weeny</title>
        <meta name="description" content="URL shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>Shorten Your URL</p>
          <form method="post" onSubmit={leaveEntry}>
            <input type="url" id="long_url" name="long_url" required placeholder="Your URL.." onChange={onChange}/>
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
    </>
  )
}
