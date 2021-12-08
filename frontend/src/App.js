import { Switch, Route, Redirect } from 'react-router-dom';
import { useState } from 'react';
import TransactionPage from './Pages/TransactionPage';
import SummaryPage from './Pages/SummaryPage';
import CurrencyPage from './Pages/CurrencyPage';
import Header from './Components/Header';
import TipsPage from './Pages/TipsPage';
import LoginPage from './Pages/LoginPage';
import './App.css';
import SignupPage from './Pages/SignupPage';

function App() {
  const [login, setLogin] = useState(!!window.sessionStorage.getItem('MoneyPlusPlusToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="App">
      {login ? (
        <div>
          <Header setLogin={setLogin} username={username} />
          <Switch>
            <Route exact path="/transaction">
              <TransactionPage />
            </Route>
            <Route exact path="/summary">
              <SummaryPage />
            </Route>
            <Route exact path="/currency">
              <CurrencyPage />
            </Route>
            <Route exact path="/tips">
              <TipsPage />
            </Route>
            <Route path="/*">
              <Redirect to="/transaction" />
            </Route>
          </Switch>
        </div>
      ) : (
        <Switch>
          <Route exact path="/signup">
            <SignupPage />
          </Route>
          <Route exact path="/">
            <LoginPage
              setLogin={setLogin}
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
            />
          </Route>
          <Route path="/*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
