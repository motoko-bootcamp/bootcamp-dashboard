import React from "react"
import { Activity } from "../../types/types"
import "./_activity.scss"

interface ActivityItemProps {
  activity: Activity
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const isSpecialAnnouncement =
    activity.specialAnnouncement === "newStudent" ||
    activity.specialAnnouncement === "newTeam" ||
    activity.specialAnnouncement === "adminTimeEvent" ||
    activity.specialAnnouncement === "BonusPoints" ||
    activity.specialAnnouncement === "ProjectCompleted"

  const emojis = [
    "🎉",
    "🪖",
    "🎖️",
    "✊",
    "💪",
    "👊",
    "🛡️",
    "🎗️",
    "🏋️",
    "🏅",
    "🌟",
  ]

  const randomEmoji = () => {
    switch (activity.specialAnnouncement) {
      case "BonusPoints":
        return <span className="emoji bonus">{"⭐️"}</span>
      case "ProjectCompleted":
        return <span className="emoji">{"🏅"}</span>
      case "newStudent":
        return <span className="emoji">{"🎉"}</span>
      case "newTeam":
        return <span className="emoji">{"🪖"}</span>
      case "adminTimeEvent":
        return <span className="emoji">{"⏰"}</span>
      case "newAdmin":
        return <span className="emoji">{"👨‍🏫"}</span>
      case "newTeamMember":
        return <span className="emoji">{"💪"}</span>
      case "Admin":
        return <span className="emoji">{"📢"}</span>

      default:
        return (
          <span className="emoji">
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </span>
        )
    }
  }

  return (
    <div
      className={`activity-item ${
        isSpecialAnnouncement
          ? `special-announcement-${activity.specialAnnouncement}`
          : ""
      }`}
    >
      <p>
        {activity.activity} {randomEmoji()}
      </p>
    </div>
  )
}

export default ActivityItem
