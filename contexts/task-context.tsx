"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
  status: "backlog" | "todo" | "in-progress" | "review" | "done"
  estimatedTime?: number
  actualTime?: number
  attachments?: string[]
  notes?: string[]
  isRecurring?: boolean
  recurringPattern?: "daily" | "weekly" | "monthly"
  assignedTo?: string
}

interface TaskContextType {
  tasks: Task[]
  categories: string[]
  tags: string[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredTasks: Task[]
  moveTask: (id: string, newStatus: Task["status"]) => void
  addTag: (tag: string) => void
  addCategory: (category: string) => void
  addNote: (taskId: string, note: string) => void
  addAttachment: (taskId: string, attachment: string) => void
  duplicateTask: (id: string) => void
  getTasksByStatus: (status: Task["status"]) => Task[]
  getTasksByDate: (date: string) => Task[]
  getTasksCompletedByDate: (startDate: string, endDate: string) => { date: string; count: number }[]
  getTasksCreatedByDate: (startDate: string, endDate: string) => { date: string; count: number }[]
  getTasksByCategory: () => { category: string; count: number }[]
  getTasksByPriority: () => { priority: string; count: number }[]
  getProductivityScore: () => number
  getCompletionRate: () => number
  exportTasks: () => string
  importTasks: (jsonData: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        console.error("Error parsing tasks from localStorage", e)
        setTasks(getSampleTasks())
      }
    } else {
      // Add sample tasks
      setTasks(getSampleTasks())
      localStorage.setItem("tasks", JSON.stringify(getSampleTasks()))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const categories = Array.from(new Set(tasks.map((task) => task.category)))
  const tags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])))

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "todo",
      tags: taskData.tags || [],
      notes: taskData.notes || [],
      attachments: taskData.attachments || [],
    }
    setTasks((prev) => [...prev, newTask])
    toast({
      title: "Tugas berhasil ditambahkan",
      description: `"${newTask.title}" telah ditambahkan ke daftar tugas Anda.`,
    })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
    toast({
      title: "Tugas berhasil diperbarui",
      description: `Perubahan pada tugas telah disimpan.`,
    })
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    setTasks((prev) => prev.filter((task) => task.id !== id))
    toast({
      title: "Tugas berhasil dihapus",
      description: `"${taskToDelete?.title}" telah dihapus dari daftar tugas Anda.`,
      variant: "destructive",
    })
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          const status = completed ? "done" : "todo"
          return { ...task, completed, status, updatedAt: new Date().toISOString() }
        }
        return task
      }),
    )
  }

  const moveTask = (id: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const completed = newStatus === "done"
          return { ...task, status: newStatus, completed, updatedAt: new Date().toISOString() }
        }
        return task
      }),
    )
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      // No need to update state directly as tags are derived from tasks
      toast({
        title: "Tag berhasil ditambahkan",
        description: `Tag "${tag}" telah ditambahkan.`,
      })
    }
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      // No need to update state directly as categories are derived from tasks
      toast({
        title: "Kategori berhasil ditambahkan",
        description: `Kategori "${category}" telah ditambahkan.`,
      })
    }
  }

  const addNote = (taskId: string, note: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const notes = [...(task.notes || []), note]
          return { ...task, notes, updatedAt: new Date().toISOString() }
        }
        return task
      }),
    )
  }

  const addAttachment = (taskId: string, attachment: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const attachments = [...(task.attachments || []), attachment]
          return { ...task, attachments, updatedAt: new Date().toISOString() }
        }
        return task
      }),
    )
  }

  const duplicateTask = (id: string) => {
    const taskToDuplicate = tasks.find((task) => task.id === id)
    if (taskToDuplicate) {
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        title: `${taskToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false,
        status: "todo",
      }
      setTasks((prev) => [...prev, duplicatedTask])
      toast({
        title: "Tugas berhasil diduplikasi",
        description: `"${duplicatedTask.title}" telah ditambahkan ke daftar tugas Anda.`,
      })
    }
  }

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const getTasksByDate = (date: string) => {
    return filteredTasks.filter((task) => task.dueDate === date)
  }

  const getTasksCompletedByDate = (startDate: string, endDate: string) => {
    const result: { date: string; count: number }[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const count = tasks.filter(
        (task) => task.completed && new Date(task.updatedAt).toISOString().split("T")[0] === dateStr,
      ).length
      result.push({ date: dateStr, count })
    }

    return result
  }

  const getTasksCreatedByDate = (startDate: string, endDate: string) => {
    const result: { date: string; count: number }[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const count = tasks.filter((task) => new Date(task.createdAt).toISOString().split("T")[0] === dateStr).length
      result.push({ date: dateStr, count })
    }

    return result
  }

  const getTasksByCategory = () => {
    const result: { category: string; count: number }[] = []
    categories.forEach((category) => {
      const count = tasks.filter((task) => task.category === category).length
      result.push({ category, count })
    })
    return result
  }

  const getTasksByPriority = () => {
    const priorities = ["high", "medium", "low"]
    const result: { priority: string; count: number }[] = []
    priorities.forEach((priority) => {
      const count = tasks.filter((task) => task.priority === priority).length
      result.push({ priority, count })
    })
    return result
  }

  const getProductivityScore = () => {
    if (tasks.length === 0) return 0

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed).length
    const overdueTasks = tasks.filter((task) => {
      const today = new Date().toISOString().split("T")[0]
      return task.dueDate < today && !task.completed
    }).length

    // Calculate score based on completion rate and overdue tasks
    const completionRate = completedTasks / totalTasks
    const overdueRate = overdueTasks / totalTasks

    // Score formula: 100 * (completion rate - 0.5 * overdue rate)
    // This rewards completion and penalizes overdue tasks
    const score = 100 * (completionRate - 0.5 * overdueRate)

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  const getCompletionRate = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.completed).length
    return (completedTasks / tasks.length) * 100
  }

  const exportTasks = () => {
    return JSON.stringify(tasks, null, 2)
  }

  const importTasks = (jsonData: string) => {
    try {
      const importedTasks = JSON.parse(jsonData)
      if (Array.isArray(importedTasks)) {
        setTasks(importedTasks)
        toast({
          title: "Tugas berhasil diimpor",
          description: `${importedTasks.length} tugas telah diimpor.`,
        })
      } else {
        throw new Error("Data yang diimpor bukan array")
      }
    } catch (e) {
      toast({
        title: "Gagal mengimpor tugas",
        description: "Format data tidak valid.",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        tags,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        searchTerm,
        setSearchTerm,
        filteredTasks,
        moveTask,
        addTag,
        addCategory,
        addNote,
        addAttachment,
        duplicateTask,
        getTasksByStatus,
        getTasksByDate,
        getTasksCompletedByDate,
        getTasksCreatedByDate,
        getTasksByCategory,
        getTasksByPriority,
        getProductivityScore,
        getCompletionRate,
        exportTasks,
        importTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}

// Sample tasks for initial data
function getSampleTasks(): Task[] {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]

  return [
    {
      id: "1",
      title: "Menyelesaikan laporan proyek Q4",
      description: "Membuat laporan lengkap untuk proyek kuartal 4 termasuk analisis performa dan rekomendasi",
      category: "Pekerjaan",
      priority: "high",
      dueDate: tomorrow,
      completed: false,
      createdAt: today,
      updatedAt: today,
      tags: ["laporan", "penting", "deadline"],
      status: "in-progress",
      estimatedTime: 120,
      notes: ["Jangan lupa sertakan data dari tim marketing", "Perlu review dari manager sebelum submit"],
    },
    {
      id: "2",
      title: "Belanja groceries mingguan",
      description: "Membeli bahan makanan untuk minggu ini di supermarket",
      category: "Personal",
      priority: "medium",
      dueDate: today,
      completed: false,
      createdAt: today,
      updatedAt: today,
      tags: ["belanja", "rutin"],
      status: "todo",
      isRecurring: true,
      recurringPattern: "weekly",
    },
    {
      id: "3",
      title: "Olahraga pagi",
      description: "Jogging di taman selama 30 menit",
      category: "Kesehatan",
      priority: "low",
      dueDate: today,
      completed: true,
      createdAt: today,
      updatedAt: today,
      tags: ["olahraga", "rutin"],
      status: "done",
      isRecurring: true,
      recurringPattern: "daily",
    },
    {
      id: "4",
      title: "Meeting dengan klien baru",
      description: "Diskusi tentang kebutuhan proyek dan timeline",
      category: "Pekerjaan",
      priority: "high",
      dueDate: tomorrow,
      completed: false,
      createdAt: today,
      updatedAt: today,
      tags: ["meeting", "klien", "penting"],
      status: "todo",
      estimatedTime: 60,
    },
    {
      id: "5",
      title: "Belajar React Hooks",
      description: "Mempelajari useContext dan useReducer",
      category: "Belajar",
      priority: "medium",
      dueDate: nextWeek,
      completed: false,
      createdAt: today,
      updatedAt: today,
      tags: ["react", "programming", "online"],
      status: "backlog",
    },
    {
      id: "6",
      title: "Membaca buku 'Atomic Habits'",
      description: "Menyelesaikan bab 5-7",
      category: "Personal",
      priority: "low",
      dueDate: nextWeek,
      completed: false,
      createdAt: today,
      updatedAt: today,
      tags: ["buku", "pengembangan diri"],
      status: "in-progress",
    },
    {
      id: "7",
      title: "Membayar tagihan listrik",
      description: "Bayar tagihan listrik bulan ini",
      category: "Personal",
      priority: "high",
      dueDate: tomorrow,
      completed: false,
      createdAt: today,
      updatedAt: today,
      tags: ["tagihan", "bulanan"],
      status: "todo",
      isRecurring: true,
      recurringPattern: "monthly",
    },
  ]
}
