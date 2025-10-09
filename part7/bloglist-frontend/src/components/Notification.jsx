import { messageContextData } from "../context/AppContext";

const Notification = () => {
  const message = messageContextData();
  console.log("notis ", message);
  if (!message) {
    return null;
  }
  return (
    <>
      {message.type === "success" && (
        <div className="success" data-testid="notification">
          {message.data}
        </div>
      )}
      {message.type === "error" && (
        <div className="error" data-testid="notification">
          {message.data}
        </div>
      )}
    </>
  );
};

export default Notification;
