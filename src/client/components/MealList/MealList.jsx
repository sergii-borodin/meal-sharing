import React, { useContext } from 'react'
import { Meal } from '../Meal/Meal'
import { Loading } from '../Loading/Loading'
import { MealsContext } from '../../context'
import './MealListStyle.css'

export const MealList = () => {
  const { meals } = useContext(MealsContext)
  if (!meals) {
    return (
      <div>
        <h2>loading</h2>
        <Loading />
      </div>
    )
  }
  if (meals.length < 1) {
    return <h2>No meals matched your search criteria</h2>
  }
  console.log(meals)
  return (
    <section className='section'>
      <h2 className='section-title'>MEALS</h2>
      <div className='meals-center'>
        {meals.map((meal) => (
          <Meal key={meal.id} {...meal} />
        ))}
      </div>
    </section>
  )
}
