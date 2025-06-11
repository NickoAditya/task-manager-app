"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Calendar, Flag, User, Clock, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTask, type Task } from "@/contexts/task-context"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface KanbanBoardProps {
  onEditTask: (task: Task) => void
}

export function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const { filteredTasks, moveTask, deleteTask } = useTask()

  const columns = [
    { id: "backlog", title: "Backlog", color: "bg-slate-100 dark:bg-slate-800", description: "Ide & Rencana" },
    { id: "todo", title: "Siap Dikerjakan", color: "bg-blue-100 dark:bg-blue-900", description: "Ready to Start" },
    {
      id: "in-progress",
      title: "Sedang Dikerjakan",
      color: "bg-amber-100 dark:bg-amber-900",
      description: "Work in Progress",
    },
    { id: "done", title: "Selesai", color: "bg-emerald-100 dark:bg-emerald-900", description: "Completed" },
  ]

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Tinggi"
      case "medium":
        return "Sedang"
      case "low":
        return "Rendah"
      default:
        return priority
    }
  }

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const isOverdue = (dueDate: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dueDate < today
  }

  return (
    <div className="h-full">
      <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[600px] px-2">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id as Task["status"])

          return (
            <div
              key={column.id}
              className="flex flex-col h-full min-w-[300px] max-w-[320px] flex-shrink-0 overflow-hidden"
            >
              <div className={cn("p-4 rounded-t-xl border-b-2 shadow-sm", column.color)}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <p className="text-xs text-muted-foreground">{column.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2 font-medium">
                    {tasks.length}
                  </Badge>
                </div>
              </div>

              <div
                className={cn(
                  "flex-1 p-3 space-y-4 min-h-[500px] max-h-[calc(100vh-200px)] rounded-b-xl border border-t-0 transition-all duration-300 overflow-y-auto",
                  "bg-card/50 backdrop-blur-sm",
                )}
              >
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={cn("mb-3 relative group select-none")}
                    >
                      <Card
                        className={cn(
                          "hover:shadow-md transition-all duration-200 border-l-4 bg-background/80 backdrop-blur-sm w-full cursor-pointer",
                          task.completed && "opacity-60",
                          isOverdue(task.dueDate) &&
                            !task.completed &&
                            "border-l-red-500 bg-red-50/10 dark:bg-red-950/20",
                          task.priority === "high" && !isOverdue(task.dueDate) && "border-l-red-500",
                          task.priority === "medium" && !isOverdue(task.dueDate) && "border-l-amber-500",
                          task.priority === "low" && !isOverdue(task.dueDate) && "border-l-blue-500",
                          "hover:scale-[1.01] hover:shadow-lg",
                        )}
                      >
                        <CardContent className="p-4 pl-10 space-y-3">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4
                                className={cn(
                                  "font-semibold text-sm leading-tight text-foreground break-words",
                                  task.completed && "line-through text-muted-foreground",
                                )}
                              >
                                {task.title}
                              </h4>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEditTask(task)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  {columns.map((col) => (
                                    <DropdownMenuItem
                                      key={col.id}
                                      onClick={() => moveTask(task.id, col.id as Task["status"])}
                                    >
                                      Pindah ke {col.title}
                                    </DropdownMenuItem>
                                  ))}
                                  <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {task.description && (
                              <p
                                className={cn(
                                  "text-xs text-muted-foreground line-clamp-2",
                                  task.completed && "line-through",
                                )}
                              >
                                {task.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {task.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags && task.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  +{task.tags.length - 2}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={cn(
                                    "flex items-center space-x-1 px-2 py-0.5",
                                    getPriorityBgColor(task.priority),
                                    "text-white",
                                  )}
                                >
                                  <Flag className="w-2 h-2 mr-1" />
                                  <span>{getPriorityLabel(task.priority)}</span>
                                </Badge>
                              </div>

                              <div
                                className={cn(
                                  "flex items-center space-x-1",
                                  isOverdue(task.dueDate) && !task.completed ? "text-red-600" : "text-muted-foreground",
                                )}
                              >
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(task.dueDate).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>

                            {task.estimatedTime && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{task.estimatedTime} menit</span>
                              </div>
                            )}

                            {task.assignedTo && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <User className="w-3 h-3" />
                                <span>{task.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-3 border-2 border-dashed border-muted-foreground/20">
                      <Plus className="w-6 h-6 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Belum ada tugas</p>
                    <p className="text-xs text-muted-foreground/80 max-w-[200px]">Kategori ini masih kosong</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
