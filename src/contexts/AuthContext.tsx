import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>; // Adicionado 'name'
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user && (event === 'SIGNED_UP' || event === 'SIGNED_IN')) {
          try {
            await supabase.rpc('create_default_categories', {
              user_uuid: session.user.id
            });
            console.log('Default categories created for user:', session.user.id);
          } catch (error) {
            console.error('Error creating default categories:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Função signUp atualizada para incluir o nome nos metadados do usuário
  const signUp = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        data: {
          full_name: name // Passa o nome como user_metadata
        }
      } 
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
