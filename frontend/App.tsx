import React, { lazy, Suspense, useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./index.scss"

const Header = lazy(() => import("./components/Header/Header"))
const Nav = lazy(() => import("./components/Nav/Nav"))
const TeamList = lazy(() => import("./components/Team/TeamList"))
const ActivityList = lazy(() => import("./components/Activity/ActivityList"))
const Footer = lazy(() => import("./components/Footer/Footer"))
import Admin from "./components/Admin/Admin"
import Profile from "./components/Profile/Profile"
import { Team, Activity, TeamString } from "./types/types"

import LoadingScreen from "./components/Loading/LoadingScreen"
import Submit from "./components/Submit/Submit"
import { useActivityStore } from "./store/activityStore"
import { useTeamStore } from "./store/teamStore"
import { useAuthStore } from "./store/authstore"
import { Toaster } from "react-hot-toast"
import { getAllTeams } from "./services/actorService"
import Registration from "./components/Registration/registration"
import Schedule from "./components/Schedule/Schedule"
import Resources from "./components/Resources/Resources"
import { useUserStore } from "./store/userStore"

//Dummy data for testing purposes
const dummyTeams: TeamString[] = [
  {
    name: "Team Alpha",
    teamMembers: ["1", "2", "3", "4", "5"],
    score: "150",
  },
  {
    name: "Team Bravo",
    teamMembers: ["6", "7", "8", "9", "10"],
    score: "200",
  },
]

function App() {
  const activities = useActivityStore((state) => state.activities)
  const getActivityFeed = useActivityStore((state) => state.getActivityFeed)

  const teams = useTeamStore((state) => state.teams)

  const [team, setTeam] = useState<TeamString[]>(dummyTeams)

  useEffect(() => {
    getActivityFeed()
    const intervalId = setInterval(() => {
      getActivityFeed()
    }, 5000)

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Toaster />

          <Nav />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <React.Suspense fallback={<div>Loading TeamList...</div>}>
                      <TeamList />
                    </React.Suspense>
                    <ActivityList activities={activities} />
                  </>
                }
              />
              <Route path="Submit" element={<Submit />} />
              <Route path="Schedule" element={<Schedule />} />
              <Route path="Resources" element={<Resources />} />

              <Route
                path="Profile"
                element={<Profile user={useUserStore.getState().user} />}
              />
              <Route path="register" element={<Registration />} />
              <Route path="Admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </Router>
    </div>
  )
}

export default () => <App />
