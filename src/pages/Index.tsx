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
  ArrowRight,
  Star,
  Users,
  CheckCircle
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

  const benefits = [
    'Controle total das suas finanças',
    'Relatórios detalhados e personalizados',
    'Interface intuitiva e moderna',
    'Sincronização em tempo real',
    'Suporte 24/7'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Finanlytics Dash</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-400">Avaliado por mais de 10.000 usuários</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transforme seus
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}dados financeiros{' '}
            </span>
            em insights poderosos
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Analise suas finanças com dashboards interativos, identifique tendências e tome decisões mais inteligentes. 
            Simples, rápido e seguro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg shadow-xl">
                Começar Análise Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                Já tenho conta
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>+10.000 usuários ativos</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>R$ 50M+ analisados</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>100% seguro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tudo que você precisa para analisar suas finanças
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Uma plataforma completa para transformar seus dados financeiros em decisões estratégicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Por que escolher o Finanlytics Dash?
            </h3>
            <p className="text-lg text-gray-300 mb-8">
              Nossa plataforma oferece as ferramentas mais avançadas para análise financeira, 
              com uma interface intuitiva que qualquer pessoa pode usar.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-gray-300 mb-4">Taxa de satisfação</div>
                <div className="text-2xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300 mb-4">Suporte disponível</div>
                <div className="text-2xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300">Dados seguros</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para revolucionar sua análise financeira?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já transformaram sua relação com o dinheiro. 
              Comece sua análise em menos de 2 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 px-12 py-4 text-lg shadow-xl">
                  Começar Agora - É Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                Ver Demonstração
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-800 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Finanlytics Dash</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Transformando dados financeiros em decisões inteligentes. 
              A plataforma mais completa para análise financeira pessoal e empresarial.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comunidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 Finanlytics Dash. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;