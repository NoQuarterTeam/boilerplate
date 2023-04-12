import * as React from "react"
import { type Prisma } from "@boilerplate/database/types"
import { Link, useFetcher } from "@remix-run/react"

import { safeReadableColor } from "@boilerplate/shared"
import { formatDuration } from "@boilerplate/shared"
import { useDisclosure } from "@boilerplate/shared"
import { useFetcherSubmit } from "~/lib/hooks/useFetcherSubmit"
import { useTimelineTasks } from "~/lib/hooks/useTimelineTasks"
import { join } from "@boilerplate/shared"
import { TaskActionMethods } from "~/pages/_app.timeline.$id"
import { type TimelineTask } from "~/pages/api+/tasks"

import { Button } from "./ui/Button"
import { ButtonGroup } from "./ui/ButtonGroup"
import { Modal } from "./ui/Modal"

export const taskItemSelectFields = {
  id: true,
  createdAt: true,
  name: true,
  description: true,
  durationHours: true,
  durationMinutes: true,
  date: true,
  isComplete: true,
  isImportant: true,
  repeat: true,
  repeatParentId: true,
  order: true,
  startTime: true,
  element: { select: { id: true, color: true, name: true } },
  todos: { select: { isComplete: true } },
} satisfies Prisma.TaskSelect

interface Props {
  task: TimelineTask
}

const TODO_RADIUS = 5

function _TaskItem({ task }: Props) {
  const { removeTask, updateTask, addTask, refetch } = useTimelineTasks()

  const deleteFetcher = useFetcher()
  const toggleCompleteFetcher = useFetcher()

  const dupeFetcher = useFetcherSubmit<{ task: TimelineTask }>({
    onSuccess: ({ task: dupeTask }) => {
      if (!dupeTask) return
      addTask(dupeTask)
    },
  })

  const handleClick = async (event: React.MouseEvent<any, MouseEvent>) => {
    if (event.metaKey) {
      event.preventDefault()
      // Duplicate
      dupeFetcher.submit({ _action: TaskActionMethods.DuplicateTask }, { action: `/timeline/${task.id}`, method: "post" })
    } else if (event.shiftKey) {
      event.preventDefault()
      // Delete
      if (task.repeat || task.repeatParentId) {
        deleteModalProps.onOpen()
      } else {
        handleDelete(false)
      }
    } else if (event.altKey) {
      event.preventDefault()
      // Toggle complete
      updateTask({ ...task, isComplete: !task.isComplete })
      toggleCompleteFetcher.submit(
        { _action: TaskActionMethods.UpdateTask, isComplete: String(!task.isComplete) },
        { action: `/timeline/${task.id}`, method: "post" },
      )
    }
  }

  const handleDelete = async (shouldDeleteFuture: boolean) => {
    deleteFetcher.submit(
      { _action: TaskActionMethods.DeleteTask, shouldDeleteFuture: shouldDeleteFuture ? "true" : "false" },
      { action: `/timeline/${task.id}`, method: "post" },
    )
    await new Promise((res) => setTimeout(res, 500))
    if (shouldDeleteFuture) {
      refetch()
    } else {
      removeTask(task)
    }
  }

  const deleteModalProps = useDisclosure()

  return (
    <div className="w-day z-[1]  p-2 pb-0" tabIndex={-1}>
      <Link to={task.id} onClick={handleClick} prefetch="intent" tabIndex={-1} className="">
        <div
          className={join(
            "group/task-item relative w-full cursor-pointer overflow-hidden rounded-md border border-gray-100 bg-white outline-none dark:border-gray-900 dark:bg-gray-700",
            task.isImportant &&
              !task.isComplete &&
              "border-primary-400 shadow-primary-400 dark:border-primary-400 shadow-[0_0_0_1px_black]",
          )}
        >
          <div
            className={join(
              "flex h-full w-full flex-col justify-between p-1.5",
              task.isComplete ? "blur-[1px] group-hover/task-item:blur-0" : "min-h-[60px]",
            )}
          >
            <div className={join(task.isComplete ? "mb-4" : "mb-2")}>
              <div>
                <p
                  className={join(
                    "text-xxs mb-1",
                    task.isComplete ? "line-clamp-1" : "line-clamp-2 group-hover/task-item:line-clamp-6",
                  )}
                >
                  {task.name}
                </p>
                {!task.isComplete && task.todos.length > 0 && (
                  <svg className="-rotate-90" width="12" height="12">
                    <circle
                      strokeWidth="2"
                      className="stroke-gray-75 dark:stroke-white/20"
                      fill="transparent"
                      r={TODO_RADIUS}
                      cx="6"
                      cy="6"
                    />
                    <circle
                      style={{ stroke: task.element.color }}
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={`${TODO_RADIUS * 2 * Math.PI} ${TODO_RADIUS * 2 * Math.PI}`}
                      strokeDashoffset={
                        TODO_RADIUS * 2 * Math.PI -
                        (task.todos.filter((t) => t.isComplete).length / task.todos.length) * TODO_RADIUS * 2 * Math.PI
                      }
                      r={TODO_RADIUS}
                      cx="6"
                      cy="6"
                    />
                  </svg>
                )}

                {!task.isComplete && task.description && (
                  <div className="circle-1.5 absolute right-1 top-1 opacity-70" style={{ background: task.element.color }} />
                )}
              </div>
            </div>
            {!task.isComplete && (
              <div className="flex items-end justify-between">
                {task.durationHours || task.durationMinutes ? (
                  <p className="text-xxs">{formatDuration(task.durationHours, task.durationMinutes)}</p>
                ) : (
                  <div />
                )}
                {task.startTime ? <p className="text-xxs">{task.startTime}</p> : <div />}
              </div>
            )}
          </div>
          {(task.repeat || task.repeatParentId) && (
            <Modal {...deleteModalProps} size="md" title="Deleting task">
              <div className="stack p-4">
                <p>Do you want to only delete this task or all future tasks as well?</p>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={deleteModalProps.onClose}>
                    Cancel
                  </Button>
                  <ButtonGroup>
                    <Button onClick={() => handleDelete(false)}>Delete this task</Button>
                    <Button colorScheme="red" onClick={() => handleDelete(true)}>
                      Delete all future
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </Modal>
          )}
          <div
            style={{ backgroundColor: task.element.color }}
            className={join(
              "absolute bottom-0 left-0 flex h-1 w-full items-center overflow-hidden rounded-sm transition-all group-hover/task-item:h-4 group-hover/task-item:opacity-100",
              task.isComplete ? "opacity-40" : "opacity-100",
            )}
          >
            <p
              style={{ color: safeReadableColor(task.element.color) }}
              className="text-xxs truncate whitespace-nowrap pl-2 opacity-0 group-hover/task-item:opacity-100"
            >
              {task.element.name}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
export const TaskItem = React.memo(_TaskItem)
