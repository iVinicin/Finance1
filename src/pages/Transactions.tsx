
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, PiggyBank, FileText } from 'lucide-react';
import { useState } from 'react';
import { useTransactions, useCategories } from '@/hooks/useSupabase';
import TransactionForm from '@/components/TransactionForm';
import MonthlyBalanceForm from '@/components/MonthlyBalanceForm';
import { useToast } from '@/hooks/use-toast';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBalanceForm, setShowBalanceForm] = useState(false);

  const { data: transactions = [] } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category_id === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCSVImport = () => {
    toast({
      title: 'Funcionalidade em Desenvolvimento',
      description: 'A importação de CSV será implementada em breve!',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Transações</h1>
            <p className="text-muted-foreground mt-1">Gerencie todas as suas transações financeiras</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
            <Dialog open={showBalanceForm} onOpenChange={setShowBalanceForm}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <PiggyBank className="w-4 h-4 mr-2" />
                  Saldo Mensal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <MonthlyBalanceForm onClose={() => setShowBalanceForm(false)} />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={handleCSVImport}
              className="w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
            
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

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Descrição ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterType('all');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Todas as Transações ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-sm">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.title}</div>
                          {transaction.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {transaction.description}
                            </div>
                          )}
                          {/* Show category and type on mobile */}
                          <div className="flex items-center space-x-2 mt-1 sm:hidden">
                            {transaction.categories && (
                              <Badge variant="secondary" className="text-xs">
                                {transaction.categories.icon} {transaction.categories.name}
                              </Badge>
                            )}
                            <Badge 
                              variant={transaction.type === 'receita' ? 'default' : 'destructive'}
                              className={`text-xs ${transaction.type === 'receita' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                            >
                              {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {transaction.categories && (
                          <Badge variant="secondary">
                            {transaction.categories.icon} {transaction.categories.name}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge 
                          variant={transaction.type === 'receita' ? 'default' : 'destructive'}
                          className={transaction.type === 'receita' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="text-right">
                          {transaction.type === 'receita' ? '+' : '-'}
                          {formatCurrency(Math.abs(Number(transaction.amount)))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {transactions.length === 0 
                    ? 'Nenhuma transação encontrada. Comece adicionando sua primeira transação!'
                    : 'Nenhuma transação encontrada com os filtros aplicados.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
