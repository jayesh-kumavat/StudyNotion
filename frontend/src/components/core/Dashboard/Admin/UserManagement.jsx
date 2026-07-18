import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {getAllUsers, toggleUserStatus, toggleInstructorApproval, deleteUser} from "../../../../services/operations/adminAPI"


export default function UserManagement() {
  const { token } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async () => {
    setLoading(true)
    const data = await getAllUsers(token, page, search, filter)
    if (data) {
      setUsers(data.users)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleToggleStatus = async (userId) => {
    await toggleUserStatus(userId, token)
    fetchUsers()
  }

  const handleToggleApproval = async (userId) => {
    await toggleInstructorApproval(userId, token)
    fetchUsers()
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const success = await deleteUser(userId, token)
      if (success) fetchUsers()
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-medium text-richblack-5">
        User Management
      </h1>

      {/* search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-yellow-50 text-richblack-900 font-semibold text-sm"
          >
            Search
          </button>
        </form>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none w-auto"
        >
          <option value="">All Roles</option>
          <option value="Student">Students</option>
          <option value="Instructor">Instructors</option>
        </select>
      </div>

      <div className="rounded-lg bg-richblack-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-richblack-5">
            <thead>
              <tr className="border-b border-richblack-700">
                <th className="text-left p-4 font-medium text-richblack-300">User</th>
                <th className="text-left p-4 font-medium text-richblack-300">Role</th>
                <th className="text-left p-4 font-medium text-richblack-300">Status</th>
                <th className="text-left p-4 font-medium text-richblack-300">Joined</th>
                <th className="text-right p-4 font-medium text-richblack-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-richblack-300">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-richblack-300">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-richblack-700 hover:bg-richblack-700"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-richblack-300">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.accountType === "Admin"
                          ? "bg-pink-700 text-pink-100"
                          : user.accountType === "Instructor"
                          ? "bg-blue-700 text-blue-100"
                          : "bg-richblack-600 text-richblack-100"
                      }`}>
                        {user.accountType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.active
                          ? "bg-caribbeangreen-800 text-caribbeangreen-100"
                          : "bg-pink-800 text-pink-100"
                      }`}>
                        {user.active ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="p-4 text-richblack-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.active
                              ? "bg-pink-700 text-pink-100 hover:bg-pink-600"
                              : "bg-caribbeangreen-700 text-caribbeangreen-100 hover:bg-caribbeangreen-600"
                          }`}
                        >
                          {user.active ? "Ban" : "Activate"}
                        </button>
                        {user.accountType === "Instructor" && (
                          <button
                            onClick={() => handleToggleApproval(user._id)}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.approved
                                ? "bg-yellow-700 text-yellow-100 hover:bg-yellow-600"
                                : "bg-caribbeangreen-700 text-caribbeangreen-100 hover:bg-caribbeangreen-600"
                            }`}
                          >
                            {user.approved ? "Revoke" : "Approve"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-2 py-1 rounded text-xs font-medium bg-pink-700 text-pink-100 hover:bg-pink-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-richblack-700">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded text-xs font-medium ${
                  page === i + 1
                    ? "bg-yellow-50 text-richblack-900"
                    : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
