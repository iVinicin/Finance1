
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const Analytics = () => {
  const [selectedCategory, setSelectedCategory] = useState('Alimentação');

  // Mock data - in real app, this would come from API
  const categories = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 
    'Educação', 'Assinaturas', 'Outros'
  ];

  const categoryData = {
    'Alimentação': [
      { month: 'Jan', amount: 800 },
      { month: 'Fev', amount: 950 },
      { month: 'Mar', amount: 780 },
      { month: 'Abr', amount: 1200 },
      { month: 'Mai', amount: 1100 },
      { month: 'Jun', amount: 1350 },
    ],
    'Transporte': [
      { month: 'Jan', amount: 300 },
      { month: 'Fev', amount: 420 },
      { month: 'Mar', amount: 380 },
      { month: 'Abr', amount: 450 },
      { month: 'Mai', amount: 520 },
      { month: 'Jun', amount: 580 },
    ],
    'Moradia': [
      { month: 'Jan', amount: 1500 },
      { month: 'Fev', amount: 1500 },
      { month: 'Mar', amount: 1650 },
      { month: 'Abr', amount: 1500 },
      { month: 'Mai', amount: 1700 },
      { month: 'Jun', amount: 1750 },
    ],
  };

  const insights = [
    {
      category: 'Alimentação',
      trend: 'up',
      percentage: 22.7,
      description: 'Seus gastos com alimentação aumentaram 22.7% em relação ao mês anterior.',
      suggestion: 'Considere planejar suas refeições e fazer compras em atacado para economizar.',
      severity: 'warning'
    },
    {
      category: 'Transporte',
      trend: 'up',
      percentage: 11.5,
      description: 'Gastos com transporte subiram 11.5% no último mês.',
      suggestion: 'Avalie opções de transporte público ou carona compartilhada.',
      severity: 'info'
    },
    {
      category: 'Moradia',
      trend: 'up',
      percentage: 2.9,
      description: 'Pequeno aumento de 2.9% nos gastos com moradia.',
      suggestion: 'Aumento normal, continue monitorando.',
      severity: 'success'
    }
  ];

  const currentData = categoryData[selectedCategory] || categoryData['Alimentação'];
  const currentInsight = insights.find(insight => insight.category === selectedCategory) || insights[0];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'text-warning';
      case 'info': return 'text-info';
      case 'success': return 'text-success';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'info': return 'bg-info/10 border-info/20';
      case 'success': return 'bg-success/10 border-success/20';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análise de Categorias</h1>
          <p className="text-gray-600 mt-1">Insights detalhados sobre seus gastos por categoria</p>
        </div>

        {/* Category Selector */}
        <Card className="shadow-financial border-0">
          <CardHeader>
            <CardTitle>Selecionar Categoria para Análise</CardTitle>
            <CardDescription>
              Escolha uma categoria para ver a evolução dos gastos e insights personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Evolution Chart */}
        <Card className="shadow-financial border-0">
          <CardHeader>
            <CardTitle>Evolução de Gastos - {selectedCategory}</CardTitle>
            <CardDescription>
              Histórico dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Category Insight */}
          <Card className={`shadow-financial border-0 ${getSeverityBg(currentInsight.severity)}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentInsight.trend === 'up' ? (
                  <TrendingUp className={`w-5 h-5 ${getSeverityColor(currentInsight.severity)}`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 ${getSeverityColor(currentInsight.severity)}`} />
                )}
                <span>Insight - {currentInsight.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(currentInsight.severity)}>
                  {currentInsight.trend === 'up' ? '+' : ''}{currentInsight.percentage}%
                </Badge>
                <span className="text-sm text-gray-600">vs. mês anterior</span>
              </div>
              
              <p className="text-gray-700">
                {currentInsight.description}
              </p>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">💡 Sugestão:</h4>
                <p className="text-sm text-gray-700">
                  {currentInsight.suggestion}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* All Insights Summary */}
          <Card className="shadow-financial border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-info" />
                <span>Resumo de Insights</span>
              </CardTitle>
              <CardDescription>
                Principais tendências identificadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-gray-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{insight.category}</span>
                      <Badge 
                        className={`${getSeverityColor(insight.severity)} text-xs`}
                        variant="secondary"
                      >
                        {insight.trend === 'up' ? '+' : ''}{insight.percentage}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-financial border-0">
            <CardHeader>
              <CardTitle className="text-lg">Maior Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ 1.750,00</div>
              <p className="text-sm text-gray-600">Moradia - Junho</p>
            </CardContent>
          </Card>

          <Card className="shadow-financial border-0">
            <CardHeader>
              <CardTitle className="text-lg">Maior Variação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">+22.7%</div>
              <p className="text-sm text-gray-600">Alimentação</p>
            </CardContent>
          </Card>

          <Card className="shadow-financial border-0">
            <CardHeader>
              <CardTitle className="text-lg">Mais Estável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+2.9%</div>
              <p className="text-sm text-gray-600">Moradia</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
