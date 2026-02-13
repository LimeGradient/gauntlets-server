export interface Gauntlet {
    id: number,
    name: string,
    bgColor: string[],
    levels: number[],
    releaseDate: Date | undefined
}

export function createGauntlet(
    id: number, 
    name: string, 
    bgColor: string[], 
    levels: number[], 
    releaseDate?: Date): Gauntlet {
        return {
            id: id,
            name: name,
            bgColor: bgColor,
            levels: levels,
            releaseDate: releaseDate
        }
}

