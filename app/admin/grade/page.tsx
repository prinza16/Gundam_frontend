'use client'

import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import { Grade } from "@/types/grade"
import Link from "next/link"
import { useEffect, useState } from "react"


const GradeList = () => {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGradeList = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/grade/`)
        
        if (response.ok) {
          const data = await response.json()
          setGrades(data)
        } else {
          const errorData = await response.json().catch(() => response.text())
          throw new Error(
            `HTTP error! status: ${response.status}, Details: ${JSON.stringify(
              errorData
            )}`
          )
        }
      } catch (err) { 
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unknown error occurred.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGradeList()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600">
        เกิดข้อผิดพลาด: {error}
      </div>
    )
  }

  if(grades.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-500">ไม่พบข้อมูลเกรด</div>
    )
  }

  return (
    <div className="w-full">
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-blue-600 shadow-lg shadow-blue-500/50">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blue-800 text-left text-xs font-medium text-blue-200 tracking-wider border-b border-blue-600">ลำดับ</th>
                  <th className="px-6 py-3 bg-blue-800 text-left text-xs font-medium text-blue-200 tracking-wider border-b border-blue-600">ชื่อเกรด</th>
                  <th className="px-6 py-3 bg-blue-800 text-left text-xs font-medium text-blue-200 tracking-wider border-b border-blue-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700">
                {grades.map((grade, index) => (
                  <tr key={grade.grade_id} className="bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">{grade.grade_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                      <Link href={`/admin/grade/${grade.grade_id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
                        แก้ไข
                      </Link>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </div>
  )
}
export default GradeList