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


export const AppSelectors = {
  currentView:     (state) => state.app.currentView,
  isAnimating:     (state) => state.app.isAnimating,
  isRefreshing:    (state) => state.app.isRefreshing,
  isSocketOpen:    (state, endpoint) => state.app.isDefaultSocketOpen,
  socketError:     (state) => state.app.socketError,
  socketMaxAttemptsReached: (state) =>
    state.app.socketMaxAttemptsReached,
  shouldRefreshOnNextSocketReceive: (state) =>
    state.app.shouldRefreshOnNextSocketReceive,
};
