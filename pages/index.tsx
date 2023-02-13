import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import { isNullOrEmpty } from '@/lib/helper';
import { DOMAIN } from '@/lib/global';
import Loader from '@/components/Loader/loader';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl]             = useState("");
  const [shortUrl, setShortUrl]   = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied]   = useState(false);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      setIsCopied(false);
      return;
    }
  
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      return;
    }
    catch (error) {
      console.warn('Copy failed', error);
      setIsCopied(false);
      return;
    }
  }

  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setUrl(e.currentTarget.value);
  };

  const getShortUrl = async (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch('/api/short_url', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({url: url.toString()})
    })
    .then((response) => response.json())
    .then((response) => {
      setIsLoading(false);
      setShortUrl(response.short_url);
    });
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
        <div className={styles.container}>
          <p className={styles.heading}>Shorten Your URL</p>
          <form method="post" onSubmit={getShortUrl}>
            <input
              type="url"
              id="long_url"
              name="long_url"
              required
              placeholder="Your URL.."
              onChange={onChange}
            />
            <button type="submit">Submit</button>
          </form>
          <div className={styles.shortUrlContainer}>
            {!isNullOrEmpty(shortUrl) ? (
              <>
                <p>Your Teeny Weeny Url is</p>
                <div className={styles.innerContainer}>
                  <a className={styles.shortUrl} href={DOMAIN + shortUrl}>
                    {DOMAIN + shortUrl}
                  </a>
                  <div
                    className={styles.copyIconContainer}
                    onClick={() => copy(DOMAIN + shortUrl)}
                    onMouseLeave={() => setIsCopied(false)}
                  >
                    <Image
                      alt="copy"
                      height={30}
                      width={30}
                      src="/copy.png"
                      className={styles.copyIcon}
                      priority
                    />
                    <span className={styles.tooltipText}>
                      {isCopied ? "Copied" : "Copy on clipboard"}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          {isLoading ? <Loader /> : null}
        </div>
      </main>
    </>
  );
}
