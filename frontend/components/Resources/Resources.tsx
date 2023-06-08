import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faThumbsUp,
  faThumbsDown,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons"

const resourcesData = [
  {
    title: "10 Hilarious Ways to Confuse Your Co-Programmers",
    submittedBy: "CodeJester",
    description:
      "Discover the top 10 programming pranks that are sure to confuse and amuse your fellow developers. From creative variable names to absurdly complex one-liners, these tricks will have everyone scratching their heads and laughing out loud.",
    upvotes: 15,
    downvotes: 1,
  },
  {
    title: "Why Do Java Developers Wear Glasses?",
    submittedBy: "LaughingCoder",
    description:
      "Find out the punchline to this classic programming joke and many more! This collection of programming humor covers topics like Java, JavaScript, Python, and other popular languages. Get ready to laugh your way through your next coding session.",
    upvotes: 30,
    downvotes: 3,
  },
  {
    title: "The Recursive Guide to Programming Puns",
    submittedBy: "RecursiveRascal",
    description:
      "Dive deep into a never-ending world of programming puns that will leave you laughing so hard you'll forget your base case! This guide covers recursion, loops, data structures, and more, all with a humorous twist.",
    upvotes: 20,
    downvotes: 4,
  },
  {
    title: "Code Comments: The Art of Sarcasm and Wit",
    submittedBy: "SarcasticScribe",
    description:
      "Learn how to spice up your code with witty and sarcastic comments that will entertain anyone who reads it. This guide covers techniques for adding humor to your code while still maintaining clarity and professionalism.",
    upvotes: 25,
    downvotes: 2,
  },
]

const Resources = () => {
  const [expandedDescription, setExpandedDescription] = useState(null)

  const toggleDescription = (index) => {
    setExpandedDescription(expandedDescription === index ? null : index)
  }

  return (
    <div className="resources">
      <h2>Resources</h2>
      <ul>
        {resourcesData.map((resource, index) => (
          <li className="resource-item" key={index}>
            <div className="resource-info">
              <a href="#">{resource.title}</a>
              <span className="submitted-by">
                Submitted by: {resource.submittedBy}
              </span>
              <p
                className={`description ${
                  expandedDescription === index ? "expanded" : ""
                }`}
                onClick={() => toggleDescription(index)}
              >
                {resource.description}
                <FontAwesomeIcon
                  icon={
                    expandedDescription === index ? faChevronUp : faChevronDown
                  }
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    paddingLeft: "5px",
                  }}
                />
              </p>
            </div>
            <div className="vote-buttons">
              <button className="thumb-up">
                <FontAwesomeIcon icon={faThumbsUp} /> {resource.upvotes}
              </button>
              <button className="thumb-down">
                <FontAwesomeIcon icon={faThumbsDown} /> {resource.downvotes}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="submission-box">
        <h3>Submit a Resource</h3>
        <form>
          <input type="text" placeholder="Title" />
          <input type="text" placeholder="Submitted By" />
          <textarea placeholder="Description"></textarea>
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Resources
