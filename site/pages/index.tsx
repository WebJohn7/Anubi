import Head from "next/head";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import Featured from "@/components/Featured";
import ExploreAll from "@/components/ExploreAll";
import Research from "@/components/Research";
import CodeSection from "@/components/CodeSection";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Study rebuild of the anubi.io homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Featured />
        <ExploreAll />
        <Research />
        <CodeSection />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
