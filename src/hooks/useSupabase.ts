
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for transactions query');
        return [];
      }
      
      console.log('Fetching transactions for user:', user.id);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      console.log('Transactions fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useCategories = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for categories query');
        return [];
      }
      
      console.log('Fetching categories for user:', user.id);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      console.log('Categories fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useMonthlyBalances = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['monthly_balances', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for monthly balances query');
        return [];
      }
      
      console.log('Fetching monthly balances for user:', user.id);
      const { data, error } = await supabase
        .from('monthly_balances')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });
      
      if (error) {
        console.error('Error fetching monthly balances:', error);
        throw error;
      }
      console.log('Monthly balances fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (transaction: {
      title: string;
      description?: string;
      amount: number;
      type: 'receita' | 'despesa';
      category_id?: string;
      date: string;
    }) => {
      if (!user?.id) {
        console.error('No user available for transaction creation');
        throw new Error('User not authenticated');
      }
      
      console.log('Creating transaction for user:', user.id, transaction);
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      console.log('Transaction created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly_balances'] });
    },
  });
};

export const useCreateMonthlyBalance = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (balance: {
      month: number;
      year: number;
      initial_balance: number;
    }) => {
      if (!user?.id) {
        console.error('No user available for monthly balance creation');
        throw new Error('User not authenticated');
      }
      
      console.log('Creating monthly balance for user:', user.id, balance);
      const { data, error } = await supabase
        .from('monthly_balances')
        .insert({ ...balance, user_id: user.id })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating monthly balance:', error);
        throw error;
      }
      console.log('Monthly balance created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly_balances'] });
    },
  });
};
