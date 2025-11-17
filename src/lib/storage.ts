// Sistema de armazenamento local com separação por usuário

export interface UserData {
  userId: string;
  profile: any;
  workouts: {
    completed: number[];
    history: Array<{
      id: number;
      workoutId: number;
      date: string;
      caloriesBurned: number;
    }>;
  };
  nutrition: {
    meals: Array<{
      id: number;
      name: string;
      time: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      items: string[];
      date: string;
    }>;
  };
  hydration: {
    consumed: number;
    log: Array<{
      id: number;
      amount: number;
      time: string;
      date: string;
    }>;
    remindersEnabled: boolean;
  };
  activityLog: Array<{
    date: string;
    hasActivity: boolean;
  }>;
  createdAt: string;
  lastAccess: string;
}

// Gerar ID único para o usuário
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obter ou criar ID do usuário
export const getUserId = (): string => {
  let userId = localStorage.getItem('fitsmart_user_id');
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('fitsmart_user_id', userId);
  }
  
  return userId;
};

// Inicializar dados vazios para novo usuário
export const initializeUserData = (userId: string, profile: any): UserData => {
  const today = getTodayDate();
  const userData: UserData = {
    userId,
    profile,
    workouts: {
      completed: [],
      history: []
    },
    nutrition: {
      meals: []
    },
    hydration: {
      consumed: 0,
      log: [],
      remindersEnabled: true
    },
    activityLog: [
      {
        date: today,
        hasActivity: true
      }
    ],
    createdAt: new Date().toISOString(),
    lastAccess: new Date().toISOString()
  };
  
  saveUserData(userData);
  return userData;
};

// Salvar dados do usuário
export const saveUserData = (userData: UserData): void => {
  userData.lastAccess = new Date().toISOString();
  localStorage.setItem(`fitsmart_data_${userData.userId}`, JSON.stringify(userData));
};

// Carregar dados do usuário
export const loadUserData = (userId: string): UserData | null => {
  const data = localStorage.getItem(`fitsmart_data_${userId}`);
  
  if (!data) {
    return null;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    return null;
  }
};

// Verificar se usuário completou o quiz
export const hasCompletedQuiz = (): boolean => {
  const userId = getUserId();
  const userData = loadUserData(userId);
  return userData !== null && userData.profile !== null;
};

// Limpar dados do usuário (reset)
export const clearUserData = (userId: string): void => {
  localStorage.removeItem(`fitsmart_data_${userId}`);
};

// Obter data de hoje no formato YYYY-MM-DD
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Verificar se uma data é hoje
export const isToday = (date: string): boolean => {
  return date === getTodayDate();
};

// Filtrar dados de hoje
export const getTodayData = (userData: UserData) => {
  const today = getTodayDate();
  
  return {
    meals: userData.nutrition.meals.filter(meal => meal.date === today),
    hydration: {
      consumed: isToday(userData.hydration.log[0]?.date) ? userData.hydration.consumed : 0,
      log: userData.hydration.log.filter(log => log.date === today)
    },
    workouts: userData.workouts.history.filter(workout => workout.date === today)
  };
};

// Registrar atividade do dia
export const registerDailyActivity = (userData: UserData): UserData => {
  const today = getTodayDate();
  
  // Verificar se já registrou atividade hoje
  const todayActivity = userData.activityLog.find(log => log.date === today);
  
  if (!todayActivity) {
    userData.activityLog.push({
      date: today,
      hasActivity: true
    });
  }
  
  return userData;
};

// Calcular dias consecutivos de uso
export const calculateConsecutiveStreak = (userData: UserData): number => {
  if (!userData.activityLog || userData.activityLog.length === 0) {
    return 0;
  }

  // Ordenar por data decrescente (mais recente primeiro)
  const sortedLog = [...userData.activityLog].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = getTodayDate();
  let streak = 0;
  let currentDate = new Date(today);

  // Verificar se tem atividade hoje
  if (sortedLog[0].date !== today) {
    return 0; // Sequência quebrada se não usou hoje
  }

  // Contar dias consecutivos
  for (let i = 0; i < sortedLog.length; i++) {
    const logDate = sortedLog[i].date;
    const expectedDate = currentDate.toISOString().split('T')[0];

    if (logDate === expectedDate) {
      streak++;
      // Voltar um dia
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Sequência quebrada
      break;
    }
  }

  return streak;
};

// Resetar dados diários (chamado automaticamente quando muda o dia)
export const resetDailyData = (userData: UserData): UserData => {
  const today = getTodayDate();
  const lastAccessDate = userData.lastAccess.split('T')[0];
  
  // Se o último acesso foi em outro dia, resetar dados diários
  if (lastAccessDate !== today) {
    userData.hydration.consumed = 0;
    // Registrar novo dia de atividade
    userData = registerDailyActivity(userData);
  }
  
  return userData;
};
