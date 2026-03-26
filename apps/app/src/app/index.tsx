import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button, ButtonText } from "@/components/button"
import { Input } from "@/components/input"
import { authClient } from "@/lib/auth-client"
import { useTRPC } from "@/lib/trpc-provider"
import { cn } from "@/lib/utils"

export default function Home() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")

  const listQuery = useQuery({
    ...trpc.todos.list.queryOptions(),
    enabled: !!session?.user,
  })

  const create = useMutation(
    trpc.todos.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.todos.list.queryFilter())
        setTitle("")
      },
    }),
  )

  const toggle = useMutation(
    trpc.todos.setCompleted.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.todos.list.queryFilter())
      },
    }),
  )

  const remove = useMutation(
    trpc.todos.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.todos.list.queryFilter())
      },
    }),
  )

  if (sessionPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (session?.user) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-row items-center justify-between border-b border-neutral-200 px-5 py-3">
          <Text className="text-[17px] font-semibold">Todos</Text>
          <Pressable className="px-2 py-1 active:opacity-60" onPress={() => void authClient.signOut()}>
            <Text className="text-base font-semibold text-blue-600">Log out</Text>
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="p-5 pb-10">
          <Text className="mb-5 text-xl font-semibold">Hi, {session.user.name?.split(/\s+/)[0] ?? "there"}</Text>

          <Text className="mt-3 mb-2 text-[13px] font-semibold text-neutral-600">New todo</Text>
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

          <Text className="mt-3 mb-2 text-[13px] font-semibold text-neutral-600">Your list</Text>
          {listQuery.isPending ? (
            <ActivityIndicator className="my-4" />
          ) : !listQuery.data?.length ? (
            <Text className="text-[15px] text-neutral-500">No todos yet.</Text>
          ) : (
            <View className="gap-2.5">
              {listQuery.data.map((todo) => (
                <View key={todo.id} className="flex-row items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2.5">
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: todo.completed }}
                    onPress={() => void toggle.mutateAsync({ id: todo.id, completed: !todo.completed })}
                    className="h-7 w-7 items-center justify-center rounded-md border-2 border-neutral-700"
                  >
                    <Text className="text-base font-bold text-neutral-900">{todo.completed ? "✓" : ""}</Text>
                  </Pressable>
                  <Text
                    className={cn("flex-1 text-base text-neutral-900", todo.completed && "text-neutral-500 line-through")}
                    numberOfLines={2}
                  >
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
      </SafeAreaView>
    )
  }

  return (
    <View className="flex-1 justify-center gap-4 px-6">
      <Text className="text-2xl font-bold">Welcome</Text>
      <Text className="mb-5 text-base leading-[22px] text-neutral-600">Sign in to manage your todos on the go.</Text>
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
