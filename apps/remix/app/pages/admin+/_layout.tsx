import { join } from "@boilerplate/shared"
import { json, redirect, type LoaderArgs } from "@remix-run/node"
import { NavLink, Outlet } from "@remix-run/react"
import { getCurrentUser } from "~/services/auth/auth.server"

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getCurrentUser(request)
  if (user.role !== "ADMIN") return redirect("/")
  return json(null)
}

export default function AdminLayout() {
  return (
    <div className="flex p-10">
      <div className="px-4">
        <ul>
          <li>
            <NavLink end to="/admin" className={({ isActive }) => join("", isActive && "text-primary-500")}>
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink to="users" className={({ isActive }) => join("", isActive && "text-primary-500")}>
              Users
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
