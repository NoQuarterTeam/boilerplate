import * as React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import type { LinksFunction, LoaderArgs, SerializeFrom, V2_MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useFetchers,
  useLoaderData,
  useMatches,
  useNavigation,
  useRouteError,
} from "@remix-run/react"
import NProgress from "nprogress"

import { join } from "@boilerplate/shared"
import { Toaster } from "@boilerplate/ui"

import poppins300 from "@fontsource/poppins/300.css"
import poppins400 from "@fontsource/poppins/400.css"
import poppins500 from "@fontsource/poppins/500.css"
import poppins600 from "@fontsource/poppins/600.css"
import poppins700 from "@fontsource/poppins/700.css"
import poppins800 from "@fontsource/poppins/800.css"
import poppins900 from "@fontsource/poppins/900.css"

import appStyles from "~/styles/app.css"
import nProgressStyles from "~/styles/nprogress.css"

import { FlashMessage } from "./components/FlashMessage"
import { FULL_WEB_URL } from "./lib/config.server"
import { type Theme } from "./lib/theme"
import { getFlashSession } from "./services/session/flash.server"
import { getThemeSession } from "./services/session/theme.server"
import { RiEmotionSadLine } from "react-icons/ri"
import { LinkButton } from "./components/LinkButton"

export const meta: V2_MetaFunction = () => {
  return [{ title: "Boilerplate" }, { name: "description", content: "Created by No Quarter" }]
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: poppins300 },
    { rel: "stylesheet", href: poppins400 },
    { rel: "stylesheet", href: poppins500 },
    { rel: "stylesheet", href: poppins600 },
    { rel: "stylesheet", href: poppins700 },
    { rel: "stylesheet", href: poppins800 },
    { rel: "stylesheet", href: poppins900 },
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: nProgressStyles, async: true },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const { flash, commit } = await getFlashSession(request)
  const { getTheme, commit: commitTheme } = await getThemeSession(request)
  return json(
    {
      flash,
      theme: getTheme(),
      config: { WEB_URL: FULL_WEB_URL },
    },
    {
      headers: [
        ["Set-Cookie", await commit()],
        ["Set-Cookie", await commitTheme()],
      ],
    },
  )
}
export type RootLoader = SerializeFrom<typeof loader>

NProgress.configure({ showSpinner: false })

export default function App() {
  const { flash, theme } = useLoaderData<typeof loader>()

  const transition = useNavigation()
  const fetchers = useFetchers()

  const state = React.useMemo<"idle" | "loading">(() => {
    const states = [transition.state, ...fetchers.map((fetcher) => fetcher.state)]
    if (states.every((state) => state === "idle")) return "idle"
    return "loading"
  }, [transition.state, fetchers])

  React.useEffect(() => {
    if (state === "loading") NProgress.start()
    if (state === "idle") NProgress.done()
  }, [state])

  return (
    <Document theme={theme}>
      <Tooltip.Provider>
        <FlashMessage flash={flash} />
        <Outlet />
      </Tooltip.Provider>
      <Toaster />
    </Document>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const isCatchError = isRouteErrorResponse(error)

  return (
    <Document theme="dark">
      <div className="flex h-screen items-center p-20">
        {isCatchError ? (
          <div className="stack space-y-6">
            <div className="stack">
              <h1 className="text-9xl">{error.status}</h1>
              <p className="text-lg">
                {error.status === 404
                  ? "The page you're looking for doesn't exist"
                  : error.data.message || "Something's gone wrong here"}
              </p>
            </div>
            {error.status === 404 && <LinkButton to="/">Take me home</LinkButton>}
          </div>
        ) : error instanceof Error ? (
          <div className="stack max-w-4xl space-y-6">
            <RiEmotionSadLine className="sq-20" />
            <h1 className="text-3xl">Oops, there was an error.</h1>
            <p>{error.message}</p>
            <hr />
            <div className="rounded-md bg-gray-200 p-4 dark:bg-gray-700 ">
              <pre className="overflow-scroll text-sm">{error.stack}</pre>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-6xl">Sorry, an unknown error has occured</h1>
          </div>
        )}
      </div>
    </Document>
  )
}

interface DocumentProps {
  children: React.ReactNode
  theme: Theme
}

function Document({ theme, children }: DocumentProps) {
  const matches = useMatches()
  const shouldDisableScripts = matches.some((match) => match.handle?.disableScripts)
  return (
    <html lang="en" className={join(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content={theme === "dark" ? "#000" : "#fff"} />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content={theme === "dark" ? "#000" : "#fff"} />
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-800">
        {children}
        {!shouldDisableScripts && <Scripts />}
        <LiveReload />
      </body>
    </html>
  )
}
