import * as R from "./allFiles"

import { Routes, Route } from "react-router-dom"

function App() {
  return (
      <Routes>
        <Route path={"/"} element={<R.Main />}/>
      </Routes>
  )
}

export default App