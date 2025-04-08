import React from "react";
import { useState, useRef, useEffect } from "react";
import { useWindowSize } from "npm:react-use";
import Confetti from "npm:react-confetti";

import "./App.css";
import { is_valid } from "./main.ts";
import { get_random_term } from "./main.ts";

import "animate.css";


const keys: string[] = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split("");

enum Shortcuts {
  BACKSPACE = "BACKSPACE",
  ENTER = "ENTER",
  ESCAPE = "ESCAPE",
  SHIFT = "SHIFT"
}

function MyConfetti( { confetti } ) {
  const { width, height } = useWindowSize();
  if (!confetti)
    return <>
    </>

  return <>
    <Confetti key={ confetti } width={ width } height={ height } gravity="0.5" numberOfPieces="300" />
  </>
}

function Square( { letter, colors, onSquareClick } ) {
  let color = letter.length > 0 && colors != null ? colors[letter.charCodeAt(0) - "A".charCodeAt(0)] : "";
  return <button key={letter} className={`square ${color}`} onClick={onSquareClick}>{letter}</ button>;
}

function Word( { attempt, success, revealed } ) {
  let color = "";
  let success_animation = "";
  const indices: number[] = [0, 1, 2, 3, 4];

  if (success) {
    color = "square-attempted-present"; 
    success_animation = "animate__animated animate__flip";
  }

  if (revealed) {
    color = "square-attempted-revealed";
  }

  return <>
    <div>
    {
      indices.map((name, index) =>
        <button key={index} className={`square word ${color} ${success_animation}`}>{attempt.length > index ? attempt[index]: ''}</button>
      )
    }
    </div>
  </>
}

function Logo( { success } ) {
  const animation = success ? "animate__animated animate__shakeY" : "animate__animated animate__tada";

  return <>
    <div id="logo">
      <h1><img src="./owl.png" key={ success.toString() } className={ animation }></img> erudite</h1>
    </div>
  </>
}

function Credits() {
  return <>
    <div id="credits">
      <p>Owl created by <a href="https://www.flaticon.com/free-icons/owl" title="owl icons">Freepik - Flaticon</a> | Game developed by <a href="https://github.com/cathoderay">Ronald Kaiser</a></p>
    </div>
  </>
}

function Score( { score } ) {
  return <>
    <div id="score">
      <p>score: {score}</p>
    </div>
  </>
}

function Definition( { term }) {
  return <>
    <div id="definition" key={ term.word } className="animate__animated animate__fadeInDown">
      <p >{ term.definition }</p>
    </div>
  </>
}

function WordContainer({ attempt, success, status, revealed }) {
  return <>
    <div id="word-container">
      <Word attempt={ attempt } success={ success } revealed={ revealed } />
    </ div>
  </>
}

function Status( { status } ) {
  return <>
    <div id="status">{ status }</div>
  </>
}

function KeyboardRow( { start, finish, keyboard_colors, add_letter }) {
  start = Number(start);
  finish = Number(finish);

  return <>
    <div>
    {
      keys.slice(start, finish).map((name, index) => {
        return <Square key={ keys[start + index] } colors={ keyboard_colors } letter={ keys[start + index] } onSquareClick={ () => add_letter(keys[start + index]) } />
      })
    }
    </div>
  </>
}

function Keyboard( { keyboard_colors, add_letter }) {
  return <>
    <div id="keyboard-container">
      <KeyboardRow start="0" finish="10" keyboard_colors={ keyboard_colors } add_letter={ add_letter } />
      <KeyboardRow start="10" finish="19" keyboard_colors={ keyboard_colors } add_letter={ add_letter } />
      <KeyboardRow start="19" finish="26" keyboard_colors={ keyboard_colors } add_letter={ add_letter } />
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
  const [term, setTerm] = useState(get_random_term(5));
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [keyboard_colors, setKeyboardColors] = useState(Array(26).fill("square-unattempted"));
  const [status, setStatus] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [confetti, setConfetti] = useState(false);

  function addLetter(letter: string) {
    if (attempt.length == term.word.length){
      return
    }
    cleanStatus();
    setAttempt(attempt + letter);
  }

  function removeLetter() {
    if (attempt.length == 0 || success || revealed)
      return;
    setSuccess(false);
    cleanStatus();
    setAttempt(attempt.substring(0, attempt.length-1))
  }

  function checkAttempt() {
    if (revealed) {
      setStatusWithTimeout("word was revealed");
      return;
    }

    if (attempt.length < term.word.length) {
      setStatusWithTimeout("too short");
      return;
    }

    if (!is_valid(attempt.toLowerCase()) ) {
      setStatusWithTimeout("not in word list");
      return;
    }

    if (attempts.includes(attempt)){
      setStatusWithTimeout("already tried");
      return;
    }

    if (attempt.toLowerCase() != term.word) {
      setStatusWithTimeout("incorrect");
    
      setAttempts([
        ...attempts,
        attempt
      ]);

      for(let i = 0; i <= attempt.length; i++) {
        const pos = (attempt.toUpperCase()).charCodeAt(i) - "A".charCodeAt(0);
        if (! (term.word.toUpperCase()).includes(attempt[i])) {
          keyboard_colors[pos] = "square-attempted-not-present";
        }
        else {
          keyboard_colors[pos] = "square-attempted-present"
        }
      }
      setKeyboardColors(keyboard_colors)
    }

    if (attempt.toLowerCase() == term.word) {
      if (!success) setScore(score + 100);

      setConfetti(true);
      setTimeout(() => { setConfetti(false); }, 4000);
      setSuccess(true);
    }
 }

  function reveal() {
    if (revealed || success) return;
    cleanStatus();
    setAttempt(term.word.toUpperCase());
    setRevealed(true);
  }

  function setStatusWithTimeout(status) {
    setStatus(status);
    setTimeout(() => { cleanStatus(); }, 3000);
  }

  function cleanStatus() {
    return setStatus("");
  }

  function next() {
    setSuccess(false);
    setRevealed(false);
    cleanStatus();
    setTerm(get_random_term(5));
    setAttempt("");
    setAttempts([]);
    setConfetti(false);
    setKeyboardColors(Array(26).fill("square-unattempted"));
  }

  console.log(term.word);

  const onKeyDownHandler = ({ key }) => {
    key = key.toUpperCase();
    console.log("Key Pressed: " + String(key));

    switch (key) {
      case Shortcuts.BACKSPACE:
        removeLetter();
        break;
      case Shortcuts.ENTER:
        checkAttempt();
        break;
      case Shortcuts.ESCAPE:
        next();
        break;
      case Shortcuts.SHIFT:
        reveal();
        break;
      default:
        if (attempt.length < term.word.length && (keys.includes(key)))
          addLetter(key);
    }
  };

  useEventListener("keydown", onKeyDownHandler);

  return (
    <>
      <div>
        <MyConfetti confetti={ confetti } />
        <Credits />
        <Logo success={ success } />
        <Definition term={ term } />
        <Status status={ status } />
        <WordContainer attempt={ attempt } success={ success } status={ status } revealed={ revealed } />
        <Score score={ score } />

        <div id="controls">
          <Keyboard keyboard_colors={ keyboard_colors } add_letter={ addLetter } />

          <div id="actions">
            <button key="check" onClick={ checkAttempt }>check</button>
            <button key="next" onClick={ next }>next</button>
            <button key="reveal" onClick={ reveal }>reveal</button>
            <button key="delete" onClick={ removeLetter }>delete</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
