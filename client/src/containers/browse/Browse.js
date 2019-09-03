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
import {
  Button,
  Container,
  Grid,
  Header,
  Placeholder } from 'semantic-ui-react';
import PropTypes from 'prop-types';


import './Browse.css';
import BrowseCard from './BrowseCard';
import BrowseNav from './BrowseNav';
import * as theme from 'services/Theme';
import * as utils from 'services/Utils';


/**
 *
 * @class         Browse
 * @description   The browse screen
 *
 */
class Browse extends Component {

  static propTypes = {
    fetchingAllPacks:   PropTypes.bool,
    fetchingAllRoles:   PropTypes.bool,
    getAllRoles:        PropTypes.func,
  };


  themes = ['dark'];


  state = {
    start:          0,
    limit:          50,
  };


  /**
   * Entry point to perform tasks required to render
   * component. On load, get roles
   */
  componentDidMount () {
    theme.apply(this.themes);
    this.loadNext(0);
    this.init();
  }


  /**
   * Called whenever Redux state changes.
   * @param {object} prevProps Props before update
   * @returns {undefined}
   */
  componentDidUpdate (prevProps) {
    const { roles } = this.props;
    if (roles && prevProps.roles.length !== roles.length)
      this.init();
  }


  /**
   * Component teardown
   */
  componentWillUnmount () {
    const { clearSearchData } = this.props;
    clearSearchData();
    theme.remove(this.themes);
  }


  /**
   * Determine which owners are not currently loaded
   * in the client and dispatch actions to retrieve them.
   */
  init () {
    const { getUsers, roles, users } = this.props;
    if (!roles) return;
    const owners = [
      ...new Set(
        roles.map(role => role.owners).flat()
      ),
    ];
    const diff = owners.filter(userId =>
      !users || !users.find(user => user.id === userId)
    );
    diff && getUsers(diff, true);
  }


  /**
   * Load next set of data
   * @param {number} start Loading start index
   */
  loadNext = (start) => {
    const { getAllPacks, getAllRoles } = this.props;
    const { limit } = this.state;
    if (start === undefined || start === null)
      start = this.state.start;

    getAllPacks(start, limit);
    getAllRoles(start, limit);
    this.setState({ start: start + limit });
  }


  /**
   * Load next set of search data
   * @param {number} start Loading start index
   */
  loadNextSearch = () => {
    const {
      search,
      searchInput,
      searchLimit,
      searchStart,
      searchTypes,
      setSearchStart } = this.props;

    const query = {
      query: {
        search_input: searchInput,
        search_object_types: searchTypes,
        page_size: searchLimit,
        page: searchStart + 1,
      },
    };

    setSearchStart(searchStart + 1);
    search('browse', query);
  }


  /**
   * Render columns
   * @param {array}    column Array of resources to display
   *                          within a column subsection
   * @param {number} rowIndex Index with respect to x-axis
   *                          used to calculate card height
   * @returns {JSX}
   */
  renderColumns = (column, rowIndex) => {
    return column.map((item, columnIndex) => (
      <BrowseCard
        isTall={(columnIndex + rowIndex) % 2}
        key={columnIndex}
        resource={item}
        {...this.props}/>
    ));
  }


  /**
   * Render placeholder graphics
   * @returns {JSX}
   */
  renderPlaceholder = () => {
    return Array(4).fill(0).map((item, index) => (
      <Grid.Column key={index}>
        <Placeholder inverted>
          <Placeholder.Header image>
            <Placeholder.Line/>
            <Placeholder.Line/>
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length='medium'/>
            <Placeholder.Line length='short'/>
          </Placeholder.Paragraph>
        </Placeholder>
      </Grid.Column>
    ));
  }


  /**
   * Get count of resource in browse state
   * @returns {number}
   */
  browseCount = () => {
    const { browseData } = this.props;
    return browseData && browseData.reduce(
      (count, row) => count + row.length, 0
    );
  }


  /**
   * Get count of resource in search state
   * @returns {number}
   */
  searchCount = () => {
    const { browseSearchData } = this.props;
    return browseSearchData && browseSearchData.reduce(
      (count, row) => count + row.length, 0
    );
  }


  /**
   * Render entrypoint
   * @returns {JSX}
   */
  render () {
    const {
      browseData,
      browseSearchData,
      fetchingAllPacks,
      fetchingAllRoles,
      fetchingSearchResults,
      rolesTotalCount,
      searchInput,
      searchStart,
      totalSearchPages } = this.props;
    const { limit } = this.state;

    const showNoContentLabel = !fetchingAllPacks &&
      !fetchingAllRoles &&
      this.browseCount() === 0;
    const showData = this.browseCount() >= limit ||
      (!fetchingAllPacks && !fetchingAllRoles);
    const showSearchData = !utils.isWhitespace(searchInput);

    return (
      <div>
        <BrowseNav
          fetchingSearchResults={fetchingSearchResults}
          {...this.props}/>
        <div id='next-browse-wrapper'>
          <Container fluid id='next-browse-container'>
            <Grid
              doubling
              stackable
              columns={4}
              className='masonry'
              id='next-browse-grid'>
              { showSearchData &&
                browseSearchData.map((column, index) => (
                  <Grid.Column key={index}>
                    {this.renderColumns(column, index)}
                  </Grid.Column>
                ))
              }
              { showData &&
                !showSearchData &&
                browseData.map((column, index) => (
                  <Grid.Column key={index}>
                    {this.renderColumns(column, index)}
                  </Grid.Column>
                ))
              }
              { (fetchingAllPacks ||
                fetchingAllRoles ||
                fetchingSearchResults) &&
                this.renderPlaceholder()
              }
            </Grid>
            { !showSearchData &&
              this.browseCount() < rolesTotalCount &&
              this.browseCount() !== 0 &&
              <Container
                id='next-browse-load-next-button'
                textAlign='center'>
                <Button size='large' onClick={() => this.loadNext()}>
                  Load More
                </Button>
              </Container>
            }
            { showSearchData &&
              totalSearchPages > 1 &&
              searchStart < totalSearchPages &&
              <Container
                id='next-browse-load-next-button'
                textAlign='center'>
                <Button size='large' onClick={() => this.loadNextSearch()}>
                  More Results
                </Button>
              </Container>
            }
            { !showSearchData &&
              showNoContentLabel &&
              <Header as='h3' textAlign='center' color='grey'>
                <Header.Content>
                  No roles or packs
                </Header.Content>
              </Header>
            }
            { showSearchData &&
              !fetchingAllRoles &&
              !fetchingAllPacks &&
              !fetchingSearchResults &&
              this.searchCount() === 0 &&
              <Header as='h3' textAlign='center' color='grey'>
                <Header.Content>
                  No search results
                </Header.Content>
              </Header>
            }
          </Container>
        </div>
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    fetchingAllPacks: state.requester.fetchingAllPacks,
    fetchingAllRoles: state.requester.fetchingAllRoles,
    fetchingSearchResults: state.search.fetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};


export default connect(mapStateToProps, mapDispatchToProps)(Browse);
