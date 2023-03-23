import Head                    from 'next/head'
import styles                  from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';
import Loader                  from '@/components/Loader/loader';
import Image                   from 'next/image';
import { stringOrNull }        from '@/lib/types';
import { useQRCode }           from 'next-qrcode';
import Link from 'next/link';

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
      })
      .finally(() => {
        let input = document.getElementById('long_url') as HTMLInputElement;
        if (input)
          input.value = '';
      });
    }
    else {
      setErrorText("Please enter a url!");
    }
  };

  return (
    <>
      <Head>
        <title>ZipLink - shorten your URL</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="description" content="URL shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <nav>
          <ul className={styles.navUl}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.ziplink}>
                ZipLink
              </Link>
            </li>
            <li className={styles.navItem}>
              <a
                href="https://github.com/Sadia1505076/url_shortener_with_docker_aws"
                rel="noreferrer"
              >
                <Image
                  src="/github.png"
                  alt="github"
                  className={styles.github}
                  width={30}
                  height={30}
                />
              </a>
              <a href="https://sadia.dev" rel="noreferrer">
                <Image
                  src="/author.png"
                  alt="author"
                  className={styles.github}
                  width={30}
                  height={30}
                />
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.container}>
          <div className={styles.descriptionContainer}>
            <div className={styles.description}>
              <p className={styles.heading}>Create your own url</p>
              <p className={styles.shortDes}>
                Our new URL shortener simplifies long and complicated links into
                user-friendly web addresses. With just a few clicks, you can
                streamline your blog posts, social media profiles, and product
                pages. Say goodbye to cluttered URLs and hello to efficient
                sharing with our cutting-edge technology.
              </p>
            </div>
            <img
              src="woman_coder.jpg"
              alt="Women Coder"
              className={styles.coder}
            />
          </div>
          <form
            method="post"
            onSubmit={getEncodedTicket}
            className={styles.form}
          >
            <input
              type="url"
              id="long_url"
              name="long_url"
              placeholder="Your URL.."
              onChange={onChange}
              required
            />
            <div className={styles.submitContainer}>
              <button type="submit" className={styles.submitButton}>
                ZipLink
              </button>
            </div>
          </form>
          <div className={styles.result}>
            {shortUrl != null ? (
              <>
                <div className={styles.urlContainer}>
                  <p className={styles.longUrl}>{longUrl}</p>
                  <div className={styles.shortUrlContainer}>
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
                </div>
                <div className={styles.qrCodeContainer}>
                  <span className={styles.scanQrCode}>Scan your ZipLink</span>
                  <Canvas
                    text={shortUrl}
                    options={{
                      level: "M",
                      margin: 3,
                      scale: 4,
                      width: 150,
                      color: {
                        dark: "#3d0c59",
                        light: "#a7abbe",
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
