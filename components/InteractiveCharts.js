'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity, RefreshCw } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const monthlyData = [
  { month: 'Jan', events: 4, budget: 2400, expenses: 2200 },
  { month: 'Feb', events: 3, budget: 1800, expenses: 1600 },
  { month: 'Mar', events: 6, budget: 3200, expenses: 2800 },
  { month: 'Apr', events: 8, budget: 4500, expenses: 4100 },
  { month: 'May', events: 5, budget: 2800, expenses: 2400 },
  { month: 'Jun', events: 7, budget: 3800, expenses: 3200 },
]

const categoryData = [
  { name: 'Community Service', value: 35, count: 8 },
  { name: 'Fundraising', value: 25, count: 5 },
  { name: 'Meetings', value: 20, count: 12 },
  { name: 'Social Events', value: 12, count: 3 },
  { name: 'Workshops', value: 8, count: 2 },
]

const budgetProgress = [
  { category: 'Community Service', used: 75, total: 100 },
  { category: 'Fundraising', used: 45, total: 80 },
  { category: 'Meetings', used: 90, total: 100 },
  { category: 'Social Events', used: 30, total: 60 },
]

export const InteractiveCharts = () => {
  const [activeChart, setActiveChart] = useState('overview')
  const [animatedValues, setAnimatedValues] = useState({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Animate counter values
    const totalEvents = 30
    const totalBudget = 18500
    const totalExpenses = 15800

    const animateValue = (key, targetValue, duration = 2000) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        const currentValue = Math.floor(targetValue * easeProgress)
        
        setAnimatedValues(prev => ({ ...prev, [key]: currentValue }))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    animateValue('events', totalEvents)
    animateValue('budget', totalBudget)
    animateValue('expenses', totalExpenses)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('budget') || entry.name.includes('expenses') ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const ProgressBar = ({ category, used, total }) => {
    const percentage = (used / total) * 100
    const [animatedWidth, setAnimatedWidth] = useState(0)

    useEffect(() => {
      const timer = setTimeout(() => setAnimatedWidth(percentage), 300)
      return () => clearTimeout(timer)
    }, [percentage])

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{category}</span>
          <span className="text-muted-foreground">${used}k / ${total}k</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>
        <div className="text-xs text-right text-muted-foreground">
          {percentage.toFixed(1)}% used
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Animated Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {animatedValues.events || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${(animatedValues.budget || 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              ${(animatedValues.expenses || 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>Interactive charts and insights</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Budget
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="events" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      className="cursor-pointer"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="#8884d8" 
                      fill="url(#budgetGradient)"
                      className="cursor-pointer"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#82ca9d" 
                      fill="url(#expenseGradient)"
                      className="cursor-pointer"
                    />
                    <defs>
                      <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Budget Utilization by Category</h3>
                {budgetProgress.map((item, index) => (
                  <ProgressBar 
                    key={index}
                    category={item.category}
                    used={item.used}
                    total={item.total}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}