import React, { useEffect, useState } from "react"
import "./_admin.scss"
import Heatmap from "../Charts/Heatmap"
import BarChart from "../Charts/BarChart"
import { useAdminDataStore } from "../../store/adminDataStore"
import { getVerifierActor } from "../../services/actorService"
import { useAuthStore } from "../../store/authstore"
import colors from "../../constants/colors"

const Admin: React.FC = () => {
  const [teamName, setTeamName] = useState("")
  const [day, setDay] = useState(1)
  const [studentPrincipalId, setStudentPrincipalId] = useState("")
  const [principalLookup, setPrincipalLookup] = useState("")
  const [bonusPoints, setBonusPoints] = useState("")
  const [bonusDescription, setBonusDescription] = useState("")
  const [studentName, setStudentName] = useState("")
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [isSpanish, setIsSpanish] = useState(false)

  const handleTimeEventAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    adminAnnounceTimedEvent(eventTitle)
    setEventTitle("")
    setEventDescription("")
  }

  const handleBonusPointsGrant = (e: React.FormEvent) => {
    e.preventDefault()
    adminGrantsBonusPoints(studentPrincipalId, bonusDescription)
  }
  const generatePreviewMessage = () => {
    if (studentPrincipalId && bonusDescription) {
      return `Preview: (Student Name) has been granted bonus points for ${bonusDescription}`
    }
    return ""
  }

  const adminManuallyVerifyStudentDay = useAdminDataStore(
    (state) => state.adminManuallyVerifyStudentDay,
  )
  const getTotalCompletedPerDay = useAdminDataStore(
    (state) => state.getTotalCompletedPerDay,
  )
  const totalCompletedPerDay = useAdminDataStore(
    (state) => state.totalCompletedPerDay,
  )

  const adminGrantsBonusPoints = useAdminDataStore(
    (state) => state.adminGrantsBonusPoints,
  )

  const getStudentPrincipalFromName = useAdminDataStore(
    (state) => state.getStudentPrincipalByName,
  )

  const adminAnnounceTimedEvent = useAdminDataStore(
    (state) => state.adminAnnounceTimedEvent,
  )

  const principalString = useAuthStore((state) => state.principalString)

  const handleTeamCreation = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle team creation logic
    console.log("Team created:", teamName)
    setTeamName("")
    adminCreateTeam(teamName, isSpanish)
  }
  const lookupStudentPrincipal = async () => {
    const studentPrincipal = await getStudentPrincipalFromName(studentName)
    return studentPrincipal
  }

  const handleProjectVerification = (e: React.FormEvent) => {
    e.preventDefault()
    adminManuallyVerifyStudentDay(BigInt(day), studentPrincipalId)
  }

  const handleAdminRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    useAdminDataStore.getState().registerAdmin(e.target[0].value)
  }

  const totalStudents = useAdminDataStore((state) => state.totalStudents)
  const totalTeams = useAdminDataStore((state) => state.totalTeams)
  const totalProjectsCompleted = useAdminDataStore(
    (state) => state.totalProjectsCompleted,
  )
  const adminCreateTeam = useAdminDataStore((state) => state.adminCreateTeam)
  const nameToPrincipal = useAdminDataStore((state) => state.nameToPrincipalId)

  useEffect(() => {
    useAdminDataStore.getState().getTotalStudents()
  }, [])

  useEffect(() => {
    useAdminDataStore.getState().getTotalTeams()
  }, [])

  useEffect(() => {
    useAdminDataStore.getState().getTotalProjectsCompleted()
  }, [])

  useEffect(() => {
    getTotalCompletedPerDay()
  }, [])

  const formatCycles = (cycles: number) => {
    const trillion = 1_000_000_000_000
    const formattedCycles = cycles / trillion

    return `${formattedCycles.toFixed(2)}T`
  }

  return (
    <>
      <div className="admin-container">
        <div className="card ">
          <h2>Welcome to the Admin Gateway</h2>
          <p>
            As an admin, you have the ability to manage various aspects of the
            platform, such as creating teams, manually verifying projects, and
            granting bonus points to students.
          </p>
          <p>
            If you're not yet registered as an admin, there's no need to
            register for the course. Instead, contact another admin to get
            registered with your principal ID:{" "}
            <span style={{ color: colors.primaryColor }}>
              {principalString}
            </span>
          </p>
        </div>

        <div className="card ">
          <BarChart
            totalUsers={parseInt(totalStudents)}
            totalTeams={parseInt(totalTeams)}
            totalProjectsCompleted={parseInt(totalProjectsCompleted)}
          />
        </div>
        {/* <div className="card double-width"><Heatmap /></div> */}
        <div className="card stats">
          <h2>App Statistics</h2>
          <p>Total Users: {totalStudents}</p>
          <p>Total Teams: {totalTeams}</p>
          <p>Total Projects Completed: {totalProjectsCompleted}</p>

          <p style={{ borderBottom: "1px solid grey" }}>
            Total Students Completed Per Day
          </p>

          {Object.entries(totalCompletedPerDay).map(([day, count]) => (
            <p key={day}>
              Day {day.substring(3)}: {count}
            </p>
          ))}
        </div>

        <div className="card team-creation">
          <h2>Create Team</h2>
          <form onSubmit={handleTeamCreation}>
            <input
              className="admin-input"
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <label className="spanish-checkbox-container">
              <input
                type="checkbox"
                checked={isSpanish}
                onChange={(e) => setIsSpanish(e.target.checked)}
                className="form-label"
              />
              <span className="form-label">Spanish</span>
            </label>

            <button className="admin-submit" type="submit">
              Create Team
            </button>
          </form>
        </div>
        <div className="card project-verification">
          <h2>Manual Project Verification</h2>
          <form onSubmit={handleProjectVerification}>
            <div className="admin-input-container">
              <label htmlFor="day" className="admin-input-label"></label>
              <select
                className="admin-input"
                id="day"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
              >
                <option value={1}>Day 1</option>
                <option value={2}>Day 2</option>
                <option value={3}>Day 3</option>
                <option value={4}>Day 4</option>
                <option value={5}>Day 5</option>
              </select>
            </div>
            <div className="admin-input-container">
              <label
                htmlFor="student-principal-id"
                className="admin-input-label"
              ></label>
              <input
                className="admin-input"
                id="student-principal-id"
                type="text"
                placeholder="Student Principal ID"
                value={studentPrincipalId}
                onChange={(e) => setStudentPrincipalId(e.target.value)}
              />
            </div>
            <button className="admin-submit" type="submit">
              Verify
            </button>
          </form>
        </div>
        <div className="card register-admin">
          <h2>Register New Admin</h2>
          <form onSubmit={handleAdminRegistration}>
            <input
              className="admin-input"
              type="text"
              placeholder="Principal ID"
            />
            <button className="admin-submit" type="submit">
              Register Admin
            </button>
          </form>
        </div>
        <div className="card grant-bonus-points">
          <h2>Grant Bonus Points</h2>
          <form onSubmit={handleBonusPointsGrant}>
            <div className="admin-input-container">
              <label
                htmlFor="student-principal-id-bonus"
                className="admin-input-label"
              ></label>
              <input
                className="admin-input"
                id="student-principal-id-bonus"
                type="text"
                placeholder="Student Principal ID"
                value={studentPrincipalId}
                onChange={(e) => setStudentPrincipalId(e.target.value)}
              />
            </div>
            <div className="admin-input-container">
              <label
                htmlFor="bonus-description"
                className="admin-input-label"
              ></label>
              <input
                className="admin-input"
                id="bonus-description"
                type="text"
                placeholder="Bonus Description"
                value={bonusDescription}
                onChange={(e) => setBonusDescription(e.target.value)}
              />
            </div>
            <p className="preview-message">{generatePreviewMessage()}</p>

            <button className="admin-submit" type="submit">
              Grant Bonus Point
            </button>
          </form>
        </div>
        <div className="card principal-id-lookup">
          <h2>Lookup Student Principal ID</h2>
          <div className="admin-input-container">
            <label htmlFor="student-name" className="admin-input-label"></label>
            <input
              className="admin-input"
              id="student-name"
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <button
            className="admin-submit"
            type="button"
            onClick={async () => {
              const result = await lookupStudentPrincipal()
              if ("ok" in result) {
                setPrincipalLookup(result.ok)
              } else {
                // Handle the error case, e.g., show an error message
                console.error(result.err)
              }
            }}
          >
            Lookup Principal ID
          </button>
          {nameToPrincipal && (
            <p className="principal-id-result">
              Student Principal ID: {nameToPrincipal}
            </p>
          )}
        </div>
      </div>
      {/* <div className="card double width">
        <HelpTicketFeed />
      </div> */}
    </>
  )
}

export default Admin
