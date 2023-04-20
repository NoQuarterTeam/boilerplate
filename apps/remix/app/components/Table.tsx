import * as React from "react"

import { Link as RLink, useSearchParams } from "@remix-run/react"
import queryString from "query-string"

import { Prisma } from "@boilerplate/database/types"
import { join, merge } from "@boilerplate/shared"
import { Button, NoData } from "@boilerplate/ui"
import { ArrowDown, ArrowUp } from "lucide-react"
import { DEFAULT_TAKE } from "~/lib/table"

interface DataType {
  id: string
  [key: string]: unknown
}

export type Sort = { orderBy: string; order: Prisma.SortOrder }

interface Props<T extends DataType> {
  children: (React.ReactElement<ColumnProps<T>> | undefined)[] | React.ReactElement<ColumnProps<T>> | undefined
  count?: number
  take?: number
  data?: T[]
  getRowHref?: (item: T) => string
  noDataText?: string
}

export function Table<T extends DataType>(props: Props<T>) {
  const [params, setParams] = useSearchParams()
  const orderBy = params.get("orderBy") as string | undefined
  const order = params.get("order") as Prisma.SortOrder | undefined

  const handleSort = (order: Sort) => {
    const existingParams = queryString.parse(params.toString())
    setParams(queryString.stringify({ ...existingParams, ...order }))
  }

  const columns = React.Children.map(props.children, (child) => child?.props)?.filter(Boolean) || []

  const data = props.data || []

  return (
    <div className="flex w-full flex-grow flex-col overflow-hidden">
      <div className="flex px-4 py-3">
        {columns.map(({ sortKey, header, row, hasNoLink, ...column }: ColumnProps<T>, i: number) => (
          <div
            className={join(
              "flex flex-1 items-center overflow-hidden",
              i === columns.length - 1 ? "justify-end" : "justify-start",
            )}
            key={i.toString()}
            {...column}
          >
            {header && row && (
              <Header
                isButton={!!sortKey}
                onClick={() =>
                  sortKey
                    ? handleSort({
                        orderBy: sortKey,
                        order: order === Prisma.SortOrder.desc ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
                      })
                    : {}
                }
              >
                {header}
                {orderBy && !!sortKey && orderBy === sortKey && (
                  <div className="center ml-1">
                    {order === Prisma.SortOrder.asc ? (
                      <ArrowUp className="sq-4" />
                    ) : order === Prisma.SortOrder.desc ? (
                      <ArrowDown className="sq-4" />
                    ) : null}
                  </div>
                )}
              </Header>
            )}
          </div>
        ))}
      </div>

      {data.length > 0 ? (
        <div className="flex flex-grow flex-col justify-between">
          {data.map((item) => (
            <div
              key={item.id}
              className={join(
                "flex w-full items-center border-t border-black/10 px-4 dark:border-white/10",
                !!props.getRowHref && "cursor-pointer hover:bg-gray-900",
              )}
            >
              {columns.map(({ row, sortKey, header, ...column }, i) => (
                <ColumnField key={i.toString()} href={props.getRowHref?.(item)} isLast={i === columns.length - 1} {...column}>
                  {row?.(item)}
                </ColumnField>
              ))}
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-black/10 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-gray-900">
            <p className="w-100% text-sm">
              {props.count} {props.count === 1 ? "item" : "items"}
            </p>

            <Pagination count={props.count} take={props.take} />
          </div>
        </div>
      ) : (
        <div className="center p-10">
          <NoData>{props.noDataText || "No data yet"}</NoData>
        </div>
      )}
    </div>
  )
}

function Header({
  isButton,
  className,
  children,
  onClick,
}: {
  isButton?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const sharedClassName = join(
    "flex items-center min-w-auto text-sm h-auto font-semibold",
    className,
    isButton ? "cursor-pointer" : "cursor-default",
  )
  return isButton ? (
    <button className={sharedClassName} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={sharedClassName}>{children}</div>
  )
}

interface ColumnProps<T> {
  row?: (item: T) => React.ReactNode
  sortKey?: string
  hasNoLink?: boolean
  header?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function Column<T extends DataType>(_: ColumnProps<T>) {
  return null
}

function _ColumnField<T>({ isLast, hasNoLink, href, className, ...props }: ColumnProps<T> & { href?: string; isLast?: boolean }) {
  const sharedClassName = merge(
    "flex flex-1 items-center h-12 overflow-x-auto text-sm",
    isLast ? "justify-end" : "justify-start",
    className,
  )
  return !hasNoLink && !!href ? (
    <RLink className={merge(sharedClassName, "hover:no-underline")} to={href}>
      {typeof props.children === "string" || typeof props.children === "number" ? (
        <p className="truncate">{props.children}</p>
      ) : (
        props.children
      )}
    </RLink>
  ) : (
    <div className={sharedClassName}>
      {typeof props.children === "string" || typeof props.children === "number" ? (
        <p className="truncate">{props.children}</p>
      ) : (
        props.children
      )}
    </div>
  )
}

const ColumnField = React.memo(_ColumnField)

export interface PaginationProps {
  count?: number
  take?: number
}

export function Pagination(props: PaginationProps) {
  const numberOfPages = props.count ? Math.ceil(props.count / (props.take || DEFAULT_TAKE)) : 0
  const [params, setParams] = useSearchParams()
  const currentPage = parseInt(params.get("page") || "1") as number
  const handleSetPage = (page: number) => {
    const existingParams = queryString.parse(params.toString())
    setParams(queryString.stringify({ ...existingParams, page: page.toString() }))
  }

  const pageArray = [...Array(numberOfPages)].map((_, i) => i)
  return (
    <div className="hstack space-x-1">
      <Button
        size="xs"
        variant="ghost"
        disabled={currentPage <= 1 || props.count === 0}
        onClick={() => handleSetPage(currentPage - 1)}
      >
        Prev
      </Button>
      {pageArray.map((page) => (
        <Button
          size="xs"
          key={page}
          variant={currentPage === page + 1 ? "solid" : "ghost"}
          onClick={() => handleSetPage(page + 1)}
        >
          {page + 1}
        </Button>
      ))}
      <Button
        size="xs"
        variant="ghost"
        disabled={props.count === 0 || (!!props.count && props.count <= currentPage * (props.take || 5))}
        onClick={() => handleSetPage(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}
