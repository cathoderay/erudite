Erudite
=======

<img width="730" alt="Screenshot 2025-04-18 at 12 54 05" src="https://github.com/user-attachments/assets/90debef8-964b-409d-bd47-863d7c1b26ca" />


This is a simple word game, inspired by daily [NYT games](https://www.nytco.com/products/games/), specially [Wordle](https://www.nytimes.com/games/wordle/index.html).

I'm developing this game for some reasons: 
1. improve my vocabulary;
2. practice some javascript/typescript (specially interested in the promising [deno](https://github.com/denoland) runtime);
3. Having fun.

How it works
------------
You have to figure out what is the word based on the definition presented.

If you make an incorrect guess, any correct letter will be highlighted in green in the UI.

Desktop version allows you to use keyboard shortcuts for all actions:
1. simply type the word with your keyboard (or use the keyboard in the UI);
2. delete a letter by pressing `Backspace` (or press the button `delete`);
3. check if word is correct by pressing `Enter` (or press the button `check`);
4. reveal solution when you don't know the answer by pressing `Shift` (or press the button `reveal`);
5. pick another word/definition by pressing `Esc` (or press the button `next`).

Currently, every correct attempt gives 100 points.
For now, you don't lose point, you can only increase your score.

Demo
----------
Go to https://erudite-demo.deno.dev

Dataset
------
The list of words is a subset of https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt.

The definitions come from wordnet through nltk.

Contributions/collaborations
----------------------------
This is a work in progress. 

Any suggestions and collaborations are welcome!

Let's get in touch!
