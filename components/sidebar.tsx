"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  CheckSquare,
  CalendarIcon,
  Clock,
  CheckCircle2,
  Folder,
  BarChart3,
  Kanban,
  Timer,
  ChevronDown,
  Tag,
  Plus,
  Sparkles,
  TrendingUp,
  Target,
  Activity,
  Star,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTask } from "@/contexts/task-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { tasks, categories, tags, addCategory, addTag } = useTask()
  const [showCategories, setShowCategories] = useState(true)
  const [showTags, setShowTags] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()

  const today = new Date().toISOString().split("T")[0]

  const menuItems = [
    {
      id: "dashboard",
      label: "Beranda",
      icon: LayoutDashboard,
      count: null,
      gradient: "from-blue-500 to-purple-600",
      description: "Dashboard utama",
    },
    {
      id: "all-tasks",
      label: "Semua Tugas",
      icon: CheckSquare,
      count: tasks.length,
      gradient: "from-green-500 to-emerald-600",
      description: "Lihat semua tugas",
    },
    {
      id: "today",
      label: "Hari Ini",
      icon: CalendarIcon,
      count: tasks.filter((task) => task.dueDate === today && !task.completed).length,
      gradient: "from-orange-500 to-red-600",
      description: "Tugas hari ini",
    },
    {
      id: "upcoming",
      label: "Mendatang",
      icon: Clock,
      count: tasks.filter((task) => task.dueDate > today && !task.completed).length,
      gradient: "from-purple-500 to-pink-600",
      description: "Tugas mendatang",
    },
    {
      id: "completed",
      label: "Selesai",
      icon: CheckCircle2,
      count: tasks.filter((task) => task.completed).length,
      gradient: "from-green-500 to-teal-600",
      description: "Tugas selesai",
    },
  ]

  const advancedViews = [
    {
      id: "kanban",
      label: "Papan Kanban",
      icon: Kanban,
      gradient: "from-indigo-500 to-blue-600",
      description: "Tampilan board",
    },
    {
      id: "calendar",
      label: "Kalender",
      icon: CalendarIcon,
      gradient: "from-cyan-500 to-blue-600",
      description: "Tampilan kalender",
    },
    {
      id: "analytics",
      label: "Analitik",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-600",
      description: "Laporan & statistik",
    },
    {
      id: "pomodoro",
      label: "Timer Fokus",
      icon: Timer,
      gradient: "from-red-500 to-orange-600",
      description: "Pomodoro timer",
    },
  ]

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim())
      setNewCategory("")
      toast({
        title: "✨ Kategori baru ditambahkan",
        description: `Kategori "${newCategory.trim()}" berhasil ditambahkan.`,
      })
    }
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim())
      setNewTag("")
      toast({
        title: "🏷️ Tag baru ditambahkan",
        description: `Tag "${newTag.trim()}" berhasil ditambahkan.`,
      })
    }
  }

  const getTaskCountForCategory = (category: string) => {
    return tasks.filter((task) => task.category === category).length
  }

  const getTaskCountForTag = (tag: string) => {
    return tasks.filter((task) => task.tags?.includes(tag)).length
  }

  const getMenuItemIcon = (item: any, isActive: boolean) => {
    const Icon = item.icon
    return (
      <div
        className={cn(
          "p-2 rounded-lg transition-all duration-300",
          isActive
            ? `bg-gradient-to-br ${item.gradient} shadow-lg`
            : "bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/10",
        )}
      >
        <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-muted-foreground")} />
      </div>
    )
  }

  return (
    <div className="w-72 h-full bg-background/95 backdrop-blur-xl border-r border-border/50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

      {/* Header */}
      <div className="relative p-6 border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskMaster Pro
            </h2>
            <p className="text-xs text-muted-foreground">Productivity Suite</p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 relative">
        {/* Main Navigation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Menu Utama</h3>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse delay-100" />
              <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-200" />
            </div>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = activeView === item.id
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "w-full group relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg"
                        : "hover:bg-accent/50 hover:shadow-md",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getMenuItemIcon(item, isActive)}
                        <div>
                          <span className={cn("font-medium", isActive ? "text-primary" : "text-foreground")}>
                            {item.label}
                          </span>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      {item.count !== null && (
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className={cn(
                            "ml-auto transition-all duration-300",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : item.count > 0
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "opacity-50",
                          )}
                        >
                          {item.count}
                        </Badge>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* Advanced Views */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
              Tampilan Lanjutan
            </h3>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          <ul className="space-y-2">
            {advancedViews.map((item, index) => {
              const isActive = activeView === item.id
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + menuItems.length) * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "w-full group relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg"
                        : "hover:bg-accent/50 hover:shadow-md",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {getMenuItemIcon(item, isActive)}
                      <div>
                        <span className={cn("font-medium", isActive ? "text-primary" : "text-foreground")}>
                          {item.label}
                        </span>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorAdvanced"
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4" />
              <span>Kategori</span>
            </div>
            <motion.div animate={{ rotate: showCategories ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showCategories && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 space-y-1 overflow-hidden"
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveView(`category-${category}`)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm group",
                      activeView === `category-${category}`
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                      <span>{category}</span>
                    </div>
                    <Badge variant="outline" className="ml-auto group-hover:border-primary/50 transition-colors">
                      {getTaskCountForCategory(category)}
                    </Badge>
                  </motion.button>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kategori
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Folder className="w-5 h-5 text-primary" />
                        <span>Tambah Kategori Baru</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Nama Kategori</Label>
                        <Input
                          id="category-name"
                          placeholder="Masukkan nama kategori"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddCategory} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Kategori
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div>
          <button
            onClick={() => setShowTags(!showTags)}
            className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </div>
            <motion.div animate={{ rotate: showTags ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showTags && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 space-y-1 overflow-hidden"
              >
                {tags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveView(`tag-${tag}`)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm group",
                      activeView === `tag-${tag}`
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                      <span>{tag}</span>
                    </div>
                    <Badge variant="outline" className="ml-auto group-hover:border-primary/50 transition-colors">
                      {getTaskCountForTag(tag)}
                    </Badge>
                  </motion.button>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Tag className="w-5 h-5 text-primary" />
                        <span>Tambah Tag Baru</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tag-name">Nama Tag</Label>
                        <Input
                          id="tag-name"
                          placeholder="Masukkan nama tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTag} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Tag
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-primary/5 to-purple/5 rounded-xl p-4 border border-primary/10">
          <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Statistik Cepat</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Selesai</span>
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-green-200">
                {tasks.filter((task) => task.completed).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Aktif</span>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
                {tasks.filter((task) => !task.completed).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Prioritas</span>
              </div>
              <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">
                {tasks.filter((task) => task.priority === "high" && !task.completed).length}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
