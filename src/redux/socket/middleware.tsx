// socketMiddleware.ts

import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import { socketActions } from './reducer';

interface LiveScore {
  // Define the structure for live score data
}

enum socketEvent {
  ConnectLiveScore = 'connect_live_score',
  DisconnectLiveScore = 'disconnect_live_score',
  LiveScoreData = 'live_score_data',
}

const socketMiddleware: Middleware = store => {
  let liveScoreSocket: Socket|null;

  return next => action => {
    // console.log(action, 'action');

    if (socketActions.connectLiveScore.match(action)) {
      // Check if the socket is already connected to avoid reconnection
      if (!liveScoreSocket) {
        liveScoreSocket = io('your_live_score_server_url');

        liveScoreSocket.on('connect', () => {
          console.log('Socket connected');
          // Dispatch action to update the state
          store.dispatch(socketActions.connectionEstablished());
        });

        liveScoreSocket.on(socketEvent.LiveScoreData, (liveScoreData: LiveScore) => {
          console.log('Live Score Data:', liveScoreData);
          // Dispatch action to update the state
          store.dispatch(socketActions.receiveLiveScoreData({ liveScoreData }));
        });
      }
    }

    if (socketActions.disconnectLiveScore.match(action)) {
      console.log('disconnected');
      if (liveScoreSocket) {
        liveScoreSocket.disconnect();
        liveScoreSocket = null; // Set to null after disconnecting
        // Dispatch action to update the state after disconnecting
        store.dispatch(socketActions.disconnectLiveScore());
      }
    }

    // Continue with the next middleware or reducer in the chain
    return next(action);
  };
};

export default socketMiddleware;
