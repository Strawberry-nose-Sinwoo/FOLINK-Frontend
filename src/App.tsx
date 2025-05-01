import * as R from "./allFiles"

import { Routes, Route } from "react-router-dom"

function App() {
  return (
      <Routes>
        <Route path={"/"} element={<R.Main />}/>
        <Route path={"/chat"} element={<R.Chat />}/>
      </Routes>
  )
}

export default App