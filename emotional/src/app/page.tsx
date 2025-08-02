"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Battery,
  Coffee,
  Users,
  MessageCircle,
  Smile,
  Brain,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Zap,
} from "lucide-react"

interface EmotionalCategory {
  id: string
  name: string
  icon: any
  color: string
  initial: number
  current: number
  spent: number
}

interface SpendingEvent {
  time: string
  category: string
  amount: number
  description: string
}

export default function EmotionalBudgetTracker() {
  const [isSetup, setIsSetup] = useState(false)
  const [categories, setCategories] = useState<EmotionalCategory[]>([
    { id: "patience", name: "Patience", icon: Battery, color: "bg-blue-500", initial: 5, current: 5, spent: 0 },
    {
      id: "smalltalk",
      name: "Small-talk Energy",
      icon: MessageCircle,
      color: "bg-green-500",
      initial: 3,
      current: 3,
      spent: 0,
    },
    { id: "meeting", name: "Meeting Tolerance", icon: Users, color: "bg-purple-500", initial: 4, current: 4, spent: 0 },
    { id: "enthusiasm", name: "Enthusiasm", icon: Zap, color: "bg-yellow-500", initial: 3, current: 3, spent: 0 },
    {
      id: "politeness",
      name: "Politeness Reserves",
      icon: Smile,
      color: "bg-pink-500",
      initial: 6,
      current: 6,
      spent: 0,
    },
    { id: "focus", name: "Focus Capacity", icon: Brain, color: "bg-indigo-500", initial: 4, current: 4, spent: 0 },
  ])

  const [spendingHistory, setSpendingHistory] = useState<SpendingEvent[]>([])
  const [currentAlert, setCurrentAlert] = useState<string>("")

  const spendingOptions = [
    { category: "patience", amount: 1, description: "Dealt with interruption" },
    { category: "patience", amount: 2, description: "Handled difficult person" },
    { category: "smalltalk", amount: 1, description: "Elevator conversation" },
    { category: "smalltalk", amount: 2, description: "Lengthy hallway chat" },
    { category: "meeting", amount: 1, description: "Quick standup" },
    { category: "meeting", amount: 2, description: "Long brainstorming session" },
    { category: "enthusiasm", amount: 1, description: "Showed interest in project" },
    { category: "enthusiasm", amount: 2, description: "Gave motivational speech" },
    { category: "politeness", amount: 1, description: 'Said "please" and "thank you"' },
    { category: "politeness", amount: 2, description: "Pretended to care about weekend plans" },
    { category: "focus", amount: 1, description: "Concentrated through noise" },
    { category: "focus", amount: 2, description: "Multitasked in meeting" },
  ]

  const updateBudget = (categoryId: string, newValue: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, initial: newValue, current: newValue } : cat)),
    )
  }

  const spendEmotionalUnit = (categoryId: string, amount: number, description: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, current: cat.current - amount, spent: cat.spent + amount } : cat,
      ),
    )

    setSpendingHistory((prev) => [
      ...prev,
      {
        time: now,
        category: categoryId,
        amount,
        description,
      },
    ])

    checkForAlerts(categoryId, amount)
  }

  const checkForAlerts = (categoryId: string, spentAmount: number) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return

    const newCurrent = category.current - spentAmount
    const percentage = (newCurrent / category.initial) * 100

    const alerts = [
      {
        threshold: 0,
        message: `🚨 EMOTIONAL OVERDRAFT ALERT! Your ${category.name} is now in the red. Grumpiness is imminent. Consider hiding in the bathroom.`,
      },
      {
        threshold: 20,
        message: `⚠️ DANGER ZONE: Your ${category.name} is critically low (${Math.max(0, newCurrent)} units left). Avoid eye contact with colleagues.`,
      },
      {
        threshold: 40,
        message: `🟡 LOW RESERVES: Your ${category.name} is running low. We recommend strategic bathroom breaks.`,
      },
      {
        threshold: 60,
        message: `📊 BUDGET UPDATE: You've spent ${spentAmount} units of ${category.name}. Current balance: ${Math.max(0, newCurrent)} units.`,
      },
    ]

    const alert = alerts.find((a) => percentage <= a.threshold)
    if (alert) {
      setCurrentAlert(alert.message)
      setTimeout(() => setCurrentAlert(""), 5000)
    }
  }

  const resetDay = () => {
    setCategories((prev) => prev.map((cat) => ({ ...cat, current: cat.initial, spent: 0 })))
    setSpendingHistory([])
    setCurrentAlert("")
  }

  const getTotalSpent = () => {
    return categories.reduce((total, cat) => total + cat.spent, 0)
  }

  const getOverallMood = () => {
    const totalPercentage =
      categories.reduce((sum, cat) => {
        return sum + (cat.current / cat.initial) * 100
      }, 0) / categories.length

    if (totalPercentage >= 80) return { mood: "Energized", color: "text-green-600", emoji: "😊" }
    if (totalPercentage >= 60) return { mood: "Stable", color: "text-blue-600", emoji: "😐" }
    if (totalPercentage >= 40) return { mood: "Drained", color: "text-yellow-600", emoji: "😴" }
    if (totalPercentage >= 20) return { mood: "Exhausted", color: "text-orange-600", emoji: "😵" }
    return { mood: "Overdraft", color: "text-red-600", emoji: "🤬" }
  }

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Coffee className="h-8 w-8 text-amber-600" />
                Emotional Budget Setup
              </CardTitle>
              <CardDescription className="text-lg">
                Set your daily emotional energy budget. Be realistic - you're not a robot! 🤖
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${category.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Label className="text-base font-medium">{category.name}</Label>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={category.initial}
                      onChange={(e) => updateBudget(category.id, Number.parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                  </div>
                )
              })}
              <Button
                onClick={() => setIsSetup(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                size="lg"
              >
                Start My Emotional Day 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const overallMood = getOverallMood()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Coffee className="h-8 w-8 text-amber-600" />
                  Emotional Budget Tracker
                </CardTitle>
                <CardDescription className="text-lg">
                  Current Mood:{" "}
                  <span className={`font-semibold ${overallMood.color}`}>
                    {overallMood.mood} {overallMood.emoji}
                  </span>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-700">{getTotalSpent()} units spent today</div>
                <Button onClick={resetDay} variant="outline" className="mt-2 bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Day
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Alert */}
        {currentAlert && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">{currentAlert}</AlertDescription>
          </Alert>
        )}

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            const percentage = (category.current / category.initial) * 100
            const isOverdraft = category.current < 0

            return (
              <Card key={category.id} className={`shadow-md ${isOverdraft ? "border-red-300 bg-red-50" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${category.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                    </div>
                    <Badge variant={isOverdraft ? "destructive" : percentage > 50 ? "default" : "secondary"}>
                      {category.current}/{category.initial}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={Math.max(0, percentage)}
                    className={`h-3 ${isOverdraft ? "[&>div]:bg-red-500" : ""}`}
                  />
                  <div className="mt-2 text-xs text-gray-600">
                    {category.spent} units spent
                    {isOverdraft && <span className="text-red-600 font-semibold ml-2">OVERDRAFT!</span>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Spending Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Spend Emotional Energy
            </CardTitle>
            <CardDescription>Click to record your emotional expenditures throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spendingOptions.map((option, index) => {
                const category = categories.find((cat) => cat.id === option.category)
                if (!category) return null

                const Icon = category.icon

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start bg-transparent"
                    onClick={() => spendEmotionalUnit(option.category, option.amount, option.description)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded-full ${category.color} text-white flex-shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{option.description}</div>
                        <div className="text-xs text-gray-500">
                          -{option.amount} {category.name}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sending History */}
        {spendingHistory.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Today's Emotional Transactions</CardTitle>
              <CardDescription>Your spending history (most recent first)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {spendingHistory
                  .slice()
                  .reverse()
                  .map((event, index) => {
                    const category = categories.find((cat) => cat.id === event.category)
                    if (!category) return null

                    const Icon = category.icon

                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-1.5 rounded-full ${category.color} text-white`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{event.description}</div>
                          <div className="text-xs text-gray-500">
                            {event.time} • -{event.amount} {category.name}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}