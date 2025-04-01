import dictionary from "./dictionary5.json" with { type: "json" };


export interface Term {
    word: string;
    definition: string;
  }

export type Dictionary = {
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
    let dict: Dictionary = dictionary;
    let def = dict[word as keyof Dictionary]
    let pos = def.indexOf("\n");
    let result = def.substring(0, pos != - 1 ? Math.min(pos + 1, 180) : Math.min(def.length, 180));
    if (result.length < def.length)
        result += "...";
    return result
 }

export function get_term(word: string): Term {
    const term: Term = {
        word: word,
        definition: get_definition(word)
    }
    return term;
}

export function get_random_term(length: number): Term {
    const word: string = pick_random_word(length);
    return get_term(word)
}
 

 export function is_valid(word: string) : boolean {
   return word in dictionary; 
 }
