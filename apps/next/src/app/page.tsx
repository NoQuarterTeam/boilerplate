import Link from "next/link"

import { Badge, Limiter } from "@boilerplate/ui"

export default async function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 65 65' width='60' height='60' fill='none' stroke='rgb(15 23 42 / 0.03)'%3e%3cpath d='M0 .5H63.5V65'/%3e%3c/svg%3e")`,
        }}
        className="absolute inset-0 z-[-10]"
      />
      <div className="border-b border-solid border-gray-50 dark:border-gray-700">
        <Limiter className=" bg-white dark:bg-gray-800">
          <div className="flex justify-between py-5 align-middle">
            <div className="hstack h-12 space-x-6">
              <Link href="/">
                <div className="hstack">
                  <p className="text-xl font-semibold">Boilerplate</p>
                </div>
              </Link>
            </div>
          </div>
        </Limiter>
      </div>

      <Limiter className="pt-16">
        <div className="stack space-y-20">
          <div className="center flex-col">
            <div className="vstack max-w-lg space-y-6 pb-12 text-center">
              <Badge size="lg" colorScheme="green">
                Beta
              </Badge>
              <h1 className="text-5xl leading-tight">Welcome to the Boilerplate</h1>
              <p className="text-2xl">Next.js coming soon</p>
            </div>
          </div>
        </div>
      </Limiter>
    </div>
  )
}
