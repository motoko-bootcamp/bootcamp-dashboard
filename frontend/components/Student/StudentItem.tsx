import React from "react"
import { StudentList } from "../../types/types"
import "./_student.scss"

interface StudentItemProps {
  student: StudentList
}

const StudentItem: React.FC<StudentItemProps> = ({ student }) => {
  const renderBonusIcons = (score: number) => {
    let icons = []
    const maxIcons = 4
    const starCounter = Math.min(score, maxIcons)

    for (let i = 0; i < starCounter; i++) {
      icons.push(
        <span className="BonusIcons Emoji" key={`star-${i}`}>
          ⭐️
        </span>,
      )
    }

    if (score > maxIcons) {
      icons.push(
        <div className="BonusIcons StarWithMultiplier" key="starWithMultiplier">
          <span className="BonusIcons Emoji">⭐️</span>
          <span className="Multiplier">+{score - maxIcons}</span>
        </div>,
      )
    }

    const emptySlots = maxIcons - starCounter
    for (let i = 0; i < emptySlots; i++) {
      icons.push(
        <span className="BonusIcons Emoji" key={`empty-${i}`}>
          &nbsp;
        </span>,
      )
    }

    return <div className="BonusIconsContainer">{icons}</div>
  }

  const renderSkeletonLoader = () => {
    return (
      <div className="Student-item">
        <div className="skeleton skeleton-name"></div>
        <div className="skeleton skeleton-rank"></div>
        <div className="skeleton skeleton-progress"></div>
        <div className="progress-bar">
          <div className="skeleton skeleton-progress-bar"></div>
        </div>
      </div>
    )
  }

  return student ? (
    <div className="Student-item">
      <h4>{student.name}</h4>
      {renderBonusIcons(parseInt(student.bonusPoints))}
      {/* <p>Rank: {student.rank}</p> */}
      <p>Progress: {student.score.toString()}%</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${student.score}%` }}></div>
      </div>
    </div>
  ) : (
    renderSkeletonLoader()
  )
}

export default StudentItem
