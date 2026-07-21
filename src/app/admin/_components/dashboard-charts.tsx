"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface DashboardChartsProps {
  data: {
    name: string
    visualizacoes: number
    leads: number
  }[]
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <Card className="col-span-1 lg:col-span-4 shadow-sm border-border">
      <CardHeader>
        <CardTitle>Engajamento</CardTitle>
        <CardDescription>
          Atividades no sistema x Leads gerados nos últimos 7 dias.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`} 
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} 
              />
              <Bar 
                dataKey="visualizacoes" 
                name="Atividades"
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                dataKey="leads" 
                name="Leads"
                fill="var(--color-tertiary)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
