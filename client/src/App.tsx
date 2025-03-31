import { useState, useRef, useEffect } from "react";
import "./App.css";
import { pick_random_word } from "./main.ts";
import { get_definition } from "./main.ts";
import { is_valid } from "./main.ts";
import "animate.css";

function Square( { letter, colors, onSquareClick } ) {
  let color = letter.length > 0 && colors != null ? colors[letter.charCodeAt(0) - "A".charCodeAt(0)] : "";

  return <button key={letter} className={`square ${color}`} onClick={onSquareClick}>{letter}</ button>;
}

function Word( { current_attempt, success}) {
  let color = "";
  let success_animation = "";
  if (success) {
    color = "square-attempted-present"; 
    success_animation = "animate__animated animate__flip";
  }
  return <>
    <button key="0" className={`square word ${color} ${success_animation}`}>{current_attempt.length > 0 ? current_attempt[0]: ''}</button>
    <button key="1" className={`square word ${color} ${success_animation}`}>{current_attempt.length > 1 ? current_attempt[1]: ''}</button>
    <button key="2" className={`square word ${color} ${success_animation}`}>{current_attempt.length > 2 ? current_attempt[2]: ''}</button>
    <button key="3" className={`square word ${color} ${success_animation}`}>{current_attempt.length > 3 ? current_attempt[3]: ''}</button>
    <button key="4" className={`square word ${color} ${success_animation}`}>{current_attempt.length > 4 ? current_attempt[4]: ''}</button>
  </>
}

function Logo() {
  return <>
    <div id="logo" className="animate__animated animate__slideInDown">
      <h1>ERUDITE</h1>
    </div>
  </>
}

function Credits() {
  return <>
    <div id="credits">
      <span>version: 0.1 - Game developed by <a href="https://github.com/cathoderay">Ronald Kaiser</a></span>
    </div>
  </>

}

function Definition( { word, definition }) {
  return <>
    <div id="definition" key={word} >
      <p className="animate__animated animate__fadeInDown">{ definition }</p>
    </div>
  </>
}

const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};


function App() {
  const [current_word, setCurrentWord] = useState(pick_random_word(5).toUpperCase());
  const [current_definition, setCurrentDefinition] = useState(get_definition(current_word.toLowerCase()));
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
      setMessage("Not in word list");
      setTimeout(() => { setMessage(""); }, 3000);
      return;
    }

    if (current_attempt != current_word) {
      setMessage("Incorrect");
    
      setTimeout(() => { 
        setMessage("");
      }, 3000);

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
    const new_word = pick_random_word(5).toUpperCase();
    setCurrentWord(new_word);
    setCurrentDefinition(get_definition(new_word.toLowerCase()));
    setCurrentAttempt("");
    setKeyboardColors(Array(26).fill("square-unattempted"));
  }

  console.log(current_word);

  const handler = ({ key }) => {
    console.log("Key Pressed: " + String(key));
    if (current_attempt.length < current_word.length && (letters.includes(key) || letters.includes(key.toUpperCase()))) {
      setCurrentAttempt(current_attempt + key.toUpperCase())
    }
    else if (key == "Backspace" && !success) {
      if (current_attempt.length > 0)
        setCurrentAttempt(current_attempt.substring(0, current_attempt.length - 1))
    }
    else if (key == "Enter") {
      checkAttempt();
    }
    else if (key == "Escape") {
      restart();
    }
  };
  useEventListener("keydown", handler);

  return (
    <>
      <div>
        <Credits />

        <Logo />
        <Definition word={current_word} definition={current_definition} /> 

        <div id="word-container">
          <Word current_attempt={ current_attempt } current_word={ current_word } success = { success } />
          <div id="status">{message}</div>
        </ div>

        <div id="score">
          <p>score: {score}</p>
        </div>

        <div id="controls">
          <div id="keyboard-container">
            {
              letters.map((name, index) => 
                <Square key={letters[index]} colors={keyboard_colors} letter={letters[index]} onSquareClick={() => addLetter(letters[index])} />
              )
            }
          </div>

          <button key="check" onClick={checkAttempt} >check</ button>
          <button key="pick" onClick={restart}>pick another word</ button>
          <button key="delete" onClick={removeLetter}>delete</ button>
        </div>
      </div>
    </>
  );
}

export default App;
