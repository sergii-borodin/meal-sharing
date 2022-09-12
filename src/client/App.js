import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { MealsContextProvider } from './context'
//import pages
import { Home } from './pages/Home/Home'
import { About } from './pages/About/About'
import { SingleMealDetail } from './pages/SingleMeal/SingleMealDetail'
import { Error } from './pages/Error/Error'
import { AddMealForm } from './pages/AddMealForm/AddMealForm'
//import components
import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'

function App() {
  return (
    <Router>
      <Navbar />
      <MealsContextProvider>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/meal/:id'>
            <SingleMealDetail />
          </Route>
          <Route path='/form'>
            <AddMealForm />
          </Route>
          <Route path='*'>
            <Error />
          </Route>
        </Switch>
      </MealsContextProvider>
      <Footer />
    </Router>
  )
}

export default App
