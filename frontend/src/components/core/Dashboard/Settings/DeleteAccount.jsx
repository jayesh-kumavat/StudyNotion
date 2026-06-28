import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteProfile } from "../../../../services/operations/SettingsAPI"
import { useState } from "react"


export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={() => setShowConfirm(true)}
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/50 backdrop-blur-sm">
          <div className="w-11/12 max-w-[400px] rounded-lg bg-richblack-800 border border-richblack-600 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-richblack-5 mb-2">
              Are you sure?
            </h2>
            <p className="text-richblack-300 text-sm mb-6">
              This action is permanent. All your data including courses, progress, and reviews will be deleted forever.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 rounded-md bg-pink-700 py-2 px-4 font-semibold text-white hover:bg-pink-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-md bg-richblack-600 py-2 px-4 font-semibold text-richblack-5 hover:bg-richblack-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}