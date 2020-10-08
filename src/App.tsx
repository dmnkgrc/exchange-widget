import React, { lazy, Suspense } from 'react';
import { Loading } from './components/Loading';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
const ExchangeCurrencyPage = lazy(() => import('./pages/ExchangeCurrency'));
const HomePage = lazy(() => import('./pages/Home'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/exchange" component={ExchangeCurrencyPage} />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
