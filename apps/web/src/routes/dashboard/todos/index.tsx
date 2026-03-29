import { queryOptions, useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"

import { Button } from "@boilerplate/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@boilerplate/ui/components/card"
import { Checkbox } from "@boilerplate/ui/components/checkbox"
import { Input } from "@boilerplate/ui/components/input"
import { toast } from "@boilerplate/ui/components/sonner"

import { createTodoFn, deleteTodoFn, listTodosFn, setTodoCompletedFn, type TodoListItem } from "./-data"

const dashboardRoute = getRouteApi("/dashboard")

const todosListQueryOptions = () => queryOptions({ queryKey: ["todos", "list"], queryFn: () => listTodosFn() })

export const Route = createFileRoute("/dashboard/todos/")({
  component: TodosPage,
  head: () => ({ meta: [{ title: "Todos · Boilerplate" }] }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(todosListQueryOptions())
  },
})

function TodosPage() {
  const { user, queryClient } = dashboardRoute.useRouteContext()

  const [title, setTitle] = useState("")

  const listQuery = useSuspenseQuery(todosListQueryOptions())
  const listKey = todosListQueryOptions().queryKey

  const create = useMutation({
    mutationFn: (payload: { title: string }) => createTodoFn({ data: payload }),
    onMutate: async ({ title: nextTitle }) => {
      await queryClient.cancelQueries(todosListQueryOptions())
      const previous = queryClient.getQueryData<TodoListItem[]>(listKey)
      const tempId = -Date.now()
      queryClient.setQueryData(listKey, (old) => [
        {
          id: tempId,
          title: nextTitle,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
        },
        ...(old ?? []),
      ])
      return { previous, tempId }
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.previous !== undefined) queryClient.setQueryData(listKey, ctx.previous)
      toast.error(e.message ?? "Something went wrong")
    },
    onSuccess: (data, _v, ctx) => {
      if (!data || ctx?.tempId === undefined) return
      queryClient.setQueryData(listKey, (old) => (old ?? []).map((t) => (t.id === ctx.tempId ? data : t)))
      setTitle("")
      toast.success("Todo added")
    },
  })

  const toggle = useMutation({
    mutationFn: (payload: { id: number; completed: boolean }) => setTodoCompletedFn({ data: payload }),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries(todosListQueryOptions())
      const previous = queryClient.getQueryData<TodoListItem[]>(listKey)
      queryClient.setQueryData(listKey, (old) => (old ?? []).map((t) => (t.id === id ? { ...t, completed } : t)))
      return { previous }
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.previous !== undefined) queryClient.setQueryData(listKey, ctx.previous)
      toast.error(e.message ?? "Something went wrong")
    },
    onSuccess: (data) => {
      if (!data) return
      queryClient.setQueryData(listKey, (old) => (old ?? []).map((t) => (t.id === data.id ? data : t)))
    },
  })

  const remove = useMutation({
    mutationFn: (payload: { id: number }) => deleteTodoFn({ data: payload }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(todosListQueryOptions())
      const previous = queryClient.getQueryData<TodoListItem[]>(listKey)
      queryClient.setQueryData(listKey, (old) => (old ?? []).filter((t) => t.id !== id))
      return { previous }
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.previous !== undefined) queryClient.setQueryData(listKey, ctx.previous)
      toast.error(e.message ?? "Something went wrong")
    },
    onSuccess: () => toast.success("Todo removed"),
  })

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Todos</h1>
        <p className="text-sm text-muted-foreground">Your personal todos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add todo</CardTitle>
          <CardDescription>Creates a todo for your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (title.trim()) void create.mutateAsync({ title: title.trim() })
              }
            }}
          />
          <Button
            className="shrink-0"
            disabled={!title.trim() || create.isPending}
            onClick={() => void create.mutateAsync({ title: title.trim() })}
          >
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>List</CardTitle>
          <CardDescription>{`${listQuery.data?.length ?? 0} items`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {!listQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">No todos yet.</p>
          ) : (
            listQuery.data.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 rounded-md border px-3 py-2">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) => void toggle.mutateAsync({ id: todo.id, completed: checked === true })}
                />
                <div className="min-w-0 flex-1">
                  <p className={todo.completed ? "text-muted-foreground line-through" : ""}>{todo.title}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground"
                  disabled={remove.isPending}
                  onClick={() => void remove.mutateAsync({ id: todo.id })}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
