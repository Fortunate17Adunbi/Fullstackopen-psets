import { Button } from "react-bootstrap";
import { useState, useImperativeHandle } from "react";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} variant="outline-warning">
          cancel
        </Button>
      </div>
    </div>
  );
};

export default Togglable;
