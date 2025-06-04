import {ObjectId} from "mongodb";

export interface Recipe {
    _id: ObjectId,
    name: string,
    exampleImg?: string,
    prepTime?: number,
    cookTime?: number,
    serves?: number,
    ingredients: string[],
    method: string[]
}