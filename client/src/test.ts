import { assertEquals } from "jsr:@std/assert";
import { get_random_term, pick_random_word } from "./main.ts";
import { get_words } from "./main.ts";
import { get_attempted_letters } from "./main.ts";
import { get_definition } from "./main.ts";
import { is_valid } from "./main.ts";
import { get_term } from "./main.ts";
import { Term } from "./main.ts";


Deno.test("get random word", () => {
    const length : number = 5;
    let word : string = pick_random_word(length);
    assertEquals(word.length, 5);
});

Deno.test("get words with length 5", () => {
    assertEquals(get_words(5).length, 5084);
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
    const word = "write";
    assertEquals(true, is_valid(word));
 })

 Deno.test("get term", () => {
    const term : Term = {
        word: "write",
        definition: "produce a literary work"
    }
    assertEquals(term, get_term("write"));
 })

 Deno.test("get random term", () => {
    const term: Term = get_random_term(5);
    assertEquals(term.word.length, 5)
    assertEquals(term.definition.length > 0, true)
 })