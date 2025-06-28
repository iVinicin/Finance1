
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useSupabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { data: transactions = [] } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Monthly data for the last 6 months
  const monthlyData = React.useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        receitas: income,
        despesas: expenses,
        saldo: income - expenses
      });
    }
    
    return months;
  }, [transactions]);

  // Category breakdown
  const categoryData = React.useMemo(() => {
    const categories = transactions.reduce((acc, t) => {
      if (t.categories && t.type === 'despesa') {
        const categoryName = t.categories.name;
        acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [transactions]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];

  // Summary stats
  const totalIncome = transactions.filter(t => t.type === 'receita').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'despesa').reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Análises</h1>
          <p className="text-muted-foreground mt-1">
            Visualize suas finanças em gráficos detalhados
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Nenhuma despesa por categoria encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>Maiores Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.length > 0 ? (
                  categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="font-bold text-red-600">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhuma categoria de despesa encontrada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Health Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Saúde Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">Taxa de Poupança</h3>
                <p className={`text-2xl font-bold mt-2 ${
                  balance > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalIncome > 0 ? `${((balance / totalIncome) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">Transações</h3>
                <p className="text-2xl font-bold mt-2">{transactions.length}</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">Gasto Médio</h3>
                <p className="text-2xl font-bold mt-2 text-red-600">
                  {transactions.filter(t => t.type === 'despesa').length > 0 
                    ? formatCurrency(totalExpenses / transactions.filter(t => t.type === 'despesa').length)
                    : 'R$ 0,00'
                  }
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">Receita Média</h3>
                <p className="text-2xl font-bold mt-2 text-green-600">
                  {transactions.filter(t => t.type === 'receita').length > 0 
                    ? formatCurrency(totalIncome / transactions.filter(t => t.type === 'receita').length)
                    : 'R$ 0,00'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
