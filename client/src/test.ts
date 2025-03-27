import { assertEquals } from "jsr:@std/assert";
import { pick_random_word } from "./main.ts";
import { get_words } from "./main.ts";
import { get_attempted_letters } from "./main.ts";
import { get_definition } from "./main.ts";
import { is_valid } from "./main.ts";


Deno.test("get random word", () => {
    const length : number = 5;
    let word : string = pick_random_word(length);
    assertEquals(word.length, 5);
});

Deno.test("get words with length 5", () => {
    assertEquals(get_words(5).length, 6371);
});

Deno.test("get attempted letters", () => {
    const attempted_words: string[] = ["game", "word"];
    assertEquals(get_attempted_letters(attempted_words), new Set<String>(["g", "a", "m", "e", "w", "o", "r", "d"]))
});

Deno.test("get definition", () => {
     const word : string = pick_random_word(5);
     console.log(word);
     assertEquals(get_definition(word).length > 5, true);
 })

 Deno.test("is not valid word", () => {
    const word = "aaaaa";
    assertEquals(false, is_valid(word));
 })

 Deno.test("is valid word", () => {
    const word = "writer";
    assertEquals(true, is_valid(word));
 })