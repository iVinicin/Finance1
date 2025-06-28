
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateMonthlyBalance } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';

interface MonthlyBalanceFormProps {
  onClose?: () => void;
}

const MonthlyBalanceForm: React.FC<MonthlyBalanceFormProps> = ({ onClose }) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    initial_balance: '',
  });

  const createMonthlyBalance = useCreateMonthlyBalance();
  const { toast } = useToast();

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.initial_balance) {
      toast({
        title: 'Erro',
        description: 'Preencha o saldo inicial',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createMonthlyBalance.mutateAsync({
        month: formData.month,
        year: formData.year,
        initial_balance: parseFloat(formData.initial_balance),
      });

      toast({
        title: 'Sucesso',
        description: 'Saldo mensal definido com sucesso!',
      });

      setFormData({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        initial_balance: '',
      });

      onClose?.();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao definir saldo mensal',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Definir Saldo Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Mês</Label>
            <Select 
              value={formData.month.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, month: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              min="2020"
              max="2030"
            />
          </div>

          <div>
            <Label htmlFor="initial_balance">Saldo Inicial</Label>
            <Input
              id="initial_balance"
              type="number"
              step="0.01"
              value={formData.initial_balance}
              onChange={(e) => setFormData(prev => ({ ...prev, initial_balance: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={createMonthlyBalance.isPending}>
              {createMonthlyBalance.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MonthlyBalanceForm;
