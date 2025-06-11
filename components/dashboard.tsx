"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Flame,
  Zap,
  Sparkles,
  Rocket,
  Star,
  Trophy,
  Activity,
  BarChart3,
  Plus,
  MoreHorizontal,
  TrendingDown,
  Timer,
  Kanban,
} from "lucide-react"
import { useTask } from "@/contexts/task-context"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Tambahkan prop setActiveView ke komponen Dashboard
export function Dashboard({ setActiveView }: { setActiveView: (view: string) => void }) {
  const { tasks, getTasksCompletedByDate, getTasksByCategory, getTasksByPriority, getProductivityScore } = useTask()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const today = new Date().toISOString().split("T")[0]
  const todayTasks = tasks.filter((task) => task.dueDate === today && !task.completed)
  const overdueTasks = tasks.filter((task) => task.dueDate < today && !task.completed)
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && !task.completed)

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Get data for charts
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0]

  const completionData = getTasksCompletedByDate(sevenDaysAgoStr, today)
  const categoryData = getTasksByCategory()
  const priorityData = getTasksByPriority()

  const productivityScore = getProductivityScore()

  // Colors for charts
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
  const PRIORITY_COLORS = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#3b82f6",
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return "Luar Biasa!"
    if (score >= 60) return "Bagus"
    if (score >= 40) return "Cukup Baik"
    return "Perlu Ditingkatkan"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="w-5 h-5" />
    if (score >= 60) return <Star className="w-5 h-5" />
    if (score >= 40) return <Zap className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Selamat Pagi"
    if (hour < 17) return "Selamat Siang"
    if (hour < 20) return "Selamat Sore"
    return "Selamat Malam"
  }

  const categories = [...new Set(tasks.map((task) => task.category))]

  // Calculate weekly trend
  const thisWeek = completionData.slice(-7).reduce((sum, item) => sum + item.count, 0)
  const lastWeek = completionData.slice(-14, -7).reduce((sum, item) => sum + item.count, 0)
  const weeklyTrend = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Rocket className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{getGreeting()}! 👋</h1>
                  <p className="text-blue-100 text-lg">Siap untuk menaklukkan hari ini?</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold">Waktunya untuk menjadi lebih produktif</p>
                <p className="text-blue-100 max-w-md">
                  Kelola tugas Anda dengan smart, capai target dengan efisien, dan raih kesuksesan setiap hari.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{Math.round(completionRate)}%</div>
                <div className="text-blue-100 text-sm">Tingkat Penyelesaian</div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {currentTime.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="statistics"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Statistik
          </TabsTrigger>
          <TabsTrigger
            value="productivity"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Produktivitas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards - Fixed Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tasks Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 group min-h-[160px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardContent className="p-6 flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Total Tugas</span>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <CheckSquare className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-bold text-blue-600 mb-3">{totalTasks}</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {completedTasks} selesai, {pendingTasks} pending
                    </p>
                  </div>

                  <div className="mt-auto">
                    <Progress value={completionRate} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today Tasks Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 group min-h-[160px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardContent className="p-6 flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Hari Ini</span>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-500" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-bold text-green-600 mb-3">{todayTasks.length}</div>
                    <p className="text-sm text-muted-foreground mb-4">Tugas untuk hari ini</p>
                  </div>

                  <div className="mt-auto flex justify-start">
                    {todayTasks.length > 0 ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                        <Flame className="w-3 h-3 mr-1" />
                        Fokus!
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Kosong
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Overdue Tasks Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="relative overflow-hidden border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 group min-h-[160px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardContent className="p-6 flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Terlambat</span>
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-bold text-red-600 mb-3">{overdueTasks.length}</div>
                    <p className="text-sm text-muted-foreground mb-4">Tugas yang terlambat</p>
                  </div>

                  <div className="mt-auto flex justify-start">
                    {overdueTasks.length === 0 ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Sempurna!
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* High Priority Tasks Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="relative overflow-hidden border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 group min-h-[160px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardContent className="p-6 flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Prioritas Tinggi</span>
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-bold text-orange-600 mb-3">{highPriorityTasks.length}</div>
                    <p className="text-sm text-muted-foreground mb-4">Tugas prioritas tinggi</p>
                  </div>

                  <div className="mt-auto flex justify-start">
                    {highPriorityTasks.length > 0 ? (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Urgent!
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Terkendali
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Progress and Recent Tasks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="h-[400px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <span>Progress Keseluruhan</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveView("calendar")}>
                        <Calendar className="w-4 h-4 mr-1" />
                        Kalender
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setActiveView("kanban")}>
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Kanban
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tingkat Penyelesaian</span>
                      <span className="text-3xl font-bold text-blue-600">{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>Target: 80%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
                      <div className="text-xs text-green-700 dark:text-green-300">Selesai</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{pendingTasks}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Pending</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-center mb-2">
                        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{productivityScore}</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300">Skor</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Tren Mingguan:</span>
                      {weeklyTrend >= 0 ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <TrendingUp className="w-3 h-3 mr-1" />+{weeklyTrend.toFixed(1)}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {weeklyTrend.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveView("analytics")}>
                      Detail Analisis
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Tasks */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="h-[400px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-500" />
                      </div>
                      <span>Aktivitas Terbaru</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveView("all-tasks")}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {recentTasks.length > 0 ? (
                      recentTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group cursor-pointer"
                          onClick={() => setActiveView("all-tasks")}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              task.completed
                                ? "bg-green-500"
                                : task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                task.completed ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {task.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(task.dueDate).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckSquare className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Belum ada tugas</p>
                        <p className="text-xs text-muted-foreground mt-1">Mulai dengan menambahkan tugas baru</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {recentTasks.length} dari {totalTasks} tugas
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setActiveView("all-tasks")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Tambah
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView("pomodoro")}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-red-500/10 rounded-lg w-fit mx-auto mb-4">
                    <Timer className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Timer Fokus</h3>
                  <p className="text-sm text-muted-foreground">Gunakan timer untuk meningkatkan fokus</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView("analytics")}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-500/10 rounded-lg w-fit mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Analitik Detail</h3>
                  <p className="text-sm text-muted-foreground">Lihat laporan dan statistik produktivitas</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView("kanban")}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-500/10 rounded-lg w-fit mx-auto mb-4">
                    <Kanban className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Papan Kanban</h3>
                  <p className="text-sm text-muted-foreground">Kelola tugas dengan tampilan board</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Tren Penyelesaian Tugas</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })
                      }
                      stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                    <YAxis stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                        borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                        color: theme === "dark" ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value) => [`${value} tugas`, "Diselesaikan"]}
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Tugas Selesai"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kategori</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                        borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                        color: theme === "dark" ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value) => [`${value} tugas`, "Jumlah"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Prioritas</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                    <XAxis
                      dataKey="priority"
                      stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      tickFormatter={(priority) => {
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
                      }}
                    />
                    <YAxis stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                        borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                        color: theme === "dark" ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value) => [`${value} tugas`, "Jumlah"]}
                      labelFormatter={(priority) => {
                        switch (priority) {
                          case "high":
                            return "Prioritas Tinggi"
                          case "medium":
                            return "Prioritas Sedang"
                          case "low":
                            return "Prioritas Rendah"
                          default:
                            return priority
                        }
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Jumlah Tugas"
                      fill={(entry) => PRIORITY_COLORS[entry.priority] || "#3b82f6"}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</div>
                    <div className="text-sm text-muted-foreground">Tingkat Penyelesaian</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-sm text-muted-foreground">Tugas Selesai</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-orange-600">{overdueTasks.length}</div>
                    <div className="text-sm text-muted-foreground">Tugas Terlambat</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Kategori</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Productivity Score */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  <span>Skor Produktivitas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(productivityScore)}`}>{productivityScore}</div>
                  <div className="text-lg text-muted-foreground">dari 100</div>
                  <div
                    className={`flex items-center justify-center space-x-2 mt-2 ${getScoreColor(productivityScore)}`}
                  >
                    {getScoreIcon(productivityScore)}
                    <span className="font-medium">{getScoreText(productivityScore)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tingkat Penyelesaian</span>
                      <span>{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tugas Tepat Waktu</span>
                      <span>{Math.round(((totalTasks - overdueTasks.length) / totalTasks) * 100)}%</span>
                    </div>
                    <Progress value={((totalTasks - overdueTasks.length) / totalTasks) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                  </div>
                  <span>Tips Produktivitas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="font-medium text-blue-900 dark:text-blue-100">🎯 Prioritaskan Tugas</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Fokus pada tugas prioritas tinggi terlebih dahulu
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="font-medium text-green-900 dark:text-green-100">🍅 Gunakan Pomodoro</div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Bekerja dalam interval 25 menit dengan istirahat
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="font-medium text-purple-900 dark:text-purple-100">📊 Review Harian</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      Evaluasi progress dan rencanakan hari berikutnya
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
