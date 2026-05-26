import Footer from "@/features/common/Footer"
import Header from "@/features/common/Header"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}