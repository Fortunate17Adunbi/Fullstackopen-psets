import { messageContextDispatch } from "./AppContext";
import { setError, setRemove, setSuccess } from "./messageReducer";

const MESSAGE_TIMEOUT = 5000;
export const useMessage = () => {
  const dispatchMessage = messageContextDispatch();
  const reset = () => {
    setTimeout(() => {
      dispatchMessage(setRemove());
    }, MESSAGE_TIMEOUT);
  };
  const success = (message) => {
    dispatchMessage(setSuccess(message));
    reset();
  };
  const error = (message) => {
    dispatchMessage(setError(message));
    reset();
  };

  return { success, error };
};
