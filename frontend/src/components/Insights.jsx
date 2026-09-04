import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

function Insights() {
  const [insights, setInsights] = useState([])
  const [aiAdvice, setAiAdvice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/insights', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInsights(response.data.waste || [])
      setAiAdvice(response.data.aiAdvice || '')
    } catch (error) {
      toast.error('Failed to load insights')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center text-gray-400">Loading...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Spending Insights</h2>
      
      {aiAdvice && (
        <div className="bg-primary/10 border border-primary/30 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-2">🤖 AI Coach Says:</h3>
          <p className="text-gray-300">{aiAdvice}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.length > 0 ? (
          insights.map((insight, i) => (
            <div key={i} className={`p-6 rounded-xl border ${insight.severity === 'Critical' ? 'border-red-500 bg-red-500/10' : insight.severity === 'Warning' ? 'border-yellow-500 bg-yellow-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{insight.category}</h4>
                  <p className="text-sm text-gray-400 mt-1">{insight.message}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${insight.severity === 'Critical' ? 'bg-red-500/30 text-red-300' : insight.severity === 'Warning' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-blue-500/30 text-blue-300'}`}>
                  {insight.severity}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-400 py-12">
            No waste insights yet. Add more transactions!
          </div>
        )}
      </div>
    </div>
  )
}

export default Insights