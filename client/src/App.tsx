import { useState, useRef, useEffect } from "react";

import "./App.css";
import { is_valid } from "./main.ts";
import { get_random_term } from "./main.ts";

import "animate.css";


function Square( { letter, colors, onSquareClick } ) {
  let color = letter.length > 0 && colors != null ? colors[letter.charCodeAt(0) - "A".charCodeAt(0)] : "";
  return <button key={letter} className={`square ${color}`} onClick={onSquareClick}>{letter}</ button>;
}

function Word( { attempt, success, revealed } ) {
  let color = "";
  let success_animation = "";
  const letters: number[] = [0, 1, 2, 3, 4];

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
      letters.map((name, index) =>
        <button key={index} className={`square word ${color} ${success_animation}`}>{attempt.length > index ? attempt[index]: ''}</button>
      )
    }
    </div>
  </>
}

function Logo() {
  return <>
    <div id="logo">
      <h1><img src="./owl.png" className="animate__animated animate__swing"></img> erudite</h1>
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
  const letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");

  function addLetter(letter: string) {
    if (attempt.length == term.word.length){
      return
    }
    setAttempt(attempt + letter);
  }

  function removeLetter() {
    if (attempt.length == 0 || success || revealed)
      return;
    setSuccess(false);
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
      setScore(score - 10);
    
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
      setSuccess(true);
      setStatusWithTimeout("correct!");
    }
 }

  function reveal() {
    if (revealed || success)
      return;
    setAttempt(term.word.toUpperCase());
    setScore(score - 20);
    setRevealed(true);
  }

  function setStatusWithTimeout(status) {
    setStatus(status);
    setTimeout(() => { setStatus(""); }, 3000);
  }

  function cleanStatus() {
    return setStatus("");
  }

  function next() {
    if (!success && !revealed) {
      setScore(score - 10);
    }
    setSuccess(false);
    setRevealed(false);
    cleanStatus();
    setTerm(get_random_term(5));
    setAttempt("");
    setAttempts([]);
    setKeyboardColors(Array(26).fill("square-unattempted"));
  }

  console.log(term.word);

  const handler = ({ key }) => {
    console.log("Key Pressed: " + String(key));

    if (attempt.length < term.word.length && (letters.includes(key) || letters.includes(key.toUpperCase()))) {
      addLetter(key.toUpperCase());
    }
    else if (key == "Backspace") {
      removeLetter();
    }
    else if (key == "Enter") {
      checkAttempt();
    }
    else if (key == "Escape") {
      next();
    }
    else if (key == "Shift") {
      reveal();
    }
  };

  useEventListener("keydown", handler);

  return (
    <>
      <div>
        <Credits />
        <Logo />
        <Definition term={ term } />
        <Status status={ status } />
        <WordContainer attempt={ attempt } success={ success } status={ status } revealed={ revealed } />
        <Score score={ score } />

        <div id="controls">
          <div id="keyboard-container">
            {
              letters.map((name, index) => 
                <Square key={ letters[index] } colors={ keyboard_colors } letter={ letters[index] } onSquareClick={ () => addLetter(letters[index]) } />
              )
            }
          </div>

          <div id="actions">
            <button key="check" onClick={ checkAttempt }>check</button>
            <button key="pick" onClick={ next }>next</button>
            <button key="reveal" onClick={ reveal }>reveal</button>
            <button key="delete" onClick={ removeLetter }>delete</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
