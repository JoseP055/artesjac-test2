
import { ThemeProvider } from './context/ThemeContext';
import { AppRouter } from './routes/AppRouter';
import './styles/global.css';


function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </div>
  );
}

export default App;
