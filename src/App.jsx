import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PriorityEvent from "./pages/PriorityEvent";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Forum from "./pages/Forum";
import PullCounter from "./pages/PullCounter";
import NotFonund from "./pages/NotFound";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./components/AuthContext";
import PrivateRouter from "./components/PrivateRouter";
import Chat from "./pages/Chat";

import backgroundHome from "./assets/pictures/26 event/background.jpg";
import backgroundPull from "./assets/pictures/26 event/pull.jpg";
import backgroundForum from "./assets/pictures/26 event/Back.jpg";

const AppLayout = () => {
  const location = useLocation();
  const getBackground = () => {
    switch (location.pathname) {
      case "/Main":
        return backgroundHome;
        break;
      case "/Forum":
        return backgroundForum;
        break;
      case "/PullCounter":
        return backgroundPull;
        break;
      default:
        return "none";
    }
  };
  useEffect(() => {
    document.body.style.backgroundImage = `url(${getBackground()})`;
    document.body.style.backgroundSize = `cover`;
    document.body.style.backgroundRepeat = `no-repeat`;
    document.body.style.backgroundPosition = `center center`;
    document.body.style.backgroundAttachment = `fixed`;
  }, [location]);
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Main></Main>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/chat" element={<Chat></Chat>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route
          path="/Forum"
          element={
            <PrivateRouter>
              <Forum></Forum>
            </PrivateRouter>
          }
        >
          {" "}
        </Route>
        <Route
          path="/PullCounter"
          element={
            <PrivateRouter>
              <PullCounter></PullCounter>
            </PrivateRouter>
          }
        ></Route>
        <Route
          path="/priorityq"
          element={
            <PrivateRouter>
              <PriorityEvent></PriorityEvent>
            </PrivateRouter>
          }
        >
          {" "}
        </Route>
        <Route path="/*" element={<NotFonund></NotFonund>}></Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AppLayout></AppLayout>
          <Footer></Footer>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
