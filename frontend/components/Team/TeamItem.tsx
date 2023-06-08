import React, { useState, useEffect } from "react"
import { TeamString } from "../../types/types"
import StudentItem from "../Student/StudentItem"
import { useTeamStore } from "../../store/teamStore"
import { StudentList } from "frontend/types/types"

interface TeamItemProps {
  teamname: string
  teamscore: string
}

const TeamItem: React.FC<TeamItemProps> = ({ teamname, teamscore }) => {
  const getStudentsForTeamDashboard = useTeamStore(
    (state) => state.getStudentsForTeamDashboard,
  )

  const [students, setStudents] = useState<StudentList[]>([])
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [studentsLoading, setStudentsLoading] = useState(true)

  const handleToggle = (event) => {
    event.stopPropagation()
    setIsActive(!isActive)
  }

  useEffect(() => {
    const fetchStudents = async () => {
      const result = await getStudentsForTeamDashboard(teamname)
      if ("ok" in result) {
        setStudents(result.ok)
        setStudentsLoading(false)
      } else {
        console.error(result.err)
      }
    }

    if (isActive) {
      fetchStudents()
    }
  }, [isActive, teamname, getStudentsForTeamDashboard])

  useEffect(() => {
    if (teamscore !== undefined) {
      setLoading(false)
    }
  }, [teamscore])

  const renderStudentSkeleton = () => (
    <div className="skeleton-student">
      <div className="skeleton skeleton-name"></div>
      <div className="skeleton skeleton-rank"></div>
      <div className="skeleton skeleton-progress"></div>
      <div className="progress-bar">
        <div className="skeleton skeleton-progress-bar"></div>
      </div>
    </div>
  )

  return (
    <div
      className={`team-item ${isActive ? "active" : ""}`}
      onClick={handleToggle}
    >
      <div className="team-item-header">
        <h3>{teamname}</h3>
        <span className={`toggle-arrow ${isActive ? "rotated" : ""}`}>▼</span>
      </div>

      {loading ? (
        <div className="skeleton skeleton-score"></div>
      ) : (
        <p>
          {" "}
          <>Score: {teamscore.toString()} </>
        </p>
      )}

      {loading ? (
        <div className="skeleton skeleton-progress-bar"></div>
      ) : (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${teamscore}%` }}></div>
        </div>
      )}

      <div
        className={`menu-overlay ${isActive ? "menu-overlay-open" : ""}`}
        onClick={handleToggle}
      >
        <div className="menu-container">
          <button className="close-button" onClick={handleToggle}>
            &times;
          </button>
          <div className="Student-list-container">
            <div className="Student-list">
              {isActive && studentsLoading
                ? renderStudentSkeleton()
                : students.map((student: StudentList) => (
                    <StudentItem student={student} key={student.name} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamItem
