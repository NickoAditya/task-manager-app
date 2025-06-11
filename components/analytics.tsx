"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useTask } from "@/contexts/task-context"
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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity, Calendar, Target, Clock, Award, Zap } from "lucide-react"

export function Analytics() {
  const {
    tasks,
    getTasksCompletedByDate,
    getTasksCreatedByDate,
    getTasksByCategory,
    getTasksByPriority,
    getProductivityScore,
    getCompletionRate,
  } = useTask()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Calculate date ranges
  const today = new Date()
  const getDateRange = (range: string) => {
    const end = new Date()
    const start = new Date()

    switch (range) {
      case "7d":
        start.setDate(start.getDate() - 6)
        break
      case "30d":
        start.setDate(start.getDate() - 29)
        break
      case "90d":
        start.setDate(start.getDate() - 89)
        break
      default:
        start.setDate(start.getDate() - 6)
    }

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    }
  }

  const { start, end } = getDateRange(timeRange)

  // Get data for charts
  const completionData = getTasksCompletedByDate(start, end)
  const creationData = getTasksCreatedByDate(start, end)
  const categoryData = getTasksByCategory()
  const priorityData = getTasksByPriority()

  // Combine completion and creation data
  const combinedData = completionData.map((item, index) => ({
    date: item.date,
    completed: item.count,
    created: creationData[index]?.count || 0,
  }))

  // Calculate trends
  const totalCompleted = completionData.reduce((sum, item) => sum + item.count, 0)
  const totalCreated = creationData.reduce((sum, item) => sum + item.count, 0)
  const completionRate = getCompletionRate()
  const productivityScore = getProductivityScore()

  // Calculate weekly comparison
  const thisWeekCompleted = completionData.slice(-7).reduce((sum, item) => sum + item.count, 0)
  const lastWeekCompleted = completionData.slice(-14, -7).reduce((sum, item) => sum + item.count, 0)
  const weeklyTrend = lastWeekCompleted > 0 ? ((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100 : 0

  // Colors for charts
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
  const PRIORITY_COLORS = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#3b82f6",
  }

  // Productivity data for radial chart
  const productivityData = [
    {
      name: "Produktivitas",
      value: productivityScore,
      fill:
        productivityScore >= 80
          ? "#10b981"
          : productivityScore >= 60
            ? "#3b82f6"
            : productivityScore >= 40
              ? "#f59e0b"
              : "#ef4444",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analitik & Laporan</h1>
          <p className="text-muted-foreground">Pantau performa dan produktivitas Anda</p>
        </div>

        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList>
            <TabsTrigger value="7d">7 Hari</TabsTrigger>
            <TabsTrigger value="30d">30 Hari</TabsTrigger>
            <TabsTrigger value="90d">90 Hari</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diselesaikan</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCompleted}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {weeklyTrend >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={weeklyTrend >= 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(weeklyTrend).toFixed(1)}% dari minggu lalu
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dibuat</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCreated}</div>
            <p className="text-xs text-muted-foreground">
              Tugas baru dalam {timeRange === "7d" ? "7 hari" : timeRange === "30d" ? "30 hari" : "90 hari"} terakhir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skor Produktivitas</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{productivityScore}</div>
            <div className="flex items-center space-x-1 text-xs">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-muted-foreground">dari 100 poin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="trends">Tren</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi</TabsTrigger>
          <TabsTrigger value="performance">Performa</TabsTrigger>
          <TabsTrigger value="insights">Insight</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Tren Penyelesaian vs Pembuatan Tugas</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedData}>
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
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
                      }
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      name="Diselesaikan"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      name="Dibuat"
                      stackId="2"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Harian</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedData}>
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
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Diselesaikan"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      name="Dibuat"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#3b82f6" }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kategori</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
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
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                    <XAxis type="number" stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
                    <YAxis
                      type="category"
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
                    <Bar dataKey="count" name="Jumlah Tugas">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Productivity Score */}
            <Card>
              <CardHeader>
                <CardTitle>Skor Produktivitas</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={productivityData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill={productivityData[0].fill} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                      {productivityScore}
                    </text>
                    <text
                      x="50%"
                      y="60%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm text-muted-foreground"
                    >
                      dari 100
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Metrik Performa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</div>
                    <div className="text-sm text-muted-foreground">Tingkat Penyelesaian</div>
                    <Progress value={completionRate} className="mt-2 h-2" />
                  </div>

                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tugas</div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-orange-600">
                      {
                        tasks.filter((task) => {
                          const today = new Date().toISOString().split("T")[0]
                          return task.dueDate < today && !task.completed
                        }).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Tugas Terlambat</div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-purple-600">
                      {Array.from(new Set(tasks.map((task) => task.category))).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Kategori Aktif</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insight Produktivitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {productivityScore >= 80 && (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <div className="font-medium text-green-900 dark:text-green-100">Performa Excellent!</div>
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Anda memiliki tingkat produktivitas yang sangat baik. Pertahankan momentum ini!
                      </div>
                    </div>
                  )}

                  {productivityScore >= 60 && productivityScore < 80 && (
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <div className="font-medium text-blue-900 dark:text-blue-100">Performa Good</div>
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Produktivitas Anda cukup baik. Coba fokus pada tugas prioritas tinggi untuk meningkatkan skor.
                      </div>
                    </div>
                  )}

                  {productivityScore < 60 && (
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div className="font-medium text-yellow-900 dark:text-yellow-100">Perlu Peningkatan</div>
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Ada ruang untuk peningkatan. Coba atur prioritas dan deadline dengan lebih baik.
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <div className="font-medium text-purple-900 dark:text-purple-100">Analisis Kategori</div>
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      {categoryData.length > 0 && (
                        <>
                          Kategori "{categoryData.sort((a, b) => b.count - a.count)[0]?.category}" memiliki tugas
                          terbanyak ({categoryData.sort((a, b) => b.count - a.count)[0]?.count} tugas).
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rekomendasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-accent">
                    <div className="font-medium">🎯 Fokus pada Prioritas</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Selesaikan tugas prioritas tinggi terlebih dahulu untuk meningkatkan produktivitas.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-accent">
                    <div className="font-medium">⏰ Gunakan Pomodoro Timer</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Bekerja dalam interval 25 menit dengan istirahat 5 menit untuk meningkatkan fokus.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-accent">
                    <div className="font-medium">📊 Review Mingguan</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Lakukan evaluasi progress setiap minggu dan rencanakan tugas untuk minggu berikutnya.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-accent">
                    <div className="font-medium">🏷️ Organisasi dengan Tag</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Gunakan tag untuk mengelompokkan tugas serupa dan memudahkan pencarian.
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
