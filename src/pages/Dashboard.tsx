import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Upload,
  MessageCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useTransactions, useMonthlyBalances } from '@/hooks/useSupabase';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: transactions = [] } = useTransactions();
  const { data: monthlyBalances = [] } = useMonthlyBalances();

  const kpiData = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() + 1 === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalRevenue = currentMonthTransactions
      .filter(t => t.type === 'receita')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalRevenue,
      totalExpenses,
      netBalance: totalRevenue - totalExpenses,
      totalTransactions: currentMonthTransactions.length
    };
  }, [transactions]);

  const cashFlowData = [
    { month: 'Jan', receita: 12000, despesa: 8000 },
    { month: 'Fev', receita: 14000, despesa: 9000 },
    { month: 'Mar', receita: 13500, despesa: 8500 },
    { month: 'Abr', receita: 16000, despesa: 10000 },
    { month: 'Mai', receita: kpiData.totalRevenue, despesa: kpiData.totalExpenses },
  ];

  const expensesByCategory = [
    { name: 'Alimentação', value: 2800, color: '#3B82F6' },
    { name: 'Transporte', value: 1200, color: '#8B5CF6' },
    { name: 'Moradia', value: 3500, color: '#10B981' },
    { name: 'Lazer', value: 800, color: '#F59E0B' },
    { name: 'Outros', value: 445, color: '#EF4444' },
  ];

  const dailyBalance = [
    { day: '1', balance: 150 },
    { day: '5', balance: -200 },
    { day: '10', balance: 300 },
    { day: '15', balance: -100 },
    { day: '20', balance: 450 },
    { day: '25', balance: 200 },
    { day: '30', balance: -150 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
            <p className="text-muted-foreground mt-1">Visão geral das suas finanças</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Link to="/chat">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Assistente IA
              </Button>
            </Link>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Importar Dados
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {kpiData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +12.5% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Despesa Total
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {kpiData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-red-600 mt-1">
                +8.2% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Líquido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {kpiData.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +18.7% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transações
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpiData.totalTransactions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa (6 meses)</CardTitle>
              <CardDescription>
                Evolução de receitas vs. despesas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Receitas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="despesa" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Despesas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>
                Distribuição dos gastos mensais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4">
                {expensesByCategory.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Balance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Balanço Diário (Últimos 30 dias)</CardTitle>
            <CardDescription>
              Saldo líquido por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyBalance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Bar 
                  dataKey="balance" 
                  fill="#3B82F6"
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
