// Sistema de autenticação e gerenciamento de usuários

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  subscription: {
    plan: 'free' | 'monthly' | 'annual';
    status: 'trial' | 'active' | 'expired';
    startDate: string;
    expiryDate: string;
    trialEndsAt?: string;
  };
  hasCompletedQuiz: boolean;
}

// Gerar ID único para usuário
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Registrar novo usuário
export const registerUser = (email: string, password: string, name: string): User | null => {
  // Verificar se email já existe
  const users = getAllUsers();
  if (users.find(u => u.email === email)) {
    return null; // Email já cadastrado
  }

  const userId = generateUserId();
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 dias

  const user: User = {
    id: userId,
    email,
    name,
    createdAt: now.toISOString(),
    subscription: {
      plan: 'free',
      status: 'trial',
      startDate: now.toISOString(),
      expiryDate: trialEndsAt.toISOString(),
      trialEndsAt: trialEndsAt.toISOString()
    },
    hasCompletedQuiz: false
  };

  // Salvar usuário
  localStorage.setItem(`fitsmart_user_${userId}`, JSON.stringify(user));
  
  // Salvar senha (em produção, usar hash)
  localStorage.setItem(`fitsmart_password_${userId}`, password);
  
  // Adicionar à lista de usuários
  const usersList = users.map(u => u.id);
  usersList.push(userId);
  localStorage.setItem('fitsmart_users_list', JSON.stringify(usersList));

  return user;
};

// Login de usuário
export const loginUser = (email: string, password: string): User | null => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return null; // Usuário não encontrado
  }

  const storedPassword = localStorage.getItem(`fitsmart_password_${user.id}`);
  
  if (storedPassword !== password) {
    return null; // Senha incorreta
  }

  // Atualizar último acesso
  setCurrentUser(user.id);
  
  return user;
};

// Obter todos os usuários
const getAllUsers = (): User[] => {
  const usersList = localStorage.getItem('fitsmart_users_list');
  
  if (!usersList) {
    return [];
  }

  const userIds: string[] = JSON.parse(usersList);
  const users: User[] = [];

  userIds.forEach(userId => {
    const userData = localStorage.getItem(`fitsmart_user_${userId}`);
    if (userData) {
      users.push(JSON.parse(userData));
    }
  });

  return users;
};

// Definir usuário atual
export const setCurrentUser = (userId: string): void => {
  localStorage.setItem('fitsmart_current_user', userId);
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem('fitsmart_current_user');
  
  if (!userId) {
    return null;
  }

  const userData = localStorage.getItem(`fitsmart_user_${userId}`);
  
  if (!userData) {
    return null;
  }

  return JSON.parse(userData);
};

// Atualizar usuário
export const updateUser = (user: User): void => {
  localStorage.setItem(`fitsmart_user_${user.id}`, JSON.stringify(user));
};

// Logout
export const logoutUser = (): void => {
  localStorage.removeItem('fitsmart_current_user');
};

// Verificar se trial expirou
export const isTrialExpired = (user: User): boolean => {
  if (user.subscription.status !== 'trial') {
    return false;
  }

  const now = new Date();
  const expiryDate = new Date(user.subscription.expiryDate);
  
  return now > expiryDate;
};

// Atualizar plano de assinatura
export const updateSubscription = (
  user: User, 
  plan: 'monthly' | 'annual',
  paymentMethod: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  }
): User => {
  const now = new Date();
  const expiryDate = new Date(now);
  
  if (plan === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  user.subscription = {
    plan,
    status: 'active',
    startDate: now.toISOString(),
    expiryDate: expiryDate.toISOString()
  };

  // Salvar método de pagamento (em produção, usar gateway de pagamento)
  localStorage.setItem(`fitsmart_payment_${user.id}`, JSON.stringify(paymentMethod));

  updateUser(user);
  return user;
};

// Marcar quiz como completo
export const markQuizComplete = (user: User): User => {
  user.hasCompletedQuiz = true;
  updateUser(user);
  return user;
};

// Verificar se usuário pode acessar o app
export const canAccessApp = (user: User): boolean => {
  if (!user.hasCompletedQuiz) {
    return false;
  }

  if (user.subscription.status === 'active') {
    return true;
  }

  if (user.subscription.status === 'trial') {
    return !isTrialExpired(user);
  }

  return false;
};

// Obter dias restantes do trial
export const getTrialDaysRemaining = (user: User): number => {
  if (user.subscription.status !== 'trial' || !user.subscription.trialEndsAt) {
    return 0;
  }

  const now = new Date();
  const expiryDate = new Date(user.subscription.trialEndsAt);
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
