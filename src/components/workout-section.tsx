"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Dumbbell, Clock, Flame, CheckCircle2 } from "lucide-react";
import { saveUserData, getTodayDate, type UserData } from "@/lib/storage";

interface WorkoutSectionProps {
  userData: UserData;
  updateUserData: (data: UserData) => void;
}

export default function WorkoutSection({ userData, updateUserData }: WorkoutSectionProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const workoutLocation = userData.profile?.workoutLocation || "both";
  
  // Treinos personalizados baseados no perfil
  const workouts = [
    {
      id: 1,
      name: "Treino de Peito e Tríceps",
      location: "gym",
      duration: 45,
      calories: 350,
      level: "Intermediário",
      exercises: [
        { name: "Supino reto", sets: 4, reps: "10-12", video: "https://www.youtube.com/embed/rT7DgCr-3pg" },
        { name: "Supino inclinado", sets: 3, reps: "10-12", video: "https://www.youtube.com/embed/SrqOu55lrYU" },
        { name: "Crucifixo", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/eozdVDA78K0" },
        { name: "Tríceps testa", sets: 3, reps: "10-12", video: "https://www.youtube.com/embed/d_KZxkY_0cM" },
        { name: "Tríceps corda", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/2-LAMcpzODU" }
      ]
    },
    {
      id: 2,
      name: "Treino de Costas e Bíceps",
      location: "gym",
      duration: 50,
      calories: 380,
      level: "Intermediário",
      exercises: [
        { name: "Barra fixa", sets: 4, reps: "8-10", video: "https://www.youtube.com/embed/eGo4IYlbE5g" },
        { name: "Remada curvada", sets: 4, reps: "10-12", video: "https://www.youtube.com/embed/FWJR5Ve8bnQ" },
        { name: "Puxada frontal", sets: 3, reps: "10-12", video: "https://www.youtube.com/embed/CAwf7n6Luuc" },
        { name: "Rosca direta", sets: 3, reps: "10-12", video: "https://www.youtube.com/embed/ykJmrZ5v0Oo" },
        { name: "Rosca martelo", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/zC3nLlEvin4" }
      ]
    },
    {
      id: 3,
      name: "Treino de Pernas",
      location: "gym",
      duration: 55,
      calories: 420,
      level: "Intermediário",
      exercises: [
        { name: "Agachamento livre", sets: 4, reps: "10-12", video: "https://www.youtube.com/embed/ultWZbUMPL8" },
        { name: "Leg press", sets: 4, reps: "12-15", video: "https://www.youtube.com/embed/IZxyjW7MPJQ" },
        { name: "Cadeira extensora", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/YyvSfVjQeL0" },
        { name: "Mesa flexora", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/1Tq3QdYUuHs" },
        { name: "Panturrilha em pé", sets: 4, reps: "15-20", video: "https://www.youtube.com/embed/JbyjNymZOt0" }
      ]
    },
    {
      id: 4,
      name: "Treino de Ombros",
      location: "gym",
      duration: 40,
      calories: 320,
      level: "Intermediário",
      exercises: [
        { name: "Desenvolvimento com barra", sets: 4, reps: "10-12", video: "https://www.youtube.com/embed/2yjwXTZQDDI" },
        { name: "Elevação lateral", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/3VcKaXpzqRo" },
        { name: "Elevação frontal", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/qsl6Joq0h_0" },
        { name: "Crucifixo invertido", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/T7gWBKwzUVM" },
        { name: "Encolhimento", sets: 3, reps: "15-20", video: "https://www.youtube.com/embed/cJRVVxmytaM" }
      ]
    },
    {
      id: 5,
      name: "Treino em Casa - Corpo Todo",
      location: "home",
      duration: 35,
      calories: 280,
      level: "Iniciante",
      exercises: [
        { name: "Flexão de braço", sets: 4, reps: "12-15", video: "https://www.youtube.com/embed/IODxDxX7oi4" },
        { name: "Agachamento livre", sets: 4, reps: "15-20", video: "https://www.youtube.com/embed/aclHkVaku9U" },
        { name: "Prancha", sets: 3, reps: "30-60s", video: "https://www.youtube.com/embed/ASdvN_XEl_c" },
        { name: "Afundo", sets: 3, reps: "12-15", video: "https://www.youtube.com/embed/QOVaHwm-Q6U" },
        { name: "Burpee", sets: 3, reps: "10-12", video: "https://www.youtube.com/embed/TU8QYVW0gDU" }
      ]
    },
    {
      id: 6,
      name: "Treino HIIT em Casa",
      location: "home",
      duration: 25,
      calories: 300,
      level: "Avançado",
      exercises: [
        { name: "Jumping jacks", sets: 4, reps: "30s", video: "https://www.youtube.com/embed/2W4ZNSwoW_4" },
        { name: "Mountain climbers", sets: 4, reps: "30s", video: "https://www.youtube.com/embed/nmwgirgXLYM" },
        { name: "Burpees", sets: 4, reps: "30s", video: "https://www.youtube.com/embed/TU8QYVW0gDU" },
        { name: "High knees", sets: 4, reps: "30s", video: "https://www.youtube.com/embed/8opcQdC-V-U" },
        { name: "Agachamento com salto", sets: 4, reps: "30s", video: "https://www.youtube.com/embed/A-cFYWvaHr0" }
      ]
    }
  ];

  const filteredWorkouts = workouts.filter(workout => {
    if (workoutLocation === "both") return true;
    return workout.location === workoutLocation;
  });

  const handleCompleteWorkout = (workoutId: number, calories: number) => {
    const updatedData = { ...userData };
    
    // Adicionar ao array de completos se não estiver lá
    if (!updatedData.workouts.completed.includes(workoutId)) {
      updatedData.workouts.completed.push(workoutId);
    }
    
    // Adicionar ao histórico
    updatedData.workouts.history.push({
      id: Date.now(),
      workoutId,
      date: getTodayDate(),
      caloriesBurned: calories
    });
    
    saveUserData(updatedData);
    updateUserData(updatedData);
  };

  const weeklyProgress = (userData.workouts.completed.length / (userData.profile?.weeklyWorkouts || 3)) * 100;
  const totalCaloriesBurned = userData.workouts.history
    .filter(w => w.date === getTodayDate())
    .reduce((sum, w) => sum + w.caloriesBurned, 0);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Seus Treinos</h2>
              <p className="text-purple-100 text-lg">
                Plano personalizado para {workoutLocation === "home" ? "casa" : workoutLocation === "gym" ? "academia" : "casa e academia"}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Dumbbell className="w-16 h-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Progresso Semanal
          </CardTitle>
          <CardDescription>
            Meta: {userData.profile?.weeklyWorkouts || 3} treinos por semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Treinos completos</span>
              <span className="font-semibold">{userData.workouts.completed.length} de {userData.profile?.weeklyWorkouts || 3}</span>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{userData.workouts.completed.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Completos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{totalCaloriesBurned}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Calorias</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{Math.round(weeklyProgress)}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkouts.map((workout) => {
          const isCompleted = userData.workouts.completed.includes(workout.id);
          return (
            <Card key={workout.id} className={`hover:shadow-xl transition-all ${isCompleted ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="leading-none font-semibold flex items-center gap-2 mb-2">
                      <Dumbbell className="w-5 h-5 text-purple-600" />
                      {workout.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {workout.duration} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Flame className="w-3 h-3 mr-1" />
                        {workout.calories} cal
                      </Badge>
                      <Badge className={workout.location === "home" ? "bg-blue-600" : "bg-purple-600"}>
                        {workout.location === "home" ? "Casa" : "Academia"}
                      </Badge>
                      <Badge variant="secondary">{workout.level}</Badge>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vídeo do Treino */}
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <iframe
                    width="100%"
                    height="100%"
                    src={workout.exercises[0].video}
                    title={`Vídeo de ${workout.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Exercícios:</p>
                  {workout.exercises.slice(0, 3).map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{exercise.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {exercise.sets}x {exercise.reps}
                      </span>
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{workout.exercises.length - 3} exercícios
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedWorkout(workout)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  {!isCompleted && (
                    <Button
                      onClick={() => handleCompleteWorkout(workout.id, workout.calories)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Concluir
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <Card className="border-2 border-purple-600 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{selectedWorkout.name}</CardTitle>
              <Button
                variant="ghost"
                onClick={() => setSelectedWorkout(null)}
                className="text-white hover:bg-white/20"
              >
                Fechar
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-white/20">
                <Clock className="w-3 h-3 mr-1" />
                {selectedWorkout.duration} min
              </Badge>
              <Badge className="bg-white/20">
                <Flame className="w-3 h-3 mr-1" />
                {selectedWorkout.calories} cal
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-600" />
                Exercícios do Treino
              </h3>
              <div className="space-y-4">
                {selectedWorkout.exercises.map((exercise: any, idx: number) => (
                  <Card key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{exercise.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exercise.sets} séries de {exercise.reps} repetições
                          </p>
                        </div>
                        <Badge className="bg-purple-600">{idx + 1}</Badge>
                      </div>
                      
                      {/* Vídeo do Exercício */}
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                        <iframe
                          width="100%"
                          height="100%"
                          src={exercise.video}
                          title={`Vídeo de ${exercise.name}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                      
                      <Button
                        onClick={() => window.open(exercise.video.replace('/embed/', '/watch?v='), '_blank')}
                        variant="outline"
                        className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Abrir no YouTube
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Button
              onClick={() => {
                handleCompleteWorkout(selectedWorkout.id, selectedWorkout.calories);
                setSelectedWorkout(null);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg"
              disabled={userData.workouts.completed.includes(selectedWorkout.id)}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {userData.workouts.completed.includes(selectedWorkout.id) ? "Treino Concluído!" : "Marcar como Concluído"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Motivational Card */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Continue firme! 💪
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cada treino te aproxima dos seus objetivos. Lembre-se: consistência é a chave para o sucesso!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
