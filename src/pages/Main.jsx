import React from "react";
import EventList from "../components/EventList";
import Content from "../components/Content";
import FileInfo from "../components/FileInfo";

const Main = () => {
  return (
    <div>
      <Content></Content>
      <EventList></EventList>
      <FileInfo></FileInfo>
    </div>
  );
};

export default Main;
