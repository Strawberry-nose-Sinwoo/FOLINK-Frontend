import * as route from './allFiles';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<route.Main />} />
        <Route path={'/chat'} element={<route.Chat />} />
        <Route path={'/question/:questionId'} element={<route.Question />} />
        <Route path={'/demo'} element={<route.Demo/>} />
      </Routes>
    </Router>
  );
}

export default App;
