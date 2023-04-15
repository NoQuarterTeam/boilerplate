import { RiMenuLine, RiMoonLine, RiSunLine } from "react-icons/ri"
import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useFetcher, useLoaderData, useSubmit } from "@remix-run/react"

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  Limiter,
} from "@boilerplate/ui"

import { LinkButton } from "~/components/LinkButton"
import { useTheme } from "~/lib/theme"
import { getMaybeUser } from "~/services/auth/auth.server"

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getMaybeUser(request)
  return json(user)
}

export default function Home() {
  const user = useLoaderData<typeof loader>()
  const logoutSubmit = useSubmit()
  const themeFetcher = useFetcher()

  const theme = useTheme()
  const isDark = theme === "dark"
  return (
    <div>
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 65 65' width='60' height='60' fill='none' stroke='${
            isDark ? "rgb(50 50 50 / 0.2)" : "rgb(15 23 42 / 0.03)"
          }'%3e%3cpath d='M0 .5H63.5V65'/%3e%3c/svg%3e")`,
        }}
        className="absolute inset-0 z-[-10]"
      />
      <div className="border-b border-solid border-gray-50 dark:border-gray-700">
        <Limiter className="bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between py-5 align-middle">
            <div className="hstack h-12 space-x-6">
              <Link to="/">
                <div className="hstack">
                  <p className="text-xl font-semibold">Boilerplate</p>
                </div>
              </Link>
            </div>
            <div className="hstack hidden md:flex">
              <themeFetcher.Form action="/api/theme" method="post" replace>
                <input type="hidden" name="theme" value={isDark ? "light" : "dark"} />
                <IconButton
                  rounded="full"
                  type="submit"
                  aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                  variant="ghost"
                  icon={isDark ? <RiSunLine className="sq-4" /> : <RiMoonLine className="sq-4" />}
                />
              </themeFetcher.Form>
              {user ? (
                <Button size="md" variant="outline" onClick={() => logoutSubmit(null, { method: "post", action: "/logout" })}>
                  Logout
                </Button>
              ) : (
                <div className="hstack">
                  <LinkButton size="md" variant="ghost" to="/login">
                    Login
                  </LinkButton>
                  <LinkButton size="md" colorScheme="primary" to="/register">
                    Register
                  </LinkButton>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  size="md"
                  rounded="full"
                  className="inline-block md:hidden"
                  aria-label={`Toggle open menu`}
                  icon={<RiMenuLine className="sq-5" />}
                  variant="ghost"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="inline-block md:hidden">
                {user ? (
                  <DropdownMenuItem asChild>
                    <Button variant="ghost" onClick={() => logoutSubmit(null, { method: "post", action: "/logout" })}>
                      Log out
                    </Button>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Register</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
              {user ? (
                <p className="text-2xl">Hey there, {user.firstName}!</p>
              ) : (
                <LinkButton to="/register" size="lg" colorScheme="primary">
                  Sign up
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </Limiter>
    </div>
  )
}
