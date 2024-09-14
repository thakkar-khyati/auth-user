import { BrowserRouter } from 'react-router-dom';
import './App.css';
import RoutesPath from './routes';

function App() {
  return (
    <>
      <BrowserRouter>
        <RoutesPath />
      </BrowserRouter>
    </>
  );
}

export default App;
