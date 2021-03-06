import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { MealsContextProvider } from './context'
//import pages
import { Home } from './pages/Home/Home'
import { About } from './pages/About/About'
import { SingleMeal } from './pages/SingleMeal/SingleMeal'
import { Error } from './pages/Error/Error'
//import components
import { Navbar } from './components/Navbar/Navbar'

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
            <SingleMeal />
          </Route>
          <Route path='*'>
            <Error />
          </Route>
        </Switch>
      </MealsContextProvider>
    </Router>
  )
}

export default App
