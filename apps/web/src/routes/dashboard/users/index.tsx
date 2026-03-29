import { keepPreviousData, queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@boilerplate/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@boilerplate/ui/components/card"

import { DataTable } from "@/components/data-table"
import { SearchBar } from "@/components/search-bar"
import { TablePagination } from "@/components/table-pagination"
import { tablePaginationSearchParams } from "@/lib/utils/search-params"

import { getUsersFn } from "./-data"

const usersQueryOptions = (data: typeof Route.types.searchSchema) =>
  queryOptions({
    queryKey: ["users", data.page, data.pageSize, data.search ?? ""],
    queryFn: () => getUsersFn({ data }),
    placeholderData: keepPreviousData,
  })

export const Route = createFileRoute("/dashboard/users/")({
  validateSearch: tablePaginationSearchParams,
  loaderDeps: ({ search }) => ({ page: search.page, pageSize: search.pageSize, search: search.search }),
  loader: ({ deps, context }) => {
    void context.queryClient.prefetchQuery(usersQueryOptions(deps))
  },
  component: UsersPage,
})

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link className="font-medium" to="/dashboard/users/$id" params={{ id: row.original.id.toString() }}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{row.original.email}</div>
        {row.original.isAdmin && <Badge variant="outline">Admin</Badge>}
      </div>
    ),
  },
  {
    accessorKey: "emailVerified",
    header: "Status",
    cell: ({ row }) =>
      row.original.emailVerified ? <Badge variant="default">Verified</Badge> : <Badge variant="outline">Unverified</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.createdAt.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}
      </div>
    ),
  },
]

type User = Awaited<ReturnType<typeof getUsersFn>>["users"][number]

function UsersPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const { data: users } = useSuspenseQuery(usersQueryOptions(search))

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Search and browse accounts.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <CardDescription>All registered users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar className="max-w-sm" placeholder="Search by name or email" />
          {users.users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {search.search?.trim() ? "No users match your search." : "No users yet."}
            </div>
          ) : (
            <DataTable columns={userColumns} data={users.users} />
          )}
          {users.users.length > 0 ? (
            <div className="flex justify-end border-t pt-4">
              <TablePagination
                currentPage={search.page ?? 1}
                totalPages={users.totalPages}
                totalCount={users.totalCount}
                onPageChange={(page) => {
                  void navigate({ to: "/dashboard/users", search: (prev) => ({ ...prev, page }) })
                }}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
