import React, { useEffect, useState } from "react"
import StudentItem from "./StudentItem"
import { useTeamStore } from "../../store/teamStore"
import { StudentList } from "frontend/types/types"

interface TeamProps {
  teamName: string
}

const Team: React.FC<TeamProps> = ({ teamName }) => {
  const getStudentsForTeamDashboard = useTeamStore(
    (state) => state.getStudentsForTeamDashboard,
  )

  const [students, setStudents] = useState<StudentList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      const result = await getStudentsForTeamDashboard(teamName)
      if ("ok" in result) {
        setStudents(result.ok) // set the students to the local state
        setLoading(false) // set the loading state to false
      } else {
        console.error(result.err) // handle the error case
      }
    }
    fetchStudents()
  }, [teamName, getStudentsForTeamDashboard])

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
    <div>
      {loading
        ? renderStudentSkeleton()
        : students.map((student: StudentList) => (
            <StudentItem student={student} key={student.name} />
          ))}
    </div>
  )
}

export default Team
