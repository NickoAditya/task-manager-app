"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Coffee, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function PomodoroTimer() {
  // Timer states
  const [mode, setMode] = useState<"work" | "break">("work")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/placeholder.svg") // This would be a real audio file in production
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!)

            // Play sound if not muted
            if (!isMuted && audioRef.current) {
              audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
            }

            // Switch modes
            if (mode === "work") {
              toast({
                title: "Waktu kerja selesai!",
                description: "Saatnya istirahat sejenak.",
              })
              setMode("break")
              setTimeLeft(breakDuration * 60)
              setCompletedPomodoros((prev) => prev + 1)
            } else {
              toast({
                title: "Waktu istirahat selesai!",
                description: "Saatnya kembali bekerja.",
              })
              setMode("work")
              setTimeLeft(workDuration * 60)
            }

            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, mode, workDuration, breakDuration, isMuted, toast])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSeconds = mode === "work" ? workDuration * 60 : breakDuration * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  // Handle start/pause
  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  // Handle reset
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === "work" ? workDuration * 60 : breakDuration * 60)
  }

  // Apply settings
  const applySettings = () => {
    setTimeLeft(mode === "work" ? workDuration * 60 : breakDuration * 60)
    setShowSettings(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              {mode === "work" ? (
                <Brain className="w-5 h-5 mr-2 text-primary" />
              ) : (
                <Coffee className="w-5 h-5 mr-2 text-green-500" />
              )}
              Pomodoro Timer
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "work" | "break")} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="work" disabled={isActive}>
                Kerja
              </TabsTrigger>
              <TabsTrigger value="break" disabled={isActive}>
                Istirahat
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {showSettings ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Durasi Kerja: {workDuration} menit</span>
                </div>
                <Slider
                  value={[workDuration]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={(value) => setWorkDuration(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Durasi Istirahat: {breakDuration} menit</span>
                </div>
                <Slider
                  value={[breakDuration]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value) => setBreakDuration(value[0])}
                />
              </div>

              <Button onClick={applySettings} className="w-full">
                Terapkan Pengaturan
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "text-6xl font-bold tabular-nums transition-colors",
                    mode === "work" ? "text-primary" : "text-green-500",
                  )}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {mode === "work" ? "Waktu fokus" : "Waktu istirahat"}
                </div>
              </div>

              <Progress value={calculateProgress()} className="h-2" />

              <div className="flex justify-center space-x-4">
                <Button variant={isActive ? "outline" : "default"} size="lg" onClick={toggleTimer} className="w-32">
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Start
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetTimer}
                  disabled={timeLeft === (mode === "work" ? workDuration * 60 : breakDuration * 60)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Pomodoro selesai: {completedPomodoros}</div>
          <div className="text-sm text-muted-foreground">{mode === "work" ? "Fokus" : "Istirahat"}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
