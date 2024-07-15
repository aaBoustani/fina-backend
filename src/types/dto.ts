interface Macros {
    [key: string]: string | undefined;
    fat: string;
    carbs: string;
    protein: string;
}

interface Energy {
    [key: string]: string | undefined;
    calories: string;
    kilojoules: string;
}

interface NutritionalValue {
    [key: string]: string | undefined;
    name: string;
    amount: string;
}

interface Ingredient {
    [key: string]: string | undefined;
    name: string;
    weight: string;
}

interface Analysis {
    [key: string]: string | Macros | Energy | NutritionalValue[] | Ingredient[] | Date | undefined;
    dishName: string;
    macros: Macros;
    weight: string;
    energy: Energy;
    nutritionalValues: NutritionalValue[];
    ingredients: Ingredient[];
}

interface Upload {
    id: string;
    analysis?: Analysis;
    createdAt: Date;
    updatedAt: Date;
    image: string;
}


export {
    Macros,
    Energy,
    NutritionalValue,
    Ingredient,
    Analysis,
    Upload,
};