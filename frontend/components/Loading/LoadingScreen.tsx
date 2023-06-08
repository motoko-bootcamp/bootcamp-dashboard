// src/components/LoadingScreen.tsx
import React, { useEffect, useState, useRef } from "react"
import { images } from "../../constants/constants"
import logo from "../../assets/images/motokobootcamp.png"
import "./_loading.scss"

const funnySayings = [
  "Assembling canisters...",
  "Taming the wild Motoko...",
  "Rebooting the Internet Computer...",
  "Teaching Motoko new tricks...",
  "Gathering consensus...",
  "Calibrating neurons...",
  "Shaking hands with a neuron...",
  "Spinning up a subnet...",
  "Scaling the infinite...",
  "Bringing canisters to life...",
  "Updating dfinity...",
  "Reviving the can-can...",
  "Instructors on coffee break...",
  "Rustling up some student motivation...",
  "Programmers in a loop, please stand by...",
  "Boot camp drill: Drop and give me 20 lines of code!",
  "Boot camp drill: 10 push-ups, 10 pull-ups, 10 lines of code!",
  "Instructors are never wrong, only misunderstood...",
  "Recruiting neurons for the next subnet...",
  "Syntax-error free since '23...",
  "Debugging student code, brace for impact...",
  "The instructors have left the building...",
  "Code smarter, not harder...",
  "Motoko Bootcamp: Where bugs fear to tread...",
  "No programmer left behind...",
  "We take no prisoners, only canisters...",
  "Drill Instructor: You call that a function?!",
  "In Motoko we trust...",
  "Canister push-ups in progress...",
  "Students vs. bugs: the eternal battle...",
  "Rumor has it, instructors dream in code...",
  "Motoko: faster, stronger, smarter...",
  "Programmers do it with class...",
  "Marching towards code excellence...",
  "Got 99 problems but a glitch ain't one...",
  "Decoding the secrets of the universe...",
  "Arrays start at 0, and so do we...",
  "Forging future programming superheroes...",
  "Bootcamp: where syntax errors meet their doom...",
  "Keep calm and code on...",
  "Silicon-powered brainiacs at work...",
  "Compiling the wisdom of the ages...",
  "Searching for the holy grail of clean code...",
  "Making the virtual world a reality...",
  "Cracking the code, one line at a time...",
  "Code like there's no tomorrow...",
  "Drill Instructor: Recursion is your friend!",
  "Fueling the engine of the Internet Computer...",
  "Expect the unexpected... in code.",
]

const getRandomSaying = () => {
  const index = Math.floor(Math.random() * funnySayings.length)
  return funnySayings[index]
}

interface LoadingScreenProps {
  loaderSize?: string
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loaderSize }) => {
  const [loadingText, setLoadingText] = useState(getRandomSaying())
  const [isImageVisible, setImageVisible] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImageVisible(true)
          observer.disconnect()
        }
      })
    })

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className={
        loaderSize === "sm" ? "loading-screen-small" : "loading-screen"
      }
    >
      {isImageVisible ? (
        <img
          ref={imageRef}
          src={logo}
          alt="Motoko Bootcamp"
          className="loading-image"
        />
      ) : (
        <div ref={imageRef} className="loading-image-placeholder" />
      )}
      <p className="loading-text">{loadingText}</p>
    </div>
  )
}

export default LoadingScreen
