import React from 'react'
import { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MealsContext } from '../../context'
import { Meal } from '../../components/Meal/Meal'

export function SingleMeal() {
  const { meals } = useContext(MealsContext)
  const { id } = useParams()
  const mealId = Number(id)
  const currentMeal = meals.find((meal) => meal.id === mealId)
  console.log('currentMeal', currentMeal)
  const {
    title,
    description,
    location,
    when,
    price,
    available_reservation,
    max_reservations,
  } = currentMeal
  return (
    <section>
      <Link to='/' className='btn'>
        back home
      </Link>
      <h2 className='section-title'>{title}</h2>
      <div>
        <p>Description: {description}</p>
        <p>Price: {price}</p>
        <p>When: {when.slice(0, 10)}</p>
        <p>Location: {location}</p>
        <p>Location: Max seats: {max_reservations}</p>
        <p>Location: Seats left: {available_reservation}</p>
        <Link to='/form' className='btn'>
          Make reservation
        </Link>
      </div>
    </section>
  )
}
