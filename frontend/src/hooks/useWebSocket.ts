import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setIsConnected, setConnectedUsers, setCode } from '../store/editorSlice';
import { wsService } from '../services/websocket.service';
import { type AppDispatch } from '../store';

export const useWebSocket = (roomId: string | null, isRemoteChangeRef: React.MutableRefObject<boolean>) => {
  const dispatch = useDispatch<AppDispatch>();

  const connectWebSocket = useCallback((roomIdToConnect: string) => {
    wsService.connect(
      roomIdToConnect,
      // onMessage
      (data) => {
        if (data.type === 'code_update' && data.code !== undefined) {
          isRemoteChangeRef.current = true;
          dispatch(setCode(data.code));
        } else if (data.type === 'user_count' && data.count !== undefined) {
          dispatch(setConnectedUsers(data.count));
        }
      },
      // onOpen
      () => {
        dispatch(setIsConnected(true));
      },
      // onClose
      () => {
        dispatch(setIsConnected(false));
      },
      // onError
      () => {
        dispatch(setIsConnected(false));
      }
    );
  }, [dispatch, isRemoteChangeRef]);

  useEffect(() => {
    if (roomId) {
      connectWebSocket(roomId);
    }

    return () => {
      wsService.disconnect();
    };
  }, [roomId, connectWebSocket]);

  const sendCodeUpdate = useCallback((code: string) => {
    wsService.sendMessage({
      type: 'code_update',
      code
    });
  }, []);

  return { connectWebSocket, sendCodeUpdate };
};