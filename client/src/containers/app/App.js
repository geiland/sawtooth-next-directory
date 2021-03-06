/* Copyright 2019 Contributors to Hyperledger Sawtooth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
----------------------------------------------------------------------------- */


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch } from 'react-router-dom';
import PropTypes from 'prop-types';


import './App.css';
import Landing from 'containers/landing/Landing';
import Login from 'containers/login/Login';
import Signup from 'containers/signup/Signup';
import Header from 'components/layouts/Header';
import Waves from 'components/layouts/Waves';
import GlobalError from 'components/layouts/GlobalError';
import NotFound from 'components/layouts/NotFound';


import { appDispatch, appState } from './AppHelper';


/**
 *
 * @class         App
 * @description   Component encapsulating navigation. Route pathways
 *                are composed from two top-level components, creating
 *                one nav and one main area per component.
 *
 *                Component communication should be done only using
 *                the Redux store.
 */
class App extends Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    routes: PropTypes.func,
  };


  state = { transition: null };


  /**
   * Entry point to perform tasks required to render
   * component. If authenticated, hydate data and open socket.
   */
  componentDidMount () {
    const { isAuthenticated, openSocket } = this.props;
    isAuthenticated && this.hydrate();
    if (isAuthenticated) openSocket('default');
  }


  /**
   * Called whenever Redux state changes.
   * @param {object} prevProps Props before update
   * @returns {undefined}
   */
  componentDidUpdate (prevProps) {
    const {
      closeSocket,
      me,
      isSocketOpen,
      isAuthenticated,
      isRefreshing,
      stopRefresh,
      openSocket } = this.props;

    if (!isAuthenticated) {
      isSocketOpen('default') && closeSocket('default');
      return;
    }

    // On receiving new props, if user authentication
    // state changes, we know that a user has logged in,
    // so get hydrate user and recommended objects
    if (prevProps.isAuthenticated !== isAuthenticated) {
      openSocket('default');
      this.setState({ transition: true });
      this.hydrate();
    }

    if (prevProps.isRefreshing !== isRefreshing) {
      this.hydrate();
      stopRefresh();
    }

    // After the user object is populated, the following
    // will get the info required to display data in the
    // sidebar.
    if (prevProps.me !== me) this.hydrateSidebar();

    // TODO: Needs more logic
    // if (messages !== prevProps.messages)
    //   clearTimeout(this.wait);
  }


  isApproverView = () => {
    return window.location.href.includes('/approval');
  }


  /**
   * Update user, recommended resources, and open requests
   */
  hydrate () {
    const { getBase, getMe, getOpenProposals } = this.props;

    getMe();
    getBase();
    if (!window.location.href.includes('/pending'))
      getOpenProposals();
  }


  /**
   * Get open request, role, and pack data needed to
   * display resource names in the navbar
   */
  hydrateSidebar () {
    const {
      getPacks,
      getProposals,
      getRoles,
      me,
      packs,
      roles,
      defaultUser } = this.props;

    const user = defaultUser ? defaultUser : me;

    // Populate proposal ID array
    const proposalIds = user.proposals.map(
      item => item.proposal_id
    );

    // Populate role ID array
    let roleIds = [
      ...user.proposals,
      ...user.memberOf,
    ].map(item =>
      typeof item === 'object' ?
        item.object_id :
        item);

    // Populate pack ID array
    let packIds = user && user.proposals.map(
      item => item.pack_id
    ).filter(item => item);

    // Find packs and roles not loaded in
    if (roles && roles.length) {
      roleIds = roleIds.filter(
        item => !roles.find(role => role.id === item)
      );
    }
    if (packs & packs.length) {
      packIds = packIds.filter(
        item => !packs.find(pack => pack.id === item)
      );
    }

    // Fetch roles, packs, and proposals
    getProposals(proposalIds);
    getPacks([...new Set(packIds)]);
    getRoles([...new Set(roleIds)]);
  }


  /**
   * Render grid system
   * Create a 2-up top-level grid structure that separates the
   * sidebar from main content. Each route is mapped via its own
   * route component.
   *
   * @param {function}  nav Nav component
   * @param {function} main Main component
   * @param {object}  props React Router props
   * @returns {JSX}
   */
  renderGrid (nav, main, props) {
    const { transition } = this.state;

    if (transition)
      setTimeout(() => this.setState({ transition: false }), 2.5e3);

    return (
      <Grid id='next-outer-grid'>
        <Grid.Column
          id='next-outer-grid-nav'
          className={transition ? 'nav-animate' : 'nav-no-animate'}>
          { nav(props) }
        </Grid.Column>
        <Grid.Column
          id='next-inner-grid-main'>
          { main(props) }
        </Grid.Column>
      </Grid>
    );
  }


  /**
   * Render entrypoint
   * @returns {JSX}
   */
  render () {
    const { isAuthenticated, routes } = this.props;
    const { transition } = this.state;
    this.routes = routes(this.props);

    return (
      <GlobalError>
        <Router>
          <div id='next-global-container'
            className={this.isApproverView() ? 'approver' : 'requester'}>
            { isAuthenticated && <Header {...this.props}/> }
            { isAuthenticated &&
              <div id='next-waves' className={transition ?
                'main-animate' :
                'main-no-animate'}>
                <Waves {...this.props}/>
              </div>
            }
            <Switch>

              {/*
                Unprotected routes
              */}
              <Route exact path='/' component={Landing}/>
              <Route exact path='/login' component={Login}/>
              { process.env.REACT_APP_ENABLE_LDAP_SYNC === '1' &&
                <Route exact path='/signup' component={Signup}/>
              }
              { !isAuthenticated && <Redirect to='/'/> }

              {/*
                Protected routes
              */}
              { this.routes &&
                this.routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    render={props =>
                      this.renderGrid(route.nav, route.main, props)
                    }/>
                ))}
              <Route render={() => <NotFound {...this.props}/>}/>
            </Switch>
          </div>
        </Router>
      </GlobalError>
    );
  }

}


const mapStateToProps = (state) => appState(state);
const mapDispatchToProps = (dispatch) => appDispatch(dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(App);
