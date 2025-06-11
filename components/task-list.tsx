"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Edit, Trash2, Calendar, Flag, Folder } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTask, type Task } from "@/contexts/task-context"
import { cn } from "@/lib/utils"

interface TaskListProps {
  view: string
  onEditTask: (task: Task) => void
}

export function TaskList({ view, onEditTask }: TaskListProps) {
  const { filteredTasks, toggleTask, deleteTask } = useTask()

  const getFilteredTasks = () => {
    const today = new Date().toISOString().split("T")[0]

    switch (view) {
      case "all-tasks":
        return filteredTasks
      case "today":
        return filteredTasks.filter((task) => task.dueDate === today && !task.completed)
      case "upcoming":
        return filteredTasks.filter((task) => task.dueDate > today && !task.completed)
      case "completed":
        return filteredTasks.filter((task) => task.completed)
      default:
        return filteredTasks
    }
  }

  const tasks = getFilteredTasks()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  const isOverdue = (dueDate: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dueDate < today
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada tugas</h3>
        <p className="text-gray-500">
          {view === "completed" ? "Belum ada tugas yang diselesaikan" : "Mulai dengan menambahkan tugas baru"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={cn("transition-all hover:shadow-md", task.completed && "opacity-75")}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={cn("font-medium text-gray-900", task.completed && "line-through text-gray-500")}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={cn("text-sm text-gray-600 mt-1", task.completed && "line-through")}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Folder className="w-4 h-4" />
                    <span>{task.category}</span>
                  </div>

                  <div
                    className={cn(
                      "flex items-center space-x-2 text-sm",
                      isOverdue(task.dueDate) && !task.completed ? "text-red-600" : "text-gray-500",
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString("id-ID")}
                      {isOverdue(task.dueDate) && !task.completed && " (Terlambat)"}
                    </span>
                  </div>

                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    <Flag className="w-3 h-3 mr-1" />
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
