import * as R from "./allFiles"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<R.Main />}/>
        <Route path={"/chat"} element={<R.Chat />}/>
      </Routes>
    </Router>
  
  )
}

export default App