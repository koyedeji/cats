import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "pages/Home";
import UploadPage from "pages/Upload";
import Layout from "components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Route exact path={"/"}>
          <HomePage />
        </Route>
        <Route path={"/upload"}>
          <UploadPage />
        </Route>
      </Layout>
    </Router>
  );
}

export default App;
