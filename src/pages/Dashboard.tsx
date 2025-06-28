
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTransactions, useMonthlyBalances } from '@/hooks/useSupabase';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import MonthlyBalanceForm from '@/components/MonthlyBalanceForm';

const Dashboard = () => {
  const { data: transactions = [] } = useTransactions();
  const { data: monthlyBalances = [] } = useMonthlyBalances();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBalanceForm, setShowBalanceForm] = useState(false);

  // Calculate totals
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() + 1 === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Visão geral das suas finanças</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            <Dialog open={showBalanceForm} onOpenChange={setShowBalanceForm}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  Saldo Mensal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <MonthlyBalanceForm onClose={() => setShowBalanceForm(false)} />
              </DialogContent>
            </Dialog>
            
            <Dialog open={showTransactionForm} onOpenChange={setShowTransactionForm}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <TransactionForm onClose={() => setShowTransactionForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Mês atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Mês atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Mês atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transações</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {currentMonthTransactions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Comece adicionando sua primeira transação!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {transaction.categories && (
                          <span className="text-lg">{transaction.categories.icon}</span>
                        )}
                        <div>
                          <p className="font-medium">{transaction.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                            {transaction.categories && ` • ${transaction.categories.name}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'receita' ? '+' : '-'}
                        {formatCurrency(Math.abs(Number(transaction.amount)))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
