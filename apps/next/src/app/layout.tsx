import { Poppins } from "next/font/google"
import { ThemeProvider } from "~/components/ThemeProvider"
import "./globals.css"

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
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-800">
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  )
}
