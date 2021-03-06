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


import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';


import * as customStore from 'customStore';
import Landing from './Landing';


const store = customStore.create();


describe('Landing component', () => {

  const props = {};
  const wrapper = shallow(
    <Landing {...props} store={store}/>
  );


  it('renders without crashing', () => {
    const div = document.createElement('div');
    const props = {};

    ReactDOM.render(
      <BrowserRouter>
        <Landing {...props} store={store}/>
      </BrowserRouter>, div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

});
