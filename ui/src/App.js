import { BrowserRouter } from "react-router-dom";
import Routes from "routes";
import { ThemeProvider } from '@mui/material/styles';
import { defaultTheme, darkTheme, lightTheme } from 'theme';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function App() {
  const themeName = useSelector(state => state.theme.name)

  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    switch (themeName) {
      case 'light':
        setTheme(lightTheme)
        break;
      case 'dark':
        setTheme(darkTheme)
        break;
      default:
        setTheme(defaultTheme)
        break;
    }
  }, [themeName])

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
