import {ObjectId} from "mongodb";

export interface Recipe {
    _id: ObjectId,
    author: string,
    name: string,
    exampleImg?: string,
    prepTime?: number,
    cookTime?: number,
    serves?: number,
    ingredients: string[],
    method: string[]
}