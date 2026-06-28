import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../../services/apiconnector"
import { categories } from "../../../../services/apis"


export default function CategoryManagement() {
  const { token } = useSelector((state) => state.auth)
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const fetchCategories = async () => {
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      if (res?.data?.success) setCategoryList(res.data.data)
    } catch (e) {
      console.log("FETCH CATEGORIES ERROR", e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error("Category name is required")
    const toastId = toast.loading("Creating...")
    try {
      const res = await apiConnector("POST", categories.CREATE_CATEGORY_API, { name, description }, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) {
        toast.success("Category created")
        setName("")
        setDescription("")
        fetchCategories()
      }
    } catch (e) {
      toast.error("Failed to create category")
    }
    toast.dismiss(toastId)
  }

  const handleDelete = async (categoryId) => {
    const toastId = toast.loading("Deleting...")
    try {
      const res = await apiConnector("POST", categories.DELETE_CATEGORY_API, { categoryId }, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) {
        toast.success("Category deleted")
        fetchCategories()
      }
    } catch (e) {
      toast.error("Failed to delete category")
    }
    toast.dismiss(toastId)
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">Categories</h1>

      {/* Create form */}
      <form onSubmit={handleCreate} className="rounded-lg bg-richblack-800 p-6 mb-8">
        <h2 className="text-lg font-semibold text-richblack-5 mb-4">Create Category</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-md bg-richblack-700 px-4 py-2 text-richblack-5 outline-none border border-richblack-600 focus:border-yellow-50"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 rounded-md bg-richblack-700 px-4 py-2 text-richblack-5 outline-none border border-richblack-600 focus:border-yellow-50"
          />
          <button
            type="submit"
            className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 hover:bg-yellow-100 transition-colors"
          >
            Create
          </button>
        </div>
      </form>

      {/* Category list */}
      <div className="rounded-lg bg-richblack-800 p-6">
        <h2 className="text-lg font-semibold text-richblack-5 mb-4">
          All Categories ({categoryList.length})
        </h2>
        {categoryList.length === 0 ? (
          <p className="text-richblack-300">No categories found</p>
        ) : (
          <div className="space-y-3">
            {categoryList.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between rounded-md bg-richblack-700 px-4 py-3">
                <div>
                  <p className="text-richblack-5 font-medium">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-richblack-300 mt-1">{cat.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-sm text-pink-300 hover:text-pink-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
