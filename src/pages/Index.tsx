
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Shield, 
  Zap, 
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Upload Simples',
      description: 'Importe seus dados financeiros via CSV de forma rápida e segura'
    },
    {
      icon: BarChart3,
      title: 'Dashboards Visuais',
      description: 'Visualize suas finanças com gráficos interativos e KPIs em tempo real'
    },
    {
      icon: TrendingUp,
      title: 'Análise de Tendências',
      description: 'Identifique padrões e tendências nos seus gastos e receitas'
    },
    {
      icon: PieChart,
      title: 'Categorização',
      description: 'Organize e analise seus gastos por categorias automaticamente'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados são protegidos com criptografia de ponta a ponta'
    },
    {
      icon: Zap,
      title: 'Insights Instantâneos',
      description: 'Receba relatórios e insights sobre sua saúde financeira'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Finanlytics Dash</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary text-white border-0 hover:opacity-90">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme seus
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}dados financeiros{' '}
            </span>
            em insights poderosos
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Analise suas finanças com dashboards interativos, identifique tendências e tome decisões mais inteligentes. 
            Simples, rápido e seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 px-8 py-4 text-lg">
                Começar Análise Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tudo que você precisa para analisar suas finanças
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa para transformar seus dados financeiros em decisões estratégicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-financial transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass-effect border-0 shadow-financial">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para revolucionar sua análise financeira?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já transformaram sua relação com o dinheiro. 
              Comece sua análise em menos de 2 minutos.
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 px-12 py-4 text-lg">
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Finanlytics Dash</span>
          </div>
          <p className="text-gray-600">
            © 2024 Finanlytics Dash. Transformando dados em decisões inteligentes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
