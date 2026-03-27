import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import type { RouterOutputs } from "@boilerplate/api"

import { Button, ButtonText } from "@/components/button"
import { Input } from "@/components/input"
import { Text } from "@/components/text"
import { authClient } from "@/lib/auth-client"
import { useTRPC } from "@/lib/trpc-provider"
import { cn } from "@/lib/utils"

type TodoListItem = RouterOutputs["todos"]["list"][number]

type AuthSession = NonNullable<NonNullable<ReturnType<typeof authClient.useSession>["data"]>>

function UnauthenticatedHome() {
  return (
    <View className="flex-1 justify-center gap-4 bg-background px-6">
      <Text className="text-2xl font-bold">Welcome</Text>
      <Text className="mb-5 text-base leading-[22px] text-muted-foreground">Sign in to manage your todos on the go.</Text>
      <Link href="/sign-in" asChild>
        <Button>
          <ButtonText className="text-center">Log in</ButtonText>
        </Button>
      </Link>
      <Link href="/sign-up" asChild>
        <Button variant="outline">
          <ButtonText className="text-center">Sign up</ButtonText>
        </Button>
      </Link>
    </View>
  )
}

function AuthenticatedHome({ session }: { session: AuthSession }) {
  const safeAreaInsets = useSafeAreaInsets()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")
  const userId = Number(session.user.id)
  const handleSignOut = () => {
    queryClient.clear()
    void authClient.signOut()
  }

  const listOpts = trpc.todos.list.queryOptions()
  const listKey = listOpts.queryKey

  const listQuery = useQuery(listOpts)

  const create = useMutation(
    trpc.todos.create.mutationOptions({
      onMutate: async ({ title: nextTitle }) => {
        await queryClient.cancelQueries(trpc.todos.list.queryFilter())
        const previous = queryClient.getQueryData<TodoListItem[]>(listKey)
        const tempId = -Date.now()
        queryClient.setQueryData(listKey, (old) => [
          {
            id: tempId,
            title: nextTitle,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
          },
          ...(old ?? []),
        ])
        setTitle("")
        return { previous, tempId }
      },
      onError: (_e, v, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(listKey, ctx.previous)
        setTitle(v.title)
      },
      onSuccess: (data, _v, ctx) => {
        if (!data || ctx?.tempId === undefined) return
        queryClient.setQueryData(listKey, (old) => (old ?? []).map((t) => (t.id === ctx.tempId ? data : t)))
      },
    }),
  )

  const toggle = useMutation(
    trpc.todos.setCompleted.mutationOptions({
      onMutate: async ({ id, completed }) => {
        await queryClient.cancelQueries(trpc.todos.list.queryFilter())
        const previous = queryClient.getQueryData<TodoListItem[]>(listKey)
        queryClient.setQueryData(listKey, (old) => (old ?? []).map((t) => (t.id === id ? { ...t, completed } : t)))
        return { previous }
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.previous !== undefined) queryClient.setQueryData(listKey, ctx.previous)
      },
      onSuccess: (data) => {
        if (!data) return
        queryClient.setQueryData(listKey, (old) => (old ?? []).map((t_) => (t_.id === data.id ? data : t_)))
      },
    }),
  )

  const remove = useMutation(
    trpc.todos.delete.mutationOptions({
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries(trpc.todos.list.queryFilter())
        const previous = queryClient.getQueryData<TodoListItem[]>(listKey)
        queryClient.setQueryData(listKey, (old) => (old ?? []).filter((t) => t.id !== id))
        return { previous }
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.previous !== undefined) queryClient.setQueryData(listKey, ctx.previous)
      },
    }),
  )

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: safeAreaInsets.top }}>
      <View className="flex-row items-center justify-between border-b border-border px-5 pb-2">
        <Text className="font-semibold">Hi, {session.user.name?.split(/\s+/)[0] ?? "there"}</Text>
        <Button variant="ghost" onPress={handleSignOut}>
          <ButtonText>Log out</ButtonText>
        </Button>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" className="flex-1" contentContainerClassName="grow p-5 pb-10">
        <View className="flex-row items-center gap-2.5">
          <Input
            className="flex-1"
            placeholder="What needs doing?"
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={() => {
              const t = title.trim()
              if (t) void create.mutateAsync({ title: t })
            }}
          />
          <Button
            className="min-w-[72px]"
            disabled={!title.trim() || create.isPending}
            onPress={() => void create.mutateAsync({ title: title.trim() })}
          >
            {create.isPending ? <ActivityIndicator color="#fafafa" size="small" /> : <ButtonText>Add</ButtonText>}
          </Button>
        </View>
        {listQuery.isPending ? (
          <ActivityIndicator className="my-4" />
        ) : !listQuery.data?.length ? (
          <Text className="mt-2 text-muted-foreground">No todos yet.</Text>
        ) : (
          <View className="mt-2 gap-2.5">
            {listQuery.data.map((todo) => (
              <View key={todo.id} className="flex-row items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: todo.completed }}
                  onPress={() => void toggle.mutateAsync({ id: todo.id, completed: !todo.completed })}
                  className="size-7 items-center justify-center rounded-md border-2 border-border"
                >
                  <Text className="font-bold">{todo.completed ? "✓" : ""}</Text>
                </Pressable>
                <Text className={cn("flex-1", todo.completed && "text-muted-foreground line-through")} numberOfLines={2}>
                  {todo.title}
                </Text>
                <Pressable
                  onPress={() => void remove.mutateAsync({ id: todo.id })}
                  disabled={remove.isPending}
                  className="px-2 py-1.5 active:opacity-60"
                >
                  <Text className="text-sm font-semibold text-red-700">Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default function Home() {
  const { data: session, isPending: sessionPending } = authClient.useSession()

  if (sessionPending) return null
  if (!session?.user) return <UnauthenticatedHome />
  return <AuthenticatedHome session={session} />
}
