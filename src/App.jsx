import './App.css';
import QuizApp from './components/QuizApp';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
function App() {

  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar/>
      <QuizApp/>
      {/* <QuizAnswers/> */}
    </ThemeProvider>
    </>
  )
}

export default App
