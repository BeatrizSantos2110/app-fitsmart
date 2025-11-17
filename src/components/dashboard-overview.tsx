"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Flame, 
  Dumbbell, 
  Utensils, 
  Droplets, 
  TrendingUp, 
  Award,
  Activity,
  Heart
} from "lucide-react";
import { getTodayData, calculateConsecutiveStreak, type UserData } from "@/lib/storage";

interface DashboardOverviewProps {
  userData: UserData;
  updateUserData: (data: UserData) => void;
}

export default function DashboardOverview({ userData }: DashboardOverviewProps) {
  const todayData = getTodayData(userData);
  
  // Calcular estatísticas do dia
  const totalCaloriesConsumed = todayData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalCaloriesBurned = todayData.workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
  const waterConsumed = todayData.hydration.consumed;
  const weeklyWorkoutsCompleted = userData.workouts.completed.length;

  const dailyCalorieGoal = userData.profile?.dailyCalories || 2000;
  const waterGoal = userData.profile?.dailyWater || 2500;
  const weeklyWorkoutGoal = userData.profile?.weeklyWorkouts || 3;

  const workoutProgress = (weeklyWorkoutsCompleted / weeklyWorkoutGoal) * 100;
  const calorieProgress = (totalCaloriesConsumed / dailyCalorieGoal) * 100;
  const waterProgress = (waterConsumed / waterGoal) * 100;

  // Calcular sequência de dias consecutivos de uso do app
  const currentStreak = calculateConsecutiveStreak(userData);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Olá, {userData.profile?.name || 'Atleta'}! 👋
              </h2>
              <p className="text-purple-100 text-lg">
                Você está indo muito bem! Continue assim.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Award className="w-16 h-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-600 text-white">Hoje</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Calorias Queimadas</p>
            <p className="text-3xl font-bold text-orange-600">{totalCaloriesBurned}</p>
            <p className="text-xs text-gray-500 mt-1">Meta: {dailyCalorieGoal} cal</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white">Hoje</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Água Consumida</p>
            <p className="text-3xl font-bold text-blue-600">{waterConsumed}ml</p>
            <p className="text-xs text-gray-500 mt-1">Meta: {waterGoal}ml</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Dumbbell className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-600 text-white">Semana</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Treinos Completos</p>
            <p className="text-3xl font-bold text-purple-600">{weeklyWorkoutsCompleted}/{weeklyWorkoutGoal}</p>
            <p className="text-xs text-gray-500 mt-1">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-600 text-white">Sequência</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dias Consecutivos</p>
            <p className="text-3xl font-bold text-green-600">{currentStreak} 🔥</p>
            <p className="text-xs text-gray-500 mt-1">Continue assim!</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-600" />
              Progresso de Treinos
            </CardTitle>
            <CardDescription>Meta semanal de treinos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Treinos desta semana</span>
                <span className="font-semibold">{weeklyWorkoutsCompleted} de {weeklyWorkoutGoal}</span>
              </div>
              <Progress value={workoutProgress} className="h-3" />
              <p className="text-xs text-gray-500">
                {workoutProgress >= 100 
                  ? "🎉 Meta semanal alcançada!" 
                  : `Faltam ${weeklyWorkoutGoal - weeklyWorkoutsCompleted} treinos para completar a meta`
                }
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{weeklyWorkoutsCompleted}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Completos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{totalCaloriesBurned}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Calorias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{Math.round(workoutProgress)}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              Progresso Nutricional
            </CardTitle>
            <CardDescription>Balanço calórico do dia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Calorias consumidas</span>
                <span className="font-semibold">{totalCaloriesConsumed} de {dailyCalorieGoal}</span>
              </div>
              <Progress value={calorieProgress} className="h-3" />
              <p className="text-xs text-gray-500">
                {calorieProgress >= 100 
                  ? "⚠️ Meta calórica atingida" 
                  : `Restam ${dailyCalorieGoal - totalCaloriesConsumed} calorias disponíveis`
                }
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalCaloriesConsumed}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Consumidas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{totalCaloriesBurned}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Queimadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {totalCaloriesConsumed - totalCaloriesBurned}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Líquido</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hydration Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Hidratação Diária
          </CardTitle>
          <CardDescription>Meta de consumo de água</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Água consumida hoje</span>
              <span className="font-semibold">{waterConsumed}ml de {waterGoal}ml</span>
            </div>
            <Progress value={waterProgress} className="h-3" />
            <p className="text-xs text-gray-500">
              {waterProgress >= 100 
                ? "💧 Meta de hidratação alcançada!" 
                : `Faltam ${waterGoal - waterConsumed}ml para completar a meta`
              }
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{waterConsumed}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Consumido</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-600">{waterGoal}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Meta</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{Math.round(waterProgress)}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{Math.floor(waterConsumed / 250)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Copos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Seu Perfil
          </CardTitle>
          <CardDescription>Informações personalizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Objetivo</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.profile?.goal === "lose" && "Perder peso"}
                {userData.profile?.goal === "gain" && "Ganhar massa"}
                {userData.profile?.goal === "maintain" && "Manter peso"}
                {userData.profile?.goal === "tone" && "Tonificar"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Nível de Atividade</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.profile?.activityLevel === "sedentary" && "Sedentário"}
                {userData.profile?.activityLevel === "light" && "Levemente ativo"}
                {userData.profile?.activityLevel === "moderate" && "Moderadamente ativo"}
                {userData.profile?.activityLevel === "active" && "Muito ativo"}
                {userData.profile?.activityLevel === "veryActive" && "Extremamente ativo"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Local de Treino</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.profile?.workoutLocation === "home" && "Em casa"}
                {userData.profile?.workoutLocation === "gym" && "Academia"}
                {userData.profile?.workoutLocation === "both" && "Ambos"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Meta Calórica</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.profile?.dailyCalories || 2000} cal/dia
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Meta de Água</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.profile?.dailyWater || 2500}ml/dia
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Treinos Semanais</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.profile?.weeklyWorkouts || 3}x por semana
              </p>
            </div>
          </div>

          {userData.profile?.dietaryRestrictions?.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Restrições Alimentares</p>
              <div className="flex flex-wrap gap-2">
                {userData.profile.dietaryRestrictions.map((restriction: string) => (
                  <Badge key={restriction} className="bg-green-600 text-white">
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivational Card */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Continue assim! 💪
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStreak > 0 
                  ? `Você está ${currentStreak} dias consecutivos mantendo sua rotina. Cada dia é uma vitória rumo aos seus objetivos!`
                  : "Comece hoje sua jornada de transformação! Cada passo conta."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
