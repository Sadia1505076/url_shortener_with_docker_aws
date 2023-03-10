import Head                    from 'next/head'
import styles                  from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';
import Loader                  from '@/components/Loader/loader';
import Image                   from 'next/image';
import { stringOrNull }        from '@/lib/types';
import { useQRCode } from 'next-qrcode';

export default function Home() {
  const [longUrl,   setLongUrl]   = useState<stringOrNull>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied,  setIsCopied]  = useState<boolean>(false);
  const [errorText, setErrorText] = useState<stringOrNull>(null);
  const [shortUrl,  setShortUrl]  = useState<stringOrNull>(null);
  const { Canvas }                = useQRCode();

  const isNotEmpty = (str: stringOrNull): boolean => {
    if (str == undefined || str.length == 0) return false;
    return true;
  }

  const [encodedTicket, setEncodedTicket] = useState<stringOrNull>(null);
  const [shortUrlHost,  setShortUrlHost]  = useState<stringOrNull>(null);
  useEffect(() => {
    if (shortUrlHost == null || 
        (shortUrlHost != null && shortUrlHost != window.location.origin)
    ) {
      setShortUrlHost(window.location.origin + '/');
    }
  });

  useEffect(() => {
    if (encodedTicket != null && 
      isNotEmpty(encodedTicket) && 
      shortUrlHost != null && 
      isNotEmpty(shortUrlHost)
    ) {
      setShortUrl(shortUrlHost + encodedTicket);
    }
    else setShortUrl(null);
  }, [shortUrlHost, encodedTicket]);

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
      setErrorText("Copy failed!");
      setIsCopied(false);
      return;
    }
  }

  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setLongUrl(e.currentTarget.value);
  };

  const getEncodedTicket = async (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    setIsLoading(true);
    if (longUrl != null && isNotEmpty(longUrl)) {
      await fetch('/api/short_url', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({url: longUrl.toString()})
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setIsLoading(false);
        setEncodedTicket(response.short_url);
      });
    }
    else {
      setErrorText("Please enter a url!");
    }
  };

  return (
    <>
      <Head>
        <title>Blinkify - shorten your URL</title>
        <meta name="description" content="URL shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <p className={styles.heading}>Shorten Your URL</p>
          <form method="post" onSubmit={getEncodedTicket}>
            <input
              type="url"
              id="long_url"
              name="long_url"
              placeholder="Your URL.."
              onChange={onChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
          <div className={styles.shortUrlContainer}>
            {shortUrl != null ? (
              <>
                <p>Your BlinkURL is:</p>
                <div className={styles.innerContainer}>
                  <a className={styles.shortUrl} href={shortUrl}>
                    {shortUrl}
                  </a>
                  <div
                    className={styles.copyIconContainer}
                    onClick={() => copy(shortUrl)}
                    onMouseLeave={() => setIsCopied(false)}
                  >
                    <Image
                      alt="copy"
                      height={30}
                      width={30}
                      src="/copy.png"
                      className={styles.icon}
                      priority
                    />
                    <span className={styles.tooltipText}>
                      {isCopied ? "Copied" : "Copy on clipboard"}
                    </span>
                  </div>
                </div>
                <div className={styles.qrCodeContainer}>
                  <span className={styles.scanQrCode}>Scan your BlinkURL</span>
                  <Canvas
                    text={shortUrl}
                    options={{
                      level: 'M',
                      margin: 3,
                      scale: 4,
                      width: 150,
                      color: {
                        dark: '#3d0c59',
                        light: '#a7abbe',
                      },
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className={styles.errorContainer}>
            <span className={styles.error}>{errorText}</span>
          </div>
          {isLoading ? <Loader /> : null}
        </div>
      </main>
    </>
  );
}
