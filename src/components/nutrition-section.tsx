"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Utensils,
  Apple,
  Coffee,
  Pizza,
  Salad,
  ChefHat,
  Clock,
  Flame
} from "lucide-react";
import { saveUserData, getTodayDate, getTodayData, type UserData } from "@/lib/storage";

interface NutritionSectionProps {
  userData: UserData;
  updateUserData: (data: UserData) => void;
}

export default function NutritionSection({ userData, updateUserData }: NutritionSectionProps) {
  const todayData = getTodayData(userData);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    time: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    items: ""
  });

  const dailyCalorieGoal = userData.profile?.dailyCalories || 2000;
  const proteinGoal = userData.profile?.proteinGoal || 150;
  const carbsGoal = userData.profile?.carbsGoal || 200;
  const fatsGoal = userData.profile?.fatsGoal || 65;

  const totalCalories = todayData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todayData.meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = todayData.meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = todayData.meals.reduce((sum, meal) => sum + meal.fats, 0);

  const calorieProgress = (totalCalories / dailyCalorieGoal) * 100;
  const proteinProgress = (totalProtein / proteinGoal) * 100;
  const carbsProgress = (totalCarbs / carbsGoal) * 100;
  const fatsProgress = (totalFats / fatsGoal) * 100;

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.time && newMeal.calories && newMeal.protein && newMeal.carbs && newMeal.fats) {
      const updatedData = { ...userData };
      
      const meal = {
        id: Date.now(),
        name: newMeal.name,
        time: newMeal.time,
        calories: parseInt(newMeal.calories),
        protein: parseInt(newMeal.protein),
        carbs: parseInt(newMeal.carbs),
        fats: parseInt(newMeal.fats),
        items: newMeal.items.split(",").map(item => item.trim()),
        date: getTodayDate()
      };
      
      updatedData.nutrition.meals.push(meal);
      saveUserData(updatedData);
      updateUserData(updatedData);
      
      setNewMeal({ name: "", time: "", calories: "", protein: "", carbs: "", fats: "", items: "" });
      setShowAddMeal(false);
    }
  };

  const handleDeleteMeal = (id: number) => {
    const updatedData = { ...userData };
    updatedData.nutrition.meals = updatedData.nutrition.meals.filter(meal => meal.id !== id);
    saveUserData(updatedData);
    updateUserData(updatedData);
  };

  const getMealIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("café") || lowerName.includes("manhã")) return Coffee;
    if (lowerName.includes("almoço")) return Utensils;
    if (lowerName.includes("lanche")) return Apple;
    if (lowerName.includes("jantar")) return Pizza;
    return Salad;
  };

  // Sugestões de refeições baseadas nas restrições
  const getMealSuggestions = () => {
    const restrictions = userData.profile?.dietaryRestrictions || [];
    const allergies = userData.profile?.allergies || [];
    
    let suggestions = [];

    // Café da manhã
    if (!restrictions.includes("Intolerância à lactose") && !allergies.includes("Leite e derivados")) {
      suggestions.push({
        meal: "Café da manhã",
        option: "Iogurte grego com granola e frutas vermelhas",
        calories: 350,
        suitable: true
      });
    }
    
    if (!restrictions.includes("Intolerância ao glúten") && !allergies.includes("Ovos")) {
      suggestions.push({
        meal: "Café da manhã",
        option: "Ovos mexidos com pão integral e abacate",
        calories: 420,
        suitable: true
      });
    }

    if (restrictions.includes("Vegano") || restrictions.includes("Vegetariano")) {
      suggestions.push({
        meal: "Café da manhã",
        option: "Smoothie de banana com aveia e pasta de amendoim",
        calories: 380,
        suitable: true
      });
    }

    // Almoço
    if (!restrictions.includes("Vegetariano") && !restrictions.includes("Vegano")) {
      suggestions.push({
        meal: "Almoço",
        option: "Frango grelhado com arroz integral e legumes",
        calories: 650,
        suitable: true
      });
    }

    if (restrictions.includes("Vegetariano")) {
      suggestions.push({
        meal: "Almoço",
        option: "Quinoa com grão de bico, tomate e pepino",
        calories: 580,
        suitable: true
      });
    }

    if (restrictions.includes("Vegano")) {
      suggestions.push({
        meal: "Almoço",
        option: "Bowl vegano com tofu, arroz integral e vegetais",
        calories: 600,
        suitable: true
      });
    }

    // Jantar
    if (!allergies.includes("Peixe") && !restrictions.includes("Vegetariano")) {
      suggestions.push({
        meal: "Jantar",
        option: "Salmão assado com batata doce e aspargos",
        calories: 550,
        suitable: true
      });
    }

    if (restrictions.includes("Intolerância ao glúten")) {
      suggestions.push({
        meal: "Jantar",
        option: "Carne magra com purê de batata doce e salada",
        calories: 520,
        suitable: true
      });
    }

    return suggestions.slice(0, 6);
  };

  const suggestions = getMealSuggestions();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Nutrição Personalizada</h2>
              <p className="text-orange-100 text-lg">
                Plano alimentar adaptado às suas necessidades
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <ChefHat className="w-16 h-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macros Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 text-orange-600" />
              <Badge className={calorieProgress > 100 ? "bg-red-600" : "bg-orange-600"}>
                {Math.round(calorieProgress)}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Calorias</p>
            <p className="text-3xl font-bold text-orange-600">{totalCalories}</p>
            <p className="text-xs text-gray-500 mt-1">Meta: {dailyCalorieGoal} cal</p>
            <Progress value={calorieProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
              <Badge className="bg-red-600">
                {Math.round(proteinProgress)}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Proteínas</p>
            <p className="text-3xl font-bold text-red-600">{totalProtein}g</p>
            <p className="text-xs text-gray-500 mt-1">Meta: {proteinGoal}g</p>
            <Progress value={proteinProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-600">
                {Math.round(carbsProgress)}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Carboidratos</p>
            <p className="text-3xl font-bold text-blue-600">{totalCarbs}g</p>
            <p className="text-xs text-gray-500 mt-1">Meta: {carbsGoal}g</p>
            <Progress value={carbsProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-8 h-8 text-yellow-600" />
              <Badge className="bg-yellow-600">
                {Math.round(fatsProgress)}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gorduras</p>
            <p className="text-3xl font-bold text-yellow-600">{totalFats}g</p>
            <p className="text-xs text-gray-500 mt-1">Meta: {fatsGoal}g</p>
            <Progress value={fatsProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Restrições do Usuário */}
      {(userData.profile?.dietaryRestrictions?.length > 0 || userData.profile?.allergies?.length > 0) && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-600" />
              Suas Restrições Alimentares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userData.profile?.dietaryRestrictions?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Restrições:</p>
                <div className="flex flex-wrap gap-2">
                  {userData.profile.dietaryRestrictions.map((restriction: string) => (
                    <Badge key={restriction} className="bg-green-600 text-white">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {userData.profile?.allergies?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Alergias:</p>
                <div className="flex flex-wrap gap-2">
                  {userData.profile.allergies.map((allergy: string) => (
                    <Badge key={allergy} className="bg-red-600 text-white">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sugestões de Refeições */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-purple-600" />
              Sugestões Personalizadas
            </CardTitle>
            <CardDescription>
              Refeições adaptadas às suas restrições e objetivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                        <Utensils className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-purple-600 mb-1">{suggestion.meal}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {suggestion.option}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Flame className="w-3 h-3 mr-1" />
                            {suggestion.calories} cal
                          </Badge>
                          <Badge className="bg-green-600 text-white text-xs">
                            Adequado
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refeições do Dia */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-600" />
                Refeições de Hoje
              </CardTitle>
              <CardDescription>Registre suas refeições e acompanhe suas calorias</CardDescription>
            </div>
            <Button
              onClick={() => setShowAddMeal(!showAddMeal)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddMeal && (
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-name">Nome da Refeição</Label>
                    <Input
                      id="meal-name"
                      placeholder="Ex: Café da manhã"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-time">Horário</Label>
                    <Input
                      id="meal-time"
                      type="time"
                      value={newMeal.time}
                      onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-calories">Calorias</Label>
                    <Input
                      id="meal-calories"
                      type="number"
                      placeholder="Ex: 450"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-protein">Proteínas (g)</Label>
                    <Input
                      id="meal-protein"
                      type="number"
                      placeholder="Ex: 30"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-carbs">Carboidratos (g)</Label>
                    <Input
                      id="meal-carbs"
                      type="number"
                      placeholder="Ex: 50"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-fats">Gorduras (g)</Label>
                    <Input
                      id="meal-fats"
                      type="number"
                      placeholder="Ex: 15"
                      value={newMeal.fats}
                      onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meal-items">Alimentos (separados por vírgula)</Label>
                  <Input
                    id="meal-items"
                    placeholder="Ex: Ovos, Pão integral, Abacate"
                    value={newMeal.items}
                    onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddMeal} className="flex-1 bg-gradient-to-r from-orange-600 to-red-600">
                    Adicionar Refeição
                  </Button>
                  <Button onClick={() => setShowAddMeal(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {todayData.meals.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma refeição registrada hoje</p>
              <p className="text-sm">Clique em "Adicionar" para começar</p>
            </div>
          )}

          {todayData.meals.map((meal) => {
            const MealIcon = getMealIcon(meal.name);
            return (
              <Card key={meal.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-3 rounded-xl">
                        <MealIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{meal.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {meal.time}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {meal.items.map((item: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Calorias</p>
                            <p className="text-lg font-bold text-orange-600">{meal.calories}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Proteínas</p>
                            <p className="text-lg font-bold text-red-600">{meal.protein}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Carboidratos</p>
                            <p className="text-lg font-bold text-blue-600">{meal.carbs}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Gorduras</p>
                            <p className="text-lg font-bold text-yellow-600">{meal.fats}g</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
