import { Html, Head, Main, NextScript } from "next/document";
import { asset } from "@/lib/brand";

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href={asset("/placeholder/mark.svg")} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
