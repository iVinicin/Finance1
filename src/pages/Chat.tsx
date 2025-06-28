
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useTransactions } from '@/hooks/useSupabase';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente financeiro. Posso ajudá-lo a analisar suas transações, criar orçamentos e dar dicas para melhorar sua saúde financeira. Como posso ajudá-lo hoje?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: transactions = [] } = useTransactions();

  const generateFinancialResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Calculate basic stats
    const totalTransactions = transactions.length;
    const income = transactions.filter(t => t.type === 'receita').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'despesa').reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = income - expenses;
    
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    };

    if (lowerMessage.includes('saldo') || lowerMessage.includes('balanço')) {
      return `Seu saldo atual é de ${formatCurrency(balance)}. Você tem ${formatCurrency(income)} em receitas e ${formatCurrency(expenses)} em despesas registradas.`;
    }
    
    if (lowerMessage.includes('receita') || lowerMessage.includes('ganho')) {
      return `Suas receitas totais são de ${formatCurrency(income)}. ${income > expenses ? 'Parabéns! Você está gastando menos do que ganha.' : 'Atenção: suas despesas estão maiores que suas receitas.'}`;
    }
    
    if (lowerMessage.includes('despesa') || lowerMessage.includes('gasto')) {
      return `Suas despesas totais são de ${formatCurrency(expenses)}. ${expenses > income ? 'Recomendo revisar seus gastos para equilibrar o orçamento.' : 'Seus gastos estão controlados!'}`;
    }
    
    if (lowerMessage.includes('dica') || lowerMessage.includes('conselho')) {
      const tips = [
        'Registre todas as suas transações para ter controle total.',
        'Defina metas mensais de gastos por categoria.',
        'Sempre reserve uma parte da renda para emergências.',
        'Revise seus gastos mensalmente para identificar padrões.',
        'Considere automatizar suas economias.'
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (lowerMessage.includes('categoria')) {
      const categories = transactions.reduce((acc, t) => {
        if (t.categories) {
          acc[t.categories.name] = (acc[t.categories.name] || 0) + Number(t.amount);
        }
        return acc;
      }, {} as Record<string, number>);
      
      const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
      if (topCategory) {
        return `Sua categoria com mais gastos é "${topCategory[0]}" com ${formatCurrency(topCategory[1])}.`;
      }
    }
    
    if (totalTransactions === 0) {
      return 'Você ainda não tem transações registradas. Comece adicionando suas receitas e despesas para que eu possa ajudá-lo melhor!';
    }
    
    return `Você tem ${totalTransactions} transações registradas. Seu saldo atual é ${formatCurrency(balance)}. Posso ajudá-lo com análises específicas, dicas de economia ou planejamento financeiro. O que gostaria de saber?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateFinancialResponse(inputValue),
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Chat Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Converse com seu assistente de IA sobre suas finanças
          </p>
        </div>

        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Assistente Financeiro</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[80%] space-x-3 ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <p className="text-sm">Digitando...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta sobre finanças..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sugestões de Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Qual é meu saldo atual?',
                'Quanto gastei este mês?',
                'Qual categoria tem mais gastos?',
                'Me dê uma dica de economia',
                'Como posso melhorar minhas finanças?',
                'Minhas receitas estão boas?'
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="text-left justify-start h-auto p-3 text-sm"
                  onClick={() => setInputValue(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
