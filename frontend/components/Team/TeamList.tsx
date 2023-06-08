import React from "react"
import TeamItem from "./TeamItem"
import { Team, TeamString } from "../../types/types"
import "./_team.scss"
import { useTeamStore } from "../../store/teamStore"
import { useEffect } from "react"

interface TeamListProps {}

const TeamList: React.FC<TeamListProps> = () => {
  const teams = useTeamStore((state) => state.teams)
  const getAllTeams = useTeamStore((state) => state.getAllTeams)

  useEffect(() => {
    getAllTeams()
    if (teams === undefined) {
      getAllTeams()
    }
  }, [])

  return (
    <section>
      <h2>Teams</h2>
      {teams &&
        teams.map((team) => (
          <TeamItem
            key={team.name}
            teamname={team.name}
            teamscore={team.score}
          />
        ))}
    </section>
  )
}

export default TeamList
