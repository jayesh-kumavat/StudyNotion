import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import Footer from "../components/common/Footer"

export default function AllCategories() {
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        if (res?.data?.success) setCategoryList(res.data.data)
      } catch (e) {
        console.log("FETCH CATEGORIES ERROR", e)
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="box-content bg-richblack-800 px-4 py-12">
        <div className="mx-auto max-w-maxContent">
          <h1 className="text-3xl font-semibold text-richblack-5 mb-2">Course Categories</h1>
          <p className="text-richblack-300">Browse all available categories</p>
        </div>
      </div>

      <div className="mx-auto max-w-maxContent px-4 py-12">
        {categoryList.length === 0 ? (
          <p className="text-center text-richblack-300 text-lg">No categories available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryList.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalog/${cat.name.split(" ").join("-").toLowerCase()}`}
                className="rounded-lg bg-richblack-800 p-6 hover:bg-richblack-700 transition-colors border border-richblack-700 hover:border-yellow-50"
              >
                <h2 className="text-xl font-semibold text-richblack-5 mb-2">{cat.name}</h2>
                {cat.description && (
                  <p className="text-sm text-richblack-300">{cat.description}</p>
                )}
                <p className="text-xs text-yellow-50 mt-3">
                  {cat.courses?.length || 0} courses →
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
