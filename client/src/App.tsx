import { useState, useRef, useEffect } from "react";

import "./App.css";
import { is_valid } from "./main.ts";
import { get_random_term } from "./main.ts";

import "animate.css";


function Square( { letter, colors, onSquareClick } ) {
  let color = letter.length > 0 && colors != null ? colors[letter.charCodeAt(0) - "A".charCodeAt(0)] : "";
  return <button key={letter} className={`square ${color}`} onClick={onSquareClick}>{letter}</ button>;
}

function Word( { attempt, success } ) {
  let color = "";
  let success_animation = "";
  const letters: number[] = [0, 1, 2, 3, 4];

  if (success) {
    color = "square-attempted-present"; 
    success_animation = "animate__animated animate__flip";
  }

  return <>
      {
        letters.map((name, index) =>
          <button key={index} className={`square word ${color} ${success_animation}`}>{attempt.length > index ? attempt[index]: ''}</button>
        )
      }
    </>
  }

function Logo() {
  return <>
    <div id="logo" className="animate__animated animate__swing">
      <h1><img src="./owl.png" width="10%" height="10%"></img> erudite</h1>
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

function WordContainer({ attempt, success, status }) {
  return <>
    <div id="word-container">
      <Word attempt={ attempt } success={ success } />
      <div id="status">{ status }</div>
    </ div>
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
    if (attempt.length == 0 || success)
      return
    setSuccess(false);
    setAttempt(attempt.substring(0, attempt.length-1))
  }

  function checkAttempt() {
    if (attempt.length < term.word.length) {
      setStatusWithTimeout("Too short");
      return;
    }

    if (!is_valid(attempt.toLowerCase()) ) {
      setStatusWithTimeout("Not in word list");
      return;
    }

    if (attempt.toLowerCase() != term.word) {
      setStatusWithTimeout("Incorrect");
    
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
      setStatusWithTimeout("Correct!");
    }
  }

  function setStatusWithTimeout(status) {
    setStatus(status);
    setTimeout(() => { setStatus(""); }, 3000);
  }

  function cleanStatus() {
    return setStatus("");
  }

  function restart() {
    setSuccess(false);
    cleanStatus();
    setTerm(get_random_term(5));
    setAttempt("");
    setKeyboardColors(Array(26).fill("square-unattempted"));
  }

  console.log(term.word);

  const handler = ({ key }) => {
    console.log("Key Pressed: " + String(key));
    if (attempt.length < term.word.length && (letters.includes(key) || letters.includes(key.toUpperCase()))) {
      setAttempt(attempt + key.toUpperCase())
    }
    else if (key == "Backspace" && !success) {
      if (attempt.length > 0)
        setAttempt(attempt.substring(0, attempt.length - 1))
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
        <Definition term={ term } />
        <WordContainer attempt={ attempt } success={ success } status={ status } />
        <Score score={ score } />

        <div id="controls">
          <div id="keyboard-container">
            {
              letters.map((name, index) => 
                <Square key={ letters[index] } colors={ keyboard_colors } letter={ letters[index] } onSquareClick={ () => addLetter(letters[index]) } />
              )
            }
          </div>

          <button key="check" onClick={ checkAttempt } >check</ button>
          <button key="pick" onClick={ restart }>pick another word</ button>
          <button key="delete" onClick={ removeLetter }>delete</ button>
        </div>
      </div>
    </>
  );
}

export default App;
