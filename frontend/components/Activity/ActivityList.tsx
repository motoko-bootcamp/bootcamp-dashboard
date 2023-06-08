import React from "react"
import ActivityItem from "./ActivityItem"
import { Activity } from "../../types/types"
import "./_activity.scss"

interface ActivityListProps {
  activities: Activity[]
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <section className="activities">
      <h2>Intelligence Updates</h2>
      {activities?.length > 0 ? (
        activities.map((activity) => (
          <ActivityItem key={activity.activityId} activity={activity} />
        ))
      ) : (
        <p>No activities available at the moment.</p>
      )}
    </section>
  )
}

export default ActivityList
