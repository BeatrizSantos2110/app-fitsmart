"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Clock, Zap, Crown } from "lucide-react";
import { type User, updateSubscription, getTrialDaysRemaining } from "@/lib/auth";
import PaymentForm from "./payment-form";

interface SubscriptionSelectorProps {
  user: User;
  onSubscriptionComplete: (user: User) => void;
  onSkipToTrial: () => void;
}

export default function SubscriptionSelector({ user, onSubscriptionComplete, onSkipToTrial }: SubscriptionSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const trialDays = getTrialDaysRemaining(user);

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Plano Mensal',
      price: 19.90,
      period: 'mês',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Treinos personalizados ilimitados',
        'Plano alimentar adaptado',
        'Controle de hidratação',
        'Vídeos de execução',
        'Suporte prioritário',
        'Atualizações constantes'
      ]
    },
    {
      id: 'annual' as const,
      name: 'Plano Anual',
      price: 119.90,
      period: 'ano',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      badge: 'Mais Popular',
      savings: 'Economize R$ 118,90',
      features: [
        'Tudo do plano mensal',
        '50% de desconto',
        'Acesso vitalício a novos recursos',
        'Consultoria nutricional mensal',
        'Planos de treino exclusivos',
        'Comunidade VIP'
      ]
    }
  ];

  const handlePaymentSuccess = (paymentMethod: any) => {
    if (!selectedPlan) return;
    
    const updatedUser = updateSubscription(user, selectedPlan, paymentMethod);
    onSubscriptionComplete(updatedUser);
  };

  if (showPayment && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan)!;
    return (
      <PaymentForm
        plan={plan}
        onSuccess={handlePaymentSuccess}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm">
            Escolha seu plano
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Comece sua transformação agora
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Escolha o plano ideal para você ou experimente grátis por {trialDays} dias
          </p>
        </div>

        {/* Trial Option */}
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Teste Grátis por {trialDays} Dias
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Experimente todos os recursos sem compromisso. Após o período de teste, você pode escolher um plano ou cancelar.
                  </p>
                </div>
              </div>
              <Button
                onClick={onSkipToTrial}
                variant="outline"
                className="border-2 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 whitespace-nowrap"
              >
                Começar Teste Grátis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                  isSelected 
                    ? 'border-purple-500 dark:border-purple-400 shadow-2xl scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="space-y-4">
                  <div className={`bg-gradient-to-r ${plan.color} p-4 rounded-2xl w-fit`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        R$ {plan.price.toFixed(2)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/ {plan.period}</span>
                    </div>
                    {plan.savings && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                        {plan.savings}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                      setShowPayment(true);
                    }}
                    className={`w-full ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900'
                    } text-white`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Assinar Agora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guarantee */}
        <Card className="border-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              🔒 <strong>Garantia de 7 dias</strong> - Se não gostar, devolvemos seu dinheiro sem perguntas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
