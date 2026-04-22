import './globals.css'

export const metadata = {
  title: 'Sip or Spill',
  description: 'The ultimate drinking game app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}