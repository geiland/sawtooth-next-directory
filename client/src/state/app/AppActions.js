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


import { createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


const { Types, Creators } = createActions({
  animationBegin:                    null,
  animationEnd:                      null,

  refreshBegin:                      null,
  refreshEnd:                        null,

  socketSend:                        ['endpoint', 'payload'],
  socketReceive:                     ['payload'],

  socketError:                       ['error'],
  socketMaxAttemptsReached:          null,
  socketOpen:                        ['endpoint'],
  socketOpenSuccess:                 ['endpoint'],
  socketClose:                       ['endpoint'],
  socketCloseSuccess:                ['endpoint'],

  refreshOnNextSocketReceive:        ['flag'],
  feedReceive:                       ['payload'],
  setView:                           ['view'],
});


export const AppTypes = Types;
export default Creators;


export const INITIAL_STATE = Immutable({
  currentView:                       0,
  error:                             null,
  socketError:                       null,
  socketMaxAttemptsReached:          null,
  isAnimating:                       null,
  isRefreshing:                      null,
  shouldRefreshOnNextSocketReceive:  null,
  isDefaultSocketOpen:               null,
});
