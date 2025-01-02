import { Footer } from "@/features/landing/components/footer";
import { Header } from "@/features/landing/components/header";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
