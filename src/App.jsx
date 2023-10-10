import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import SingUp from './views/SingUp';
import Todo from './views/Todo';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/sing_up' element={<SingUp/>} />
      <Route path='/todo' element={<Todo/>} />
    </Routes>
    </>
  )
}

export default App
