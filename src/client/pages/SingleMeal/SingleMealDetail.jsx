import React from 'react'
import { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MealsContext } from '../../context'
import { Button } from '../../components/Button/Button'

import './SingleMealDetailStyle.css'

export function SingleMealDetail() {
  const { meals } = useContext(MealsContext)
  const { id } = useParams()
  const mealId = Number(id)
  const currentMeal = meals.find((meal) => meal.id === mealId)
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
      <Link to='/'>
        <Button Children={'Back to main'}></Button>
      </Link>
      <h2 className='section-title'>{title}</h2>
      <ul className='detail-container'>
        <li>Description: {description}</li>
        <li>Price: {price}</li>
        <li>When: {when.slice(0, 10)}</li>
        <li>Location: {location}</li>
        <li>Max seats: {max_reservations}</li>
        <li>Seats left: {available_reservation}</li>
      </ul>
      <Link to='/form'>
        <Button Children={'Make reservation'}></Button>
      </Link>
    </section>
  )
}
