import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estado do formulário de perfil
  // Corrigido: usar user?.user_metadata?.full_name para o nome
  const [name, setName] = useState(user?.user_metadata?.full_name || ''); 
  const [email, setEmail] = useState(user?.email || ''); 
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Estado do formulário de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Estado de exclusão da conta
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    // Simular chamada da API. Em uma aplicação real, você atualizaria os metadados do usuário no Supabase aqui.
    // Exemplo: await supabase.auth.updateUser({ data: { full_name: name } });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram atualizadas com sucesso.",
    });
    
    setIsUpdatingProfile(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    
    // Simular chamada da API. Em uma aplicação real, você atualizaria a senha no Supabase aqui.
    // Exemplo: await supabase.auth.updateUser({ password: newPassword });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Senha alterada!",
      description: "Sua senha foi alterada com sucesso.",
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsUpdatingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETAR') {
      toast({
        title: "Erro",
        description: "Digite 'DELETAR' para confirmar a exclusão da conta.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeletingAccount(true);
    
    // Simular chamada da API. Em uma aplicação real, você deletaria o usuário no Supabase aqui.
    // O Supabase geralmente lida com a exclusão em cascata em perfis se o RLS permitir.
    // await supabase.auth.admin.deleteUser(user.id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Conta deletada",
      description: "Sua conta foi deletada permanentemente.",
    });
    
    // Em uma aplicação real, isso redirecionaria para a página inicial e limparia a autenticação
    setIsDeletingAccount(false);
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Conta</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e preferências</p>
        </div>

        {/* Profile Settings */}
        <Card className="shadow-financial border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informações do Perfil</span>
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUpdatingProfile}
                className="gradient-primary text-white border-0 hover:opacity-90"
              >
                {isUpdatingProfile ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Atualizando...</span>
                  </div>
                ) : (
                  'Atualizar Perfil'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="shadow-financial border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Alterar Senha</span>
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUpdatingPassword}
                className="gradient-primary text-white border-0 hover:opacity-90"
              >
                {isUpdatingPassword ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Alterando...</span>
                  </div>
                ) : (
                  'Alterar Senha'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="shadow-financial border-0 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span>Zona de Perigo</span>
            </CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam permanentemente sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> A exclusão da conta é permanente e não pode ser desfeita. 
                Todos os seus dados financeiros serão perdidos para sempre.
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Deletar Conta</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Para confirmar a exclusão, digite <strong>DELETAR</strong> no campo abaixo:
                </p>
                
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Digite DELETAR para confirmar"
                    className="max-w-xs"
                  />
                  
                  <Button 
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount || deleteConfirmation !== 'DELETAR'}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    {isDeletingAccount ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deletando...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Deletar Conta Permanentemente</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
