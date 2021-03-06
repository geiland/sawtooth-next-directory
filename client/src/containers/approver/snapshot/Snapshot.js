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
import { Grid, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Snapshot.css';
import TrackHeader from 'components/layouts/TrackHeader';
import expireGlyph from 'images/glyph-expire-soon.png';
import SnapshotCard from './SnapshotCard';


import * as theme from 'services/Theme';
import * as utils from 'services/Utils';


/**
 *
 * @class         Snapshot
 * @description   Snapshot component
 *
 *
 */
class Snapshot extends Component {

  static propTypes = {
    history:                  PropTypes.object,
    openProposalsByRoleCount: PropTypes.number,
    openProposalsCount:       PropTypes.number,
  };


  themes = ['dark', 'pattern'];


  /**
   * Entry point to perform tasks required to render
   * component.
   */
  componentDidMount () {
    theme.apply(this.themes);
  }


  /**
   * Component teardown
   */
  componentWillUnmount () {
    theme.remove(this.themes);
  }


  /**
   * Navigate to previous location
   */
  goBack () {
    const { history } = this.props;
    history.length < 3 ?
      history.push('/approval/pending/individual') :
      history.goBack();
  }


  /**
   * Render entrypoint
   * @returns {JSX}
   */
  render () {
    const {
      openProposalsCount,
      openProposalsByRoleCount } = this.props;

    return (
      <Grid id='next-approver-grid'>
        <Grid.Column
          id='next-approver-grid-track-column'
          width={16}>
          <TrackHeader
            inverted
            title='Snapshot'
            subtitle='An overview of your pending requests'
            {...this.props}/>
          <div className='snapshot-container next-ease'>
            <div className='snapshot-sub-container'>
              <SnapshotCard
                count={openProposalsCount || 0}
                status={`Pending across ${
                  utils.countLabel(openProposalsByRoleCount, 'role')
                }`}/>
              <SnapshotCard
                image={<Image
                  floated='right'
                  src={expireGlyph}
                  className='next-snapshot-glyph'/>}
                count={0}
                status='About to Expire'/>
              <SnapshotCard
                count={0}
                status='Delegated'/>
              <SnapshotCard
                count={0}
                status='Unattended for 1 week'/>
              <SnapshotCard
                count={0}
                status='Escalated'/>
              <SnapshotCard
                count={0}
                status='Messages'/>
            </div>
          </div>
        </Grid.Column>
      </Grid>
    );
  }

};


export default withRouter(Snapshot);
