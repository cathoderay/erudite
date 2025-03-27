import dictionary from "./dictionary.json" with { type: "json" };


export type definition = {
    [key: string]: string
}

export function pick_random_word(length : number) : string {
    const words : string[] = get_words(length);
    const min : number = 0;
    const max: number = words.length;
    const pos : number = Math.floor(Math.random() * (max - min) + min);
    return words[pos];
}

export function get_words(length : number) : string[] {
    const words = Object.keys(dictionary);
    let result: string[] = [];

    for(let i = 0; i < words.length; i++) {
        if (words[i].length == length) {
           result.push(words[i]);
        }
    }
    return result;
}

export function get_attempted_letters(words: string[]) : Set<String> {
    let result: Set<string> = new Set<string>();

    for(let i = 0; i < words.length; i++) {
        for(let j = 0; j < words[i].length; j++) {
            result.add(words[i][j]);
        }
    }

    return result
}

export function get_definition(word: string) : string {
    let dict: definition = dictionary;
    let def = dict[word as keyof definition]
    let pos = def.indexOf("\n");
    let result = def.substring(0, pos != - 1 ? Math.min(pos + 1, 200) : Math.min(def.length, 200));
    if (result.length < def.length)
        result += "...";
    return result
 }

 export function is_valid(word: string) : boolean {
   return word in dictionary; 
 }