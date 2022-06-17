import React from 'react'
import useSWR from 'swr'
import { createContext } from 'react'

export const MealsContext = createContext([])

const fetcher = (url) => fetch(url).then((result) => result.json())

const getTodayDate = () => {
  let today = new Date()
  today = today.toISOString()
  today = today.split('T')[0]
  return today
}

export function MealsContextProvider({ children }) {
  const { data, error } = useSWR('/meals', fetcher)
  if (error) return 'An error has occurred.'
  if (!data) return 'Loading...'

  return (
    <MealsContext.Provider value={{ meals: data, getTodayDate: getTodayDate }}>
      {children}
    </MealsContext.Provider>
  )
}

// import React, { useState, useContext, useEffect } from 'react'
// import { useCallback } from 'react'

// const url = '/api/meals'
// const AppContext = React.createContext()

// const AppProvider = ({ children }) => {
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('a')
//   const [meals, setMeals] = useState([])

//   const fetchMeals = useCallback(async () => {
//     setLoading(true)
//     try {
//       const response = await fetch(`${url}${searchTerm}`)
//       const data = await response.json()
//       console.log(data)
//       const { meals } = data
//       if (meals) {
//         const newMeals = meals.map((item) => {
//           const { id, title, description, price, available_reservations } = item

//           return {
//             id: id,
//             name: title,
//             info: description,
//             price: price,
//             available_reservations: available_reservations,
//           }
//         })
//         setMeals(newMeals)
//       } else {
//         setMeals([])
//       }
//       setLoading(false)
//     } catch (error) {
//       console.log(error)
//       setLoading(false)
//     }
//   }, [searchTerm])
//   useEffect(() => {
//     fetchDrinks()
//   }, [searchTerm, fetchDrinks])
//   return (
//     <AppContext.Provider value={{ loading, meals, searchTerm, setSearchTerm }}>
//       {children}
//     </AppContext.Provider>
//   )
// }
// // make sure use
// export const useGlobalContext = () => {
//   return useContext(AppContext)
// }

// export { AppContext, AppProvider }
