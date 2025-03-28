import { useState } from "react";
import "./App.css";
import { pick_random_word } from "./main.ts";
import { get_definition } from "./main.ts";
import { is_valid } from "./main.ts";


function Square( { letter, colors, onSquareClick } ) {
  let color = letter.length > 0 && colors != null ? colors[letter.charCodeAt(0) - "A".charCodeAt(0)] : "";

  return <button key={letter} className={`square ${color}`}  onClick={onSquareClick}>{letter}</ button>;
}

function Word( { current_attempt, success}) {
  let color = "";
  if (success) color = "square-attempted-present"; 
  return <>
    <button key="0" className={`square word ${color}`}>{current_attempt.length > 0 ? current_attempt[0]: ''}</button>
    <button key="1" className={`square word ${color}`}>{current_attempt.length > 1 ? current_attempt[1]: ''}</button>
    <button key="2" className={`square word ${color}`}>{current_attempt.length > 2 ? current_attempt[2]: ''}</button>
    <button key="3" className={`square word ${color}`}>{current_attempt.length > 3 ? current_attempt[3]: ''}</button>
    <button key="4" className={`square word ${color}`}>{current_attempt.length > 4 ? current_attempt[4]: ''}</button>
    <p></p>
  </>
}

function App() {
  const [current_word, setCurrentWord] = useState(pick_random_word(5).toUpperCase());
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  const [current_attempt, setCurrentAttempt] = useState('');
  const [keyboard_colors, setKeyboardColors] = useState(Array(26).fill("square-unattempted"));
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState([]);
  const letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");

  function addLetter(letter: string) {
    if (current_attempt.length == current_word.length){
      return
    }
    setCurrentAttempt(current_attempt + letter);
  }

  function removeLetter() {
    if (current_attempt.length == 0 || success)
      return
    setSuccess(false);
    setCurrentAttempt(current_attempt.substring(0, current_attempt.length-1))
  }

  function checkAttempt() {
    if (current_attempt.length < current_word.length) {
      setMessage("Too short");
      setTimeout(() => { setMessage(""); }, 3000);

      return
    }

    if ( !is_valid(current_attempt.toLowerCase()) ) {
      setMessage("Invalid");
      setTimeout(() => { setMessage(""); }, 3000);
      return;
    }

    if (current_attempt != current_word) {
      setMessage("Incorrect");
      setTimeout(() => { setMessage(""); }, 3000);

      setAttempts([
        ...attempts,
        current_attempt
      ]);

      for(let i = 0; i <= current_attempt.length; i++) {
        const pos = current_attempt.charCodeAt(i) - "A".charCodeAt(0);
        if (! current_word.includes(current_attempt[i])) {
          keyboard_colors[pos] = "square-attempted-not-present";
          setKeyboardColors(keyboard_colors)
        }
        else {
          keyboard_colors[pos] = "square-attempted-present"
          setKeyboardColors(keyboard_colors)
        }
      }
    }

    if (current_attempt == current_word) {
      if (!success)
        setScore(score + 10);
      setSuccess(true);
      setMessage("Correct!");
      setTimeout(() => { setMessage(""); }, 3000);
    }
  }

  function restart() {
    setSuccess(false);
    setMessage("");
    setTimeout(() => { setMessage(""); }, 3000);
    setCurrentWord(pick_random_word(5).toUpperCase());
    setCurrentAttempt("");
    setKeyboardColors(Array(26).fill("square-unattempted"));
  }

  console.log(current_word);

  return (
    <>
      <div>
        <div id="credits">
          <span>version: 0.1 - Game developed by <a href="https://github.com/cathoderay">Ronald Kaiser</a></span>
        </div>

        <div id="logo">
          <h1>ERUDITE</h1>
        </div>


        <div id="definition">
          <p>{ get_definition(current_word.toLowerCase()) }</p>
        </div>

        <div id="word-container">
          <div id="status">{message}</div>
          <Word current_attempt={ current_attempt } current_word={ current_word } success = { success } />
        </ div>

        <div id="score">
          <p>score: {score}</p>
        </div>

        <div id="keyboard-container">
          {
            letters.map((name, index) => 
              <Square key={letters[index]} colors={keyboard_colors} letter={letters[index]} onSquareClick={() => addLetter(letters[index])} />
            )
          }
        </div>

        <div id="controls">
          <button key="check" onClick={checkAttempt} >check</ button>
          <button key="pick" onClick={restart}>pick another word</ button>
          <button key="delete" onClick={removeLetter}>delete</ button>
        </div>
      </div>
    </>
  );
}

export default App;
