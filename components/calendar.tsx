"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTask, type Task } from "@/contexts/task-context"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface CalendarViewProps {
  onEditTask: (task: Task) => void
}

export function Calendar({ onEditTask }: CalendarViewProps) {
  const { filteredTasks } = useTask()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay()

  // Create an array of days including empty slots for proper alignment
  const calendarDays = Array(startDay).fill(null).concat(daysInMonth)

  // Calculate the number of weeks needed
  const weeksNeeded = Math.ceil(calendarDays.length / 7)

  // Ensure we have a complete grid by adding empty slots at the end if needed
  while (calendarDays.length < weeksNeeded * 7) {
    calendarDays.push(null)
  }

  // Group days into weeks
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  const getTasksForDay = (date: Date | null) => {
    if (!date) return []

    const dateString = format(date, "yyyy-MM-dd")
    return filteredTasks.filter((task) => task.dueDate === dateString)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const today = () => setCurrentMonth(new Date())

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <span>Kalender Tugas</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            Hari Ini
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy", { locale: id })}</h2>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day, i) => (
            <div key={i} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day, i) => {
            const tasksForDay = day ? getTasksForDay(day) : []
            const isToday = day ? isSameDay(day, new Date()) : false
            const isCurrentMonth = day ? isSameMonth(day, currentMonth) : false

            return (
              <div
                key={i}
                className={cn(
                  "min-h-[100px] p-1 border rounded-md",
                  isToday ? "border-primary bg-primary/5" : "border-border",
                  !isCurrentMonth && "opacity-50",
                  !day && "bg-muted/20",
                )}
              >
                {day && (
                  <>
                    <div className="text-right text-sm font-medium mb-1">{format(day, "d")}</div>
                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                      {tasksForDay.slice(0, 3).map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm transition-all",
                            task.completed ? "line-through opacity-60" : "",
                            getPriorityColor(task.priority),
                          )}
                          onClick={() => onEditTask(task)}
                        >
                          {task.title}
                        </motion.div>
                      ))}

                      {tasksForDay.length > 3 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full h-5 text-xs">
                              +{tasksForDay.length - 3} lainnya
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            {tasksForDay.slice(3).map((task) => (
                              <DropdownMenuItem key={task.id} onClick={() => onEditTask(task)}>
                                <div className="flex items-center space-x-2 w-full">
                                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                  <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
