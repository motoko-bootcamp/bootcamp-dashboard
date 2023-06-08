import React from "react"
import "./_schedule.scss"

const Schedule = () => {
  return (
    <div className="schedule">
      <h2>Our Schedule</h2>
      <iframe
        className="calendar-iframe"
        src="https://calendar.google.com/calendar/u/0/embed?src=c_6aa8747b96696ec2475587b7d256d56eec735ddca3f2c5cebb32093e0f4667bc@group.calendar.google.com"
        width="800"
        height="600"
        scrolling="no"
        title="Google Calendar"
      ></iframe>
    </div>
  )
}

export default Schedule
