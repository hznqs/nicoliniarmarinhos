import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, Tags, Users, MessageSquare, TrendingUp, Eye } from "lucide-react"
import { DashboardCharts } from "./_components/dashboard-charts"
import { subDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, leadCount, testimonialCount, logs, topProducts] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.lead.count({ where: { deletedAt: null } }),
    prisma.testimonial.count({ where: { deletedAt: null } }),
    prisma.log.findMany({ 
      orderBy: { createdAt: "desc" }, 
      take: 5,
      include: { user: true }
    }),
    prisma.product.findMany({
      where: { deletedAt: null, views: { gt: 0 } },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, name: true, views: true }
    })
  ])

  // Calcula os últimos 7 dias para o gráfico
  const today = new Date()
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i)
    return {
      date: d,
      name: format(d, "EEE", { locale: ptBR }),
      visualizacoes: 0,
      leads: 0,
      start: new Date(d.setHours(0, 0, 0, 0)),
      end: new Date(d.setHours(23, 59, 59, 999))
    }
  })

  // Buscar logs e leads dos últimos 7 dias para popular o gráfico
  const sevenDaysAgo = days[0].start
  
  const [logs7Days, leads7Days] = await Promise.all([
    prisma.log.findMany({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.findMany({ where: { createdAt: { gte: sevenDaysAgo } } })
  ])

  // Preencher os dados
  const chartData = days.map(day => {
    const leadsNoDia = leads7Days.filter(l => l.createdAt >= day.start && l.createdAt <= day.end).length
    const logsNoDia = logs7Days.filter(l => l.createdAt >= day.start && l.createdAt <= day.end).length
    return {
      name: day.name.charAt(0).toUpperCase() + day.name.slice(1),
      visualizacoes: logsNoDia, // Utilizando logs/atividades como "engajamento de sistema" temporário
      leads: leadsNoDia,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Visão geral do seu sistema.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground">Ativas no site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadCount}</div>
            <p className="text-xs text-muted-foreground">Contatos recebidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depoimentos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonialCount}</div>
            <p className="text-xs text-muted-foreground">Recebidos de clientes</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Gráfico */}
        <DashboardCharts data={chartData} />
        
        {/* Atividades Recentes */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Ações feitas no sistema.</CardDescription>
          </CardHeader>
          <CardContent className="border-t">
            <div className="space-y-6 mt-4">
              {logs.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-gray-500">
                  Nenhuma atividade recente.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {log.user?.name || "Usuário"} <span className="text-muted-foreground font-normal">({log.action})</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.createdAt.toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
        {/* Produtos Mais Procurados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Produtos Mais Procurados
            </CardTitle>
            <CardDescription>Itens com mais acessos no site.</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="flex h-[150px] items-center justify-center text-sm text-gray-500">
                Ainda não há visualizações.
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                {topProducts.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-muted-foreground w-4">{idx + 1}º</span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground bg-surface-container px-2.5 py-0.5 rounded-full text-sm">
                      <Eye className="w-3.5 h-3.5" />
                      {p.views} acessos
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
