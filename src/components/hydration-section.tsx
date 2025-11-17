"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, Minus, Bell, TrendingUp, Award, Clock } from "lucide-react";
import { saveUserData, getTodayDate, getTodayData, type UserData } from "@/lib/storage";

interface HydrationSectionProps {
  userData: UserData;
  updateUserData: (data: UserData) => void;
}

export default function HydrationSection({ userData, updateUserData }: HydrationSectionProps) {
  const todayData = getTodayData(userData);
  const [lastReminderTime, setLastReminderTime] = useState<Date | null>(null);

  const waterConsumed = todayData.hydration.consumed;
  const waterGoal = userData.profile?.dailyWater || 2500;
  const glassSize = 250;
  const progress = (waterConsumed / waterGoal) * 100;
  const remindersEnabled = userData.hydration.remindersEnabled;

  // Simulação de lembretes
  useEffect(() => {
    if (!remindersEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hoursSinceLastReminder = lastReminderTime 
        ? (now.getTime() - lastReminderTime.getTime()) / (1000 * 60 * 60)
        : 2;

      if (hoursSinceLastReminder >= 2 && waterConsumed < waterGoal) {
        setLastReminderTime(now);
      }
    }, 1000 * 60 * 30);

    return () => clearInterval(interval);
  }, [remindersEnabled, lastReminderTime, waterConsumed, waterGoal]);

  const addWater = (amount: number) => {
    const updatedData = { ...userData };
    updatedData.hydration.consumed += amount;
    
    const log = {
      id: Date.now(),
      amount,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: getTodayDate()
    };
    
    updatedData.hydration.log.push(log);
    saveUserData(updatedData);
    updateUserData(updatedData);
  };

  const removeWater = (amount: number) => {
    const updatedData = { ...userData };
    updatedData.hydration.consumed = Math.max(0, updatedData.hydration.consumed - amount);
    saveUserData(updatedData);
    updateUserData(updatedData);
  };

  const toggleReminders = () => {
    const updatedData = { ...userData };
    updatedData.hydration.remindersEnabled = !updatedData.hydration.remindersEnabled;
    saveUserData(updatedData);
    updateUserData(updatedData);
  };

  const getHydrationStatus = () => {
    if (progress >= 100) return { text: "Meta alcançada!", color: "text-green-600", emoji: "🎉" };
    if (progress >= 75) return { text: "Quase lá!", color: "text-blue-600", emoji: "💪" };
    if (progress >= 50) return { text: "No caminho certo", color: "text-cyan-600", emoji: "👍" };
    if (progress >= 25) return { text: "Continue bebendo", color: "text-yellow-600", emoji: "💧" };
    return { text: "Comece a se hidratar", color: "text-orange-600", emoji: "🚰" };
  };

  const status = getHydrationStatus();

  const getTimeBasedRecommendation = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 9) return "Comece o dia com um copo de água!";
    if (hour >= 9 && hour < 12) return "Mantenha-se hidratado durante a manhã";
    if (hour >= 12 && hour < 14) return "Beba água antes e depois do almoço";
    if (hour >= 14 && hour < 18) return "Hidrate-se durante a tarde";
    if (hour >= 18 && hour < 21) return "Não esqueça de beber água à noite";
    return "Hidratação é importante em qualquer hora!";
  };

  const getBenefits = () => [
    { icon: "🧠", title: "Melhora o foco", desc: "Aumenta concentração e clareza mental" },
    { icon: "💪", title: "Performance física", desc: "Melhora desempenho nos treinos" },
    { icon: "🔥", title: "Acelera metabolismo", desc: "Auxilia na queima de gordura" },
    { icon: "✨", title: "Pele saudável", desc: "Mantém a pele hidratada e radiante" },
    { icon: "🫀", title: "Saúde cardiovascular", desc: "Melhora circulação sanguínea" },
    { icon: "🎯", title: "Controle de apetite", desc: "Reduz fome e auxilia no emagrecimento" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Hidratação Diária</h2>
              <p className="text-blue-100 text-lg">
                {getTimeBasedRecommendation()}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Droplets className="w-16 h-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Progress Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <Droplets className="w-8 h-8 text-blue-600" />
                {waterConsumed}ml
              </CardTitle>
              <CardDescription className="text-lg mt-1">
                Meta diária: {waterGoal}ml
              </CardDescription>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${status.color}`}>
                {status.emoji} {Math.round(progress)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{status.text}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-4" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{Math.floor(waterConsumed / glassSize)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Copos bebidos</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
              <p className="text-2xl font-bold text-cyan-600">{Math.ceil((waterGoal - waterConsumed) / glassSize)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Copos restantes</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{Math.max(0, waterGoal - waterConsumed)}ml</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Faltam</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">{todayData.hydration.log.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Registros hoje</p>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Adicionar água:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { amount: 250, label: "1 Copo", icon: "🥤" },
                { amount: 500, label: "2 Copos", icon: "🥤🥤" },
                { amount: 750, label: "3 Copos", icon: "🥤🥤🥤" },
                { amount: 1000, label: "1 Litro", icon: "🍶" }
              ].map((option) => (
                <Button
                  key={option.amount}
                  onClick={() => addWater(option.amount)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-auto py-4 flex flex-col gap-1"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                  <span className="text-xs font-normal opacity-80">{option.amount}ml</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="flex gap-2">
            <Button
              onClick={() => removeWater(glassSize)}
              variant="outline"
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              disabled={waterConsumed === 0}
            >
              <Minus className="w-4 h-4 mr-2" />
              Remover {glassSize}ml
            </Button>
            <Button
              onClick={() => addWater(glassSize)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar {glassSize}ml
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reminders Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Lembretes de Hidratação
          </CardTitle>
          <CardDescription>
            Receba notificações para não esquecer de beber água
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Lembretes a cada 2 horas</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {remindersEnabled ? "Ativado" : "Desativado"}
                </p>
              </div>
            </div>
            <Button
              onClick={toggleReminders}
              variant={remindersEnabled ? "default" : "outline"}
              className={remindersEnabled ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
            >
              {remindersEnabled ? "Ativado" : "Ativar"}
            </Button>
          </div>
          
          {remindersEnabled && (
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <p className="text-sm text-purple-900 dark:text-purple-100">
                ✅ Você receberá lembretes carinhosos para se manter hidratado ao longo do dia!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hydration Log */}
      {todayData.hydration.log.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Histórico de Hoje
            </CardTitle>
            <CardDescription>Seus registros de hidratação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayData.hydration.log.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <Droplets className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{log.amount}ml</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{log.time}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-600">
                    {Math.floor(log.amount / glassSize)} {Math.floor(log.amount / glassSize) === 1 ? 'copo' : 'copos'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Benefícios da Hidratação
          </CardTitle>
          <CardDescription>Por que beber água é essencial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getBenefits().map((benefit, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{benefit.icon}</div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Card */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-4 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Hidratação = Resultados! 💧
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manter-se hidratado é fundamental para atingir seus objetivos de fitness. 
                A água acelera o metabolismo, melhora o desempenho nos treinos e ajuda na recuperação muscular!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
