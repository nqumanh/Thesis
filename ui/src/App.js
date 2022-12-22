import { BrowserRouter } from "react-router-dom";
import Routes from "routes";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
