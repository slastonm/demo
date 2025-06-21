import React from "react";
import {Link} from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div>
      <h1>404 page</h1>

      <section className="back">
     <Link to="/">Main</Link>
      </section>

    </div>
  );
};

export default NotFound;