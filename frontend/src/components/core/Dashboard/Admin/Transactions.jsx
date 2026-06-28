import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getAllTransactions } from "../../../../services/operations/adminAPI"



export default function Transactions() {
  const { token } = useSelector((state) => state.auth)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllTransactions(token)
      setData(result)
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-medium text-richblack-5">
        Transactions
      </h1>

      {data && (
        <div className="flex gap-4 flex-wrap mb-6">
          <div className="rounded-lg bg-richblack-800 p-5 flex-1 min-w-[150px]">
            <p className="text-2xl font-bold text-richblack-5">
              ₹{data.totalRevenue?.toLocaleString()}
            </p>
            <p className="text-xs text-richblack-300 mt-1">Total Revenue</p>
          </div>
          <div className="rounded-lg bg-richblack-800 p-5 flex-1 min-w-[150px]">
            <p className="text-2xl font-bold text-richblack-5">{data.total}</p>
            <p className="text-xs text-richblack-300 mt-1">Total Transactions</p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-richblack-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-richblack-5">
            <thead>
              <tr className="border-b border-richblack-700">
                <th className="text-left p-4 font-medium text-richblack-300">Course</th>
                <th className="text-left p-4 font-medium text-richblack-300">Student</th>
                <th className="text-left p-4 font-medium text-richblack-300">Instructor</th>
                <th className="text-right p-4 font-medium text-richblack-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {!data?.transactions?.length ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-richblack-300">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                data.transactions.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b border-richblack-700 hover:bg-richblack-700"
                  >
                    <td className="p-4 font-medium">{t.courseName}</td>
                    <td className="p-4 text-richblack-300">
                      {t.student?.firstName} {t.student?.lastName}
                    </td>
                    <td className="p-4 text-richblack-300">
                      {t.instructor?.firstName} {t.instructor?.lastName}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {t.amount === 0 ? (
                        <span className="text-caribbeangreen-100">Free</span>
                      ) : (
                        `₹${t.amount}`
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
