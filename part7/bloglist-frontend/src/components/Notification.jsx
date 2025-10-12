import { messageContextData } from "../context/AppContext";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const message = messageContextData();
  console.log("notis ", message);
  if (!message) {
    return null;
  }
  return (
    <>
      {message.type === "success" && (
        <Alert variant="success" data-testid="notification">
          {message.data}
        </Alert>
      )}
      {/* {message.type === "success" && (
        <div className="success" data-testid="notification">
          {message.data}
        </div>
      )} */}
      {message.type === "error" && (
        <Alert variant="danger" data-testid="notification">
          {message.data}
        </Alert>
      )}
      {/* {message.type === "error" && (
        <div className="error" data-testid="notification">
          {message.data}
        </div>
      )} */}
    </>
  );
};

export default Notification;
