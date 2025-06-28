
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, useCreateTransaction } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TransactionFormProps {
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'despesa' as 'receita' | 'despesa',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
  });

  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTransaction.mutateAsync({
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category_id: formData.category_id || undefined,
        date: formData.date,
      });

      toast({
        title: 'Sucesso',
        description: 'Transação criada com sucesso!',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        type: 'despesa',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
      });

      onClose?.();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar transação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const filteredCategories = categories?.filter(cat => cat.type === formData.type) || [];

  return (
    <>
      <DialogTitle>Nova Transação</DialogTitle>
      <DialogDescription>
        Adicione uma nova transação financeira ao seu controle.
      </DialogDescription>
      
      <Card className="w-full border-0 shadow-none">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Supermercado"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'receita' | 'despesa') => 
                    setFormData(prev => ({ ...prev, type: value, category_id: '' }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Observações (opcional)"
                rows={3}
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={createTransaction.isPending}
              >
                {createTransaction.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
              {onClose && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 sm:flex-initial"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionForm;
