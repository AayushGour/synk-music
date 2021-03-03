import React, { Component } from 'react'
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Background from './components/Background/Background';
import Header from './components/Header/Header';
import Host from './components/Host/Host'
import Party from './components/Party/Party'
import ProtectedRoute from './components/CustomRoutes/ProtectedRoute';
import { Provider } from 'react-redux';
import store from "./redux/store"
import Error404 from './components/Error404/Error404';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>

            {/* Display Background */}
            <Background />

            {/* Display Header */}
            <Header />
            <Switch>
              <ProtectedRoute path="/host" component={Host} />
              <Route path="/party" component={Party} />
              <Route path="/" exact component={Home} />
              <Route path="/*" component={Error404} />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
