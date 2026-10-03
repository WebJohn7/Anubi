import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Bricolage_Grotesque, Epilogue, IBM_Plex_Mono } from "next/font/google";
import { useEffect } from "react";
import { LocaleProvider } from "@/lib/locale";
import { startSmoothScroll } from "@/lib/smooth";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const epilogue = Epilogue({ subsets: ["latin"], variable: "--font-epilogue", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-plex-mono", display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add("js");
    return startSmoothScroll();
  }, []);

  return (
    <LocaleProvider>
      {/* Font variables live on <html> so :root tokens in tokens.css can resolve them. */}
      <style jsx global>{`
        html {
          --font-bricolage: ${bricolage.style.fontFamily};
          --font-epilogue: ${epilogue.style.fontFamily};
          --font-plex-mono: ${plexMono.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </LocaleProvider>
  );
}
