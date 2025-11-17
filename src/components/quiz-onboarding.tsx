"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Sparkles, User, Activity, Target, MapPin, Utensils, Apple } from "lucide-react";

interface QuizOnboardingProps {
  onComplete: (profile: any) => void;
}

export default function QuizOnboarding({ onComplete }: QuizOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    goal: "",
    activityLevel: "",
    workoutLocation: "",
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    mealsPerDay: "",
    preferredMealTimes: [] as string[],
  });

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const profile = {
        ...formData,
        dailyCalories: calculateCalories(),
        dailyWater: calculateWater(),
        weeklyWorkouts: calculateWorkouts(),
        proteinGoal: calculateProtein(),
        carbsGoal: calculateCarbs(),
        fatsGoal: calculateFats(),
      };
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateCalories = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    
    let bmr = formData.gender === "male" 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

    const activityMultiplier: any = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    bmr *= activityMultiplier[formData.activityLevel] || 1.2;

    if (formData.goal === "lose") bmr -= 500;
    if (formData.goal === "gain") bmr += 500;

    return Math.round(bmr);
  };

  const calculateWater = () => {
    const weight = parseFloat(formData.weight);
    return Math.round(weight * 35);
  };

  const calculateWorkouts = () => {
    const workoutMap: any = {
      sedentary: 2,
      light: 3,
      moderate: 4,
      active: 5,
      veryActive: 6
    };
    return workoutMap[formData.activityLevel] || 3;
  };

  const calculateProtein = () => {
    const weight = parseFloat(formData.weight);
    return Math.round(weight * 2); // 2g por kg
  };

  const calculateCarbs = () => {
    const calories = calculateCalories();
    return Math.round((calories * 0.4) / 4); // 40% das calorias
  };

  const calculateFats = () => {
    const calories = calculateCalories();
    return Math.round((calories * 0.3) / 9); // 30% das calorias
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim() !== "";
      case 2: return formData.age !== "" && formData.weight !== "" && formData.height !== "";
      case 3: return formData.gender !== "";
      case 4: return formData.goal !== "";
      case 5: return formData.activityLevel !== "";
      case 6: return formData.workoutLocation !== "";
      case 7: return true;
      case 8: return formData.mealsPerDay !== "";
      default: return false;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Questionário Personalizado
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            Etapa {step}/{totalSteps}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <CardDescription className="text-base">
          Vamos conhecer você melhor para criar seu plano perfeito
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Nome */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Vamos começar!</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-semibold">Como você se chama?</Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-lg p-6"
              />
            </div>
          </div>
        )}

        {/* Step 2: Dados Físicos */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Informações Básicas</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade (anos)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="p-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="p-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="p-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Gênero */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <Label className="text-lg font-semibold">Qual é o seu gênero?</Label>
            <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: "male", label: "Masculino" },
                  { value: "female", label: "Feminino" }
                ].map((option) => (
                  <Card key={option.value} className={`cursor-pointer transition-all hover:shadow-lg ${formData.gender === option.value ? 'border-purple-600 border-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardContent className="p-6 flex items-center space-x-4">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer text-base font-medium flex-1">{option.label}</Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 4: Objetivo */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Seu Objetivo</h3>
            </div>
            <Label className="text-lg font-semibold">Qual é o seu objetivo principal?</Label>
            <RadioGroup value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
              <div className="space-y-3">
                {[
                  { value: "lose", label: "Perder peso", desc: "Reduzir gordura corporal e emagrecer" },
                  { value: "maintain", label: "Manter peso", desc: "Manter forma física atual" },
                  { value: "gain", label: "Ganhar massa muscular", desc: "Aumentar músculos e força" },
                  { value: "tone", label: "Tonificar", desc: "Definir e modelar o corpo" }
                ].map((option) => (
                  <Card key={option.value} className={`cursor-pointer transition-all hover:shadow-lg ${formData.goal === option.value ? 'border-purple-600 border-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer text-base font-medium block">{option.label}</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 5: Nível de Atividade */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <Label className="text-lg font-semibold">Qual é o seu nível de atividade atual?</Label>
            <RadioGroup value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
              <div className="space-y-3">
                {[
                  { value: "sedentary", label: "Sedentário", desc: "Pouco ou nenhum exercício" },
                  { value: "light", label: "Levemente ativo", desc: "Exercício leve 1-3 dias/semana" },
                  { value: "moderate", label: "Moderadamente ativo", desc: "Exercício moderado 3-5 dias/semana" },
                  { value: "active", label: "Muito ativo", desc: "Exercício intenso 6-7 dias/semana" },
                  { value: "veryActive", label: "Extremamente ativo", desc: "Exercício muito intenso diariamente" }
                ].map((option) => (
                  <Card key={option.value} className={`cursor-pointer transition-all hover:shadow-lg ${formData.activityLevel === option.value ? 'border-purple-600 border-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer text-base font-medium block">{option.label}</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 6: Local de Treino */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold">Local de Treino</h3>
            </div>
            <Label className="text-lg font-semibold">Onde você prefere treinar?</Label>
            <RadioGroup value={formData.workoutLocation} onValueChange={(value) => setFormData({ ...formData, workoutLocation: value })}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "home", label: "Em casa", desc: "Treinos sem equipamentos" },
                  { value: "gym", label: "Academia", desc: "Acesso a equipamentos" },
                  { value: "both", label: "Ambos", desc: "Flexibilidade total" }
                ].map((option) => (
                  <Card key={option.value} className={`cursor-pointer transition-all hover:shadow-lg ${formData.workoutLocation === option.value ? 'border-purple-600 border-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer text-base font-medium">{option.label}</Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">{option.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 7: Restrições Alimentares - COMPLETO */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                <Apple className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">Restrições e Alergias</h3>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Você tem alguma restrição alimentar?</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Selecione todas que se aplicam</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Intolerância à lactose",
                  "Intolerância ao glúten",
                  "Celíaco",
                  "Vegetariano",
                  "Vegano",
                  "Diabetes",
                  "Hipertensão",
                  "Colesterol alto",
                  "Nenhuma"
                ].map((restriction) => (
                  <Card key={restriction} className={`cursor-pointer transition-all hover:shadow-lg ${formData.dietaryRestrictions.includes(restriction) ? 'border-purple-600 border-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Checkbox
                        id={restriction}
                        checked={formData.dietaryRestrictions.includes(restriction)}
                        onCheckedChange={() => setFormData({
                          ...formData,
                          dietaryRestrictions: toggleArrayItem(formData.dietaryRestrictions, restriction)
                        })}
                      />
                      <Label htmlFor={restriction} className="cursor-pointer text-sm font-medium flex-1">
                        {restriction}
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <Label className="text-lg font-semibold">Você tem alergias alimentares?</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Importante para personalizar seu plano</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Amendoim",
                  "Frutos do mar",
                  "Ovos",
                  "Soja",
                  "Nozes",
                  "Peixe",
                  "Leite e derivados",
                  "Trigo",
                  "Nenhuma"
                ].map((allergy) => (
                  <Card key={allergy} className={`cursor-pointer transition-all hover:shadow-lg ${formData.allergies.includes(allergy) ? 'border-red-600 border-2 bg-red-50 dark:bg-red-900/20' : ''}`}>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Checkbox
                        id={allergy}
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={() => setFormData({
                          ...formData,
                          allergies: toggleArrayItem(formData.allergies, allergy)
                        })}
                      />
                      <Label htmlFor={allergy} className="cursor-pointer text-sm font-medium flex-1">
                        {allergy}
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Preferências de Refeições */}
        {step === 8 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                <Utensils className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold">Preferências Alimentares</h3>
            </div>
            <Label className="text-lg font-semibold">Quantas refeições por dia você prefere?</Label>
            <RadioGroup value={formData.mealsPerDay} onValueChange={(value) => setFormData({ ...formData, mealsPerDay: value })}>
              <div className="space-y-3">
                {[
                  { value: "3", label: "3 refeições", desc: "Café da manhã, almoço e jantar" },
                  { value: "4", label: "4 refeições", desc: "3 principais + 1 lanche" },
                  { value: "5", label: "5 refeições", desc: "3 principais + 2 lanches" },
                  { value: "6", label: "6 refeições", desc: "Refeições menores e mais frequentes" }
                ].map((option) => (
                  <Card key={option.value} className={`cursor-pointer transition-all hover:shadow-lg ${formData.mealsPerDay === option.value ? 'border-purple-600 border-2 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <RadioGroupItem value={option.value} id={`meals-${option.value}`} />
                      <div className="flex-1">
                        <Label htmlFor={`meals-${option.value}`} className="cursor-pointer text-base font-medium block">{option.label}</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
          >
            {step === totalSteps ? "Finalizar Quiz" : "Próximo"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
