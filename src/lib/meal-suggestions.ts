// Sistema de sugestões de refeições que altera diariamente
// Foco em opções baratas e acessíveis

export interface MealSuggestion {
  id: string;
  meal: string; // Café da manhã, Almoço, Jantar, Lanche
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cost: number; // Custo estimado em R$
  prepTime: number; // Tempo de preparo em minutos
  ingredients: string[];
  preparation: string[];
  tags: string[]; // vegetariano, vegano, sem glúten, etc
}

// Base de dados de refeições baratas e nutritivas
const mealDatabase: MealSuggestion[] = [
  // CAFÉ DA MANHÃ
  {
    id: "breakfast-1",
    meal: "Café da manhã",
    name: "Aveia com Banana e Canela",
    calories: 320,
    protein: 12,
    carbs: 58,
    fats: 6,
    cost: 2.50,
    prepTime: 10,
    ingredients: [
      "50g de aveia em flocos",
      "1 banana média",
      "200ml de leite (ou leite vegetal)",
      "1 colher de chá de canela",
      "1 colher de sopa de mel (opcional)"
    ],
    preparation: [
      "Coloque a aveia em uma tigela",
      "Aqueça o leite e despeje sobre a aveia",
      "Deixe descansar por 3 minutos",
      "Corte a banana em rodelas",
      "Adicione a banana, canela e mel por cima",
      "Misture bem e sirva"
    ],
    tags: ["vegetariano", "econômico", "rápido"]
  },
  {
    id: "breakfast-2",
    meal: "Café da manhã",
    name: "Ovo Mexido com Pão Integral",
    calories: 380,
    protein: 22,
    carbs: 42,
    fats: 14,
    cost: 3.00,
    prepTime: 15,
    ingredients: [
      "2 ovos",
      "2 fatias de pão integral",
      "1 tomate pequeno",
      "Sal e pimenta a gosto",
      "1 colher de chá de azeite"
    ],
    preparation: [
      "Quebre os ovos em uma tigela e bata levemente",
      "Tempere com sal e pimenta",
      "Aqueça o azeite em uma frigideira",
      "Despeje os ovos e mexa até cozinhar",
      "Corte o tomate em rodelas",
      "Toste o pão e sirva com os ovos e tomate"
    ],
    tags: ["proteico", "econômico"]
  },
  {
    id: "breakfast-3",
    meal: "Café da manhã",
    name: "Tapioca com Queijo",
    calories: 290,
    protein: 15,
    carbs: 45,
    fats: 8,
    cost: 2.80,
    prepTime: 10,
    ingredients: [
      "3 colheres de sopa de goma de tapioca",
      "30g de queijo minas",
      "1 pitada de sal"
    ],
    preparation: [
      "Aqueça uma frigideira antiaderente",
      "Espalhe a tapioca uniformemente",
      "Quando começar a grudar, adicione o queijo",
      "Dobre ao meio e deixe dourar",
      "Sirva quente"
    ],
    tags: ["sem glúten", "rápido", "econômico"]
  },
  {
    id: "breakfast-4",
    meal: "Café da manhã",
    name: "Vitamina de Banana com Aveia",
    calories: 340,
    protein: 14,
    carbs: 62,
    fats: 7,
    cost: 2.20,
    prepTime: 5,
    ingredients: [
      "1 banana grande",
      "200ml de leite",
      "2 colheres de sopa de aveia",
      "1 colher de sopa de mel",
      "Gelo a gosto"
    ],
    preparation: [
      "Coloque todos os ingredientes no liquidificador",
      "Bata até ficar homogêneo",
      "Adicione gelo se desejar",
      "Sirva imediatamente"
    ],
    tags: ["vegetariano", "rápido", "energético"]
  },

  // ALMOÇO
  {
    id: "lunch-1",
    meal: "Almoço",
    name: "Arroz com Feijão e Frango Desfiado",
    calories: 580,
    protein: 42,
    carbs: 68,
    fats: 12,
    cost: 5.50,
    prepTime: 30,
    ingredients: [
      "100g de peito de frango",
      "3 colheres de arroz cozido",
      "1 concha de feijão",
      "1 dente de alho",
      "Sal e temperos a gosto",
      "Salada verde (alface e tomate)"
    ],
    preparation: [
      "Cozinhe o frango com sal e alho",
      "Desfie o frango após cozido",
      "Refogue o frango desfiado com temperos",
      "Sirva com arroz e feijão",
      "Acompanhe com salada verde"
    ],
    tags: ["proteico", "completo", "tradicional"]
  },
  {
    id: "lunch-2",
    meal: "Almoço",
    name: "Macarrão com Molho de Tomate e Ovo",
    calories: 520,
    protein: 24,
    carbs: 78,
    fats: 14,
    cost: 4.00,
    prepTime: 25,
    ingredients: [
      "100g de macarrão",
      "2 ovos",
      "2 tomates maduros",
      "1 cebola pequena",
      "2 dentes de alho",
      "Sal, orégano e manjericão"
    ],
    preparation: [
      "Cozinhe o macarrão em água com sal",
      "Pique a cebola, alho e tomates",
      "Refogue a cebola e alho no azeite",
      "Adicione os tomates e temperos",
      "Cozinhe os ovos separadamente",
      "Misture o macarrão ao molho",
      "Sirva com os ovos por cima"
    ],
    tags: ["vegetariano", "econômico", "fácil"]
  },
  {
    id: "lunch-3",
    meal: "Almoço",
    name: "Omelete de Legumes com Salada",
    calories: 420,
    protein: 28,
    carbs: 32,
    fats: 20,
    cost: 4.50,
    prepTime: 20,
    ingredients: [
      "3 ovos",
      "1/2 abobrinha",
      "1/2 cenoura",
      "1 tomate",
      "Alface e rúcula",
      "Sal e pimenta"
    ],
    preparation: [
      "Rale a abobrinha e cenoura",
      "Bata os ovos com sal e pimenta",
      "Misture os legumes aos ovos",
      "Despeje em frigideira aquecida",
      "Cozinhe até dourar dos dois lados",
      "Sirva com salada fresca"
    ],
    tags: ["vegetariano", "low carb", "proteico"]
  },
  {
    id: "lunch-4",
    meal: "Almoço",
    name: "Arroz Integral com Lentilha e Legumes",
    calories: 480,
    protein: 22,
    carbs: 72,
    fats: 10,
    cost: 3.80,
    prepTime: 35,
    ingredients: [
      "3 colheres de arroz integral",
      "1/2 xícara de lentilha",
      "1 cenoura",
      "1 abobrinha",
      "Temperos naturais"
    ],
    preparation: [
      "Cozinhe o arroz integral",
      "Cozinhe a lentilha separadamente",
      "Corte os legumes em cubos",
      "Refogue os legumes",
      "Misture tudo e tempere",
      "Sirva quente"
    ],
    tags: ["vegano", "integral", "nutritivo"]
  },

  // JANTAR
  {
    id: "dinner-1",
    meal: "Jantar",
    name: "Sopa de Legumes com Frango",
    calories: 380,
    protein: 32,
    carbs: 42,
    fats: 8,
    cost: 4.20,
    prepTime: 30,
    ingredients: [
      "100g de peito de frango",
      "1 batata média",
      "1 cenoura",
      "1/2 chuchu",
      "1 tomate",
      "Temperos e sal"
    ],
    preparation: [
      "Corte todos os ingredientes em cubos",
      "Cozinhe o frango em água com sal",
      "Adicione os legumes",
      "Cozinhe até os legumes ficarem macios",
      "Tempere a gosto",
      "Sirva quente"
    ],
    tags: ["leve", "nutritivo", "reconfortante"]
  },
  {
    id: "dinner-2",
    meal: "Jantar",
    name: "Panqueca de Aveia com Recheio de Frango",
    calories: 450,
    protein: 38,
    carbs: 48,
    fats: 12,
    cost: 4.80,
    prepTime: 25,
    ingredients: [
      "2 ovos",
      "3 colheres de aveia",
      "100g de frango desfiado",
      "1 tomate",
      "Temperos"
    ],
    preparation: [
      "Bata os ovos com a aveia",
      "Faça panquecas finas na frigideira",
      "Refogue o frango com tomate",
      "Recheie as panquecas",
      "Sirva quente"
    ],
    tags: ["proteico", "criativo", "saudável"]
  },
  {
    id: "dinner-3",
    meal: "Jantar",
    name: "Salada Completa com Atum",
    calories: 360,
    protein: 28,
    carbs: 35,
    fats: 14,
    cost: 5.00,
    prepTime: 15,
    ingredients: [
      "1 lata de atum",
      "Alface, tomate, pepino",
      "1 ovo cozido",
      "2 colheres de grão de bico",
      "Azeite e limão"
    ],
    preparation: [
      "Lave e corte os vegetais",
      "Escorra o atum",
      "Cozinhe o ovo",
      "Monte a salada em um prato",
      "Tempere com azeite e limão",
      "Sirva fresco"
    ],
    tags: ["leve", "proteico", "rápido"]
  },
  {
    id: "dinner-4",
    meal: "Jantar",
    name: "Caldo Verde com Batata",
    calories: 320,
    protein: 12,
    carbs: 52,
    fats: 8,
    cost: 3.50,
    prepTime: 25,
    ingredients: [
      "2 batatas médias",
      "1 maço de couve",
      "1 cebola",
      "2 dentes de alho",
      "Sal e azeite"
    ],
    preparation: [
      "Cozinhe as batatas com cebola e alho",
      "Bata no liquidificador",
      "Volte ao fogo",
      "Adicione a couve picada",
      "Cozinhe por 5 minutos",
      "Finalize com azeite"
    ],
    tags: ["vegano", "econômico", "tradicional"]
  },

  // LANCHES
  {
    id: "snack-1",
    meal: "Lanche",
    name: "Iogurte Natural com Granola",
    calories: 280,
    protein: 14,
    carbs: 42,
    fats: 8,
    cost: 3.20,
    prepTime: 5,
    ingredients: [
      "200ml de iogurte natural",
      "3 colheres de granola",
      "1 colher de mel",
      "Frutas picadas (opcional)"
    ],
    preparation: [
      "Coloque o iogurte em uma tigela",
      "Adicione a granola",
      "Regue com mel",
      "Adicione frutas se desejar",
      "Sirva imediatamente"
    ],
    tags: ["vegetariano", "rápido", "nutritivo"]
  },
  {
    id: "snack-2",
    meal: "Lanche",
    name: "Pão Integral com Pasta de Amendoim",
    calories: 320,
    protein: 16,
    carbs: 38,
    fats: 14,
    cost: 2.80,
    prepTime: 5,
    ingredients: [
      "2 fatias de pão integral",
      "2 colheres de pasta de amendoim",
      "1 banana fatiada"
    ],
    preparation: [
      "Toste o pão levemente",
      "Espalhe a pasta de amendoim",
      "Adicione as fatias de banana",
      "Sirva"
    ],
    tags: ["vegetariano", "energético", "rápido"]
  },
  {
    id: "snack-3",
    meal: "Lanche",
    name: "Smoothie Verde Detox",
    calories: 220,
    protein: 8,
    carbs: 42,
    fats: 4,
    cost: 3.50,
    prepTime: 10,
    ingredients: [
      "1 maçã",
      "1/2 pepino",
      "Folhas de couve",
      "Suco de 1 limão",
      "200ml de água",
      "Gelo"
    ],
    preparation: [
      "Lave todos os ingredientes",
      "Corte em pedaços",
      "Bata tudo no liquidificador",
      "Adicione gelo",
      "Coe se preferir",
      "Sirva gelado"
    ],
    tags: ["vegano", "detox", "refrescante"]
  },
  {
    id: "snack-4",
    meal: "Lanche",
    name: "Crepioca com Queijo",
    calories: 260,
    protein: 18,
    carbs: 32,
    fats: 8,
    cost: 2.50,
    prepTime: 10,
    ingredients: [
      "1 ovo",
      "2 colheres de tapioca",
      "30g de queijo",
      "Sal a gosto"
    ],
    preparation: [
      "Bata o ovo com a tapioca",
      "Despeje em frigideira quente",
      "Adicione o queijo",
      "Dobre ao meio",
      "Deixe dourar",
      "Sirva quente"
    ],
    tags: ["sem glúten", "proteico", "rápido"]
  }
];

