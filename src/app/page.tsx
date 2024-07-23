import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { JoinNow } from "@/components/landing/join-now";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <JoinNow />
      <Footer />
    </>
  );
}
