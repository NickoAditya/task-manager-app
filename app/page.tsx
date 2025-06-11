"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskProvider } from "@/contexts/task-context"
import { Sidebar } from "@/components/sidebar"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { Dashboard } from "@/components/dashboard"
import { SearchBar } from "@/components/search-bar"
import { KanbanBoard } from "@/components/kanban-board"
import { Analytics } from "@/components/analytics"
import { Calendar } from "@/components/calendar"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const { toast } = useToast()

  // Show welcome toast on first visit
  // Hapus seluruh useEffect ini yang menampilkan welcome toast
  // useEffect(() => {
  //   const hasVisited = localStorage.getItem("hasVisitedTaskMaster")
  //   if (!hasVisited) {
  //     setTimeout(() => {
  //       toast({
  //         title: "Selamat datang di TaskMaster Pro! 🚀",
  //         description: "Aplikasi manajemen tugas yang akan membantu Anda lebih produktif.",
  //         duration: 5000,
  //       })
  //       localStorage.setItem("hasVisitedTaskMaster", "true")
  //     }, 1000)
  //   }
  // }, [toast])

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  // Perbarui renderMainContent untuk meneruskan setActiveView ke Dashboard
  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard setActiveView={setActiveView} />
      case "kanban":
        return <KanbanBoard onEditTask={handleEditTask} />
      case "calendar":
        return <Calendar onEditTask={handleEditTask} />
      case "analytics":
        return <Analytics />
      case "pomodoro":
        return <PomodoroTimer />
      default:
        return <TaskList view={activeView} onEditTask={handleEditTask} />
    }
  }

  return (
    <TaskProvider>
      <div className="flex h-screen bg-background transition-all duration-300">
        {/* Mobile menu button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>

        {/* Sidebar - responsive */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-40 lg:hidden"
            >
              <Sidebar
                activeView={activeView}
                setActiveView={(view) => {
                  setActiveView(view)
                  setIsMobileMenuOpen(false)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b border-border px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {activeView === "dashboard" && "Beranda"}
                  {activeView === "all-tasks" && "Semua Tugas"}
                  {activeView === "today" && "Tugas Hari Ini"}
                  {activeView === "upcoming" && "Tugas Mendatang"}
                  {activeView === "completed" && "Tugas Selesai"}
                  {activeView === "kanban" && "Papan Kanban"}
                  {activeView === "calendar" && "Kalender"}
                  {activeView === "analytics" && "Analitik"}
                  {activeView === "pomodoro" && "Timer Fokus"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <SearchBar />
                <ThemeToggle />
                <Button
                  onClick={handleAddTask}
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tugas
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <AnimatePresence>
          {showTaskForm && (
            <TaskForm
              task={editingTask}
              onClose={() => {
                setShowTaskForm(false)
                setEditingTask(null)
              }}
            />
          )}
        </AnimatePresence>

        <Toaster />
      </div>
    </TaskProvider>
  )
}
