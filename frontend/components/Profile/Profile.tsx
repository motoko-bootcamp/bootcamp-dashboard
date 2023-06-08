import React, { useEffect, useState } from "react"
import "./_profile.scss"
import { useUserStore } from "../../store/userStore"
import { useAuthStore } from "../../store/authstore"
import { Student } from "../../types/types"
import { toast, ToastType } from "../../services/toastService" // Import toast service
import Modal from "./Modal"
import Loader from "../Loading/Loader"
import LoadingScreen from "../Loading/LoadingScreen"

interface Props {
  user: Student
}

const Profile: React.FC<Props> = ({}) => {
  const user = useUserStore((state) => state.user)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [login, setLogin] = useState<string>("")
  let getUser = useUserStore((state) => state.getUser)

  useEffect(() => {
    console.log("Profile component mounted")
    getUser(useAuthStore.getState().principalText)

    return () => {
      console.log("Profile component unmounted")
    }
  }, [])

  useEffect(() => {
    setLoading(user === undefined)
    //TODO add case for logged out user
  }, [user])

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast("Copied to clipboard", ToastType.Success)
      },
      (err) => {
        toast("Failed to copy", ToastType.Error)
      },
    )
  }

  return (
    <div>
      {loading ? (
        <LoadingScreen loaderSize={"sm"} />
      ) : (
        <div className="profile">
          <div className="profile-header">
            <h3>Profile</h3>
          </div>
          <div className="profile-info">
            <div className="profile-info-item">
              <span className="label">Name:</span>

              <span className="value">{user?.name}</span>
            </div>
            <div className="profile-info-item">
              <span className="label">Team:</span>
              <span className="value">{user?.teamName}</span>
            </div>
            {/* <div className="profile-info-item">
              <span className="label">Rank:</span>
              <span className="value">{user?.rank}</span>
            </div> */}
            <div className="profile-info-item">
              <span className="label">Score:</span>
              <span className="value">{user?.score.toString()}</span>
            </div>
            <div className="profile-info-item">
              <span className="label">Principal IDs:</span>

              <button
                className="view-button"
                onClick={() => setShowModal(true)}
              >
                View
              </button>
            </div>
            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                <div className="principal-id-modal">
                  <h3>Principal IDs</h3>
                  <div className="principal-id-item">
                    <span className="label">CLI Principal ID:</span>
                    <span className="value">{user?.cliPrincipalId}</span>
                    <button
                      className="view-button"
                      onClick={() =>
                        handleCopyToClipboard(user?.cliPrincipalId)
                      }
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <div className="principal-id-item">
                    <span className="label">Principal ID:</span>
                    <span className="value">{user?.principalId}</span>
                    <button
                      className="view-button"
                      onClick={() => handleCopyToClipboard(user?.principalId)}
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