// Função para obter sugestões do dia baseado na data
export function getDailySuggestions(
  dietaryRestrictions: string[] = [],
  allergies: string[] = []
): MealSuggestion[] {
  // Usar a data atual para gerar um índice "aleatório" mas consistente no dia
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Filtrar refeições baseado nas restrições
  let filteredMeals = mealDatabase.filter(meal => {
    // Verificar restrições alimentares
    if (dietaryRestrictions.includes("Vegano") && !meal.tags.includes("vegano")) {
      return false;
    }
    if (dietaryRestrictions.includes("Vegetariano") && !meal.tags.includes("vegetariano") && !meal.tags.includes("vegano")) {
      return false;
    }
    if (dietaryRestrictions.includes("Intolerância ao glúten") && !meal.tags.includes("sem glúten")) {
      // Verificar se tem ingredientes com glúten
      const hasGluten = meal.ingredients.some(ing => 
        ing.toLowerCase().includes("pão") || 
        ing.toLowerCase().includes("macarrão") ||
        ing.toLowerCase().includes("farinha de trigo")
      );
      if (hasGluten) return false;
    }
    if (dietaryRestrictions.includes("Intolerância à lactose")) {
      const hasLactose = meal.ingredients.some(ing => 
        ing.toLowerCase().includes("leite") || 
        ing.toLowerCase().includes("queijo") ||
        ing.toLowerCase().includes("iogurte")
      );
      if (hasLactose) return false;
    }
    
    // Verificar alergias
    if (allergies.includes("Ovos")) {
      const hasEggs = meal.ingredients.some(ing => ing.toLowerCase().includes("ovo"));
      if (hasEggs) return false;
    }
    if (allergies.includes("Amendoim")) {
      const hasPeanuts = meal.ingredients.some(ing => ing.toLowerCase().includes("amendoim"));
      if (hasPeanuts) return false;
    }
    if (allergies.includes("Peixe")) {
      const hasFish = meal.ingredients.some(ing => 
        ing.toLowerCase().includes("peixe") || 
        ing.toLowerCase().includes("atum") ||
        ing.toLowerCase().includes("salmão")
      );
      if (hasFish) return false;
    }
    
    return true;
  });

  // Se filtrou demais, usar todas
  if (filteredMeals.length < 6) {
    filteredMeals = mealDatabase;
  }

  // Selecionar 6 refeições do dia (2 de cada tipo: café, almoço, jantar)
  const suggestions: MealSuggestion[] = [];
  
  const breakfasts = filteredMeals.filter(m => m.meal === "Café da manhã");
  const lunches = filteredMeals.filter(m => m.meal === "Almoço");
  const dinners = filteredMeals.filter(m => m.meal === "Jantar");
  const snacks = filteredMeals.filter(m => m.meal === "Lanche");

  // Usar o dia do ano para selecionar diferentes combinações
  if (breakfasts.length > 0) {
    suggestions.push(breakfasts[dayOfYear % breakfasts.length]);
    suggestions.push(breakfasts[(dayOfYear + 1) % breakfasts.length]);
  }
  
  if (lunches.length > 0) {
    suggestions.push(lunches[dayOfYear % lunches.length]);
    suggestions.push(lunches[(dayOfYear + 1) % lunches.length]);
  }
  
  if (dinners.length > 0) {
    suggestions.push(dinners[dayOfYear % dinners.length]);
    suggestions.push(dinners[(dayOfYear + 1) % dinners.length]);
  }

  return suggestions;
}

// Função para obter uma sugestão específica por ID
export function getMealSuggestionById(id: string): MealSuggestion | undefined {
  return mealDatabase.find(meal => meal.id === id);
}

// Função para obter todas as refeições de um tipo específico
export function getMealsByType(type: string): MealSuggestion[] {
  return mealDatabase.filter(meal => meal.meal === type);
}
