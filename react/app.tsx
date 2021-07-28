import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MainAppBar from './components/MainAppBar';
import { MuiThemeProvider } from '@material-ui/core';
import theme from './styles/theme';
import Home from './components/Home';

Sentry.init({
    dsn: 'https://e49a6d5098d14e77bfdd6907dd04282e@o921632.ingest.sentry.io/5868191',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <Router>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <div
                            style={{
                                width: '100vw',
                                height: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <MainAppBar />
                            <Switch>
                                <Redirect exact from={'/'} to={'/home'} />
                                <Route path={'/home'} component={Home} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </Provider>
        </MuiThemeProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
