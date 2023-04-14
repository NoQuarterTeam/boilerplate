import "./globals.css"

import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  preload: true,
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Boilerplate",
  description: "Created by No Quarter",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
