"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Utensils, Droplets, Target, LogOut, Clock, Lock } from "lucide-react";
import AuthForm from "@/components/auth-form";
import QuizOnboarding from "@/components/quiz-onboarding";
import SubscriptionSelector from "@/components/subscription-selector";
import DashboardOverview from "@/components/dashboard-overview";
import WorkoutSection from "@/components/workout-section";
import NutritionSection from "@/components/nutrition-section";
import HydrationSection from "@/components/hydration-section";
import { getUserId, loadUserData, initializeUserData, resetDailyData, registerDailyActivity, saveUserData, type UserData } from "@/lib/storage";
import { getCurrentUser, logoutUser, markQuizComplete, canAccessApp, isTrialExpired, getTrialDaysRemaining, type User } from "@/lib/auth";

type AppState = 'auth' | 'quiz' | 'subscription' | 'app';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Verificar acesso periodicamente (a cada 30 segundos)
  useEffect(() => {
    if (!currentUser || appState !== 'app') return;

    const checkAccess = () => {
      if (!canAccessApp(currentUser)) {
        if (isTrialExpired(currentUser)) {
          // Trial expirou - redirecionar para assinatura
          setAppState('subscription');
        }
      }
    };

    // Verificar imediatamente
    checkAccess();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkAccess, 30000);

    return () => clearInterval(interval);
  }, [currentUser, appState]);

  useEffect(() => {
    // Verificar se há usuário logado
    const user = getCurrentUser();
    
    if (!user) {
      setAppState('auth');
      setIsLoading(false);
      return;
    }

    setCurrentUser(user);

    // Verificar se completou o quiz
    if (!user.hasCompletedQuiz) {
      setAppState('quiz');
      setIsLoading(false);
      return;
    }

    // Verificar se pode acessar o app
    if (!canAccessApp(user)) {
      // Se o trial expirou ou não tem assinatura ativa, mostrar tela de assinatura
      setAppState('subscription');
      setIsLoading(false);
      return;
    }

    // Carregar dados do usuário
    let data = loadUserData(user.id);
    
    if (data) {
      data = resetDailyData(data);
      // Registrar atividade do dia
      data = registerDailyActivity(data);
      saveUserData(data);
    }
    
    setUserData(data);
    setAppState('app');
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setAppState('quiz');
  };

  const handleQuizComplete = (profile: any) => {
    if (!currentUser) return;

    // Marcar quiz como completo
    const updatedUser = markQuizComplete(currentUser);
    setCurrentUser(updatedUser);

    // Inicializar dados do usuário
    const newUserData = initializeUserData(updatedUser.id, profile);
    setUserData(newUserData);

    // Ir para seleção de assinatura
    setAppState('subscription');
  };

  const handleSubscriptionComplete = (user: User) => {
    setCurrentUser(user);
    
    // Carregar dados do usuário
    let data = loadUserData(user.id);
    
    if (data) {
      data = resetDailyData(data);
      data = registerDailyActivity(data);
      saveUserData(data);
    }
    
    setUserData(data);
    setAppState('app');
  };

  const handleSkipToTrial = () => {
    if (!currentUser) return;
    
    // Verificar se ainda tem trial disponível
    if (canAccessApp(currentUser)) {
      setAppState('app');
    } else {
      // Trial expirado - não permitir pular
      alert('Seu período de teste gratuito expirou. Por favor, escolha um plano para continuar.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserData(null);
    setAppState('auth');
  };

  const updateUserData = (updatedData: UserData) => {
    setUserData(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de Autenticação
  if (appState === 'auth') {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  // Tela de Quiz
  if (appState === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Olá, {currentUser?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Vamos personalizar sua experiência no FitSmart
            </p>
          </div>
          <QuizOnboarding onComplete={handleQuizComplete} />
        </div>
      </div>
    );
  }

  // Tela de Seleção de Assinatura
  if (appState === 'subscription' && currentUser) {
    const trialExpired = isTrialExpired(currentUser);
    
    return (
      <SubscriptionSelector
        user={currentUser}
        onSubscriptionComplete={handleSubscriptionComplete}
        onSkipToTrial={handleSkipToTrial}
        isTrialExpired={trialExpired}
      />
    );
  }

  // App Principal
  if (appState === 'app' && userData && currentUser) {
    const trialDays = getTrialDaysRemaining(currentUser);
    const isOnTrial = currentUser.subscription.status === 'trial';

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    FitSmart
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Olá, {currentUser.name}!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isOnTrial && trialDays > 0 && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm px-3 py-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {trialDays} {trialDays === 1 ? 'dia' : 'dias'} de teste
                  </Badge>
                )}
                {currentUser.subscription.status === 'active' && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm px-3 py-1">
                    Plano {currentUser.subscription.plan === 'monthly' ? 'Mensal' : 'Anual'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Trial Expiring Warning */}
        {isOnTrial && trialDays <= 1 && trialDays > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm sm:text-base font-medium">
                ⚠️ Seu período de teste expira em {trialDays === 1 ? '1 dia' : 'menos de 1 dia'}! 
                <Button
                  variant="link"
                  className="text-white underline ml-2"
                  onClick={() => setAppState('subscription')}
                >
                  Assine agora
                </Button>
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-2 py-3 scrollbar-hide">
              {[
                { id: "dashboard", label: "Dashboard", icon: Target },
                { id: "workout", label: "Treinos", icon: Dumbbell },
                { id: "nutrition", label: "Nutrição", icon: Utensils },
                { id: "hydration", label: "Hidratação", icon: Droplets }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex-shrink-0 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeSection === "dashboard" && <DashboardOverview userData={userData} updateUserData={updateUserData} />}
          {activeSection === "workout" && <WorkoutSection userData={userData} updateUserData={updateUserData} />}
          {activeSection === "nutrition" && <NutritionSection userData={userData} updateUserData={updateUserData} />}
          {activeSection === "hydration" && <HydrationSection userData={userData} updateUserData={updateUserData} />}
        </main>
      </div>
    );
  }

  return null;
}
