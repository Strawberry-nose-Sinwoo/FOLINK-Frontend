import * as route from './allFiles';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<route.Main />} />
        <Route path={'/chat'} element={<route.Chat />} />
        <Route path={'/question/:questionId'} element={<route.Question />} />
        <Route path={'/demo/all'} element={<route.Demo catagoryProps='all'/>} />
        <Route path={'/demo/frontend'} element={<route.Demo catagoryProps='프론트엔드'/>} />
        <Route path={'/demo/backend'} element={<route.Demo catagoryProps='백엔드'/>} />
        <Route path={'*'} element={<route.Error errorCode={404}/>} />
      </Routes>
    </Router>
  );
}

export default App;
