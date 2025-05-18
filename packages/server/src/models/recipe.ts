export interface Recipe {
    name: string,
    exampleImg?: string,
    prepTime?: number,
    cookTime?: number,
    serves?: number,
    ingredients: string[],
    method: string[]
}