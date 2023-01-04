import React from "react";
import {
  Container,
  Navbar,
  NavbarBrand,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import Layer3Attacks from "./Layer3Attacks";
import PopularDomains from "./PopularDomains";
import TrafficChange from "./TrafficChange";

function App() {
  return (
    <>
      <Navbar bg={"light"} className="mb-3">
        <Container>
          <NavbarBrand href="#">CF Workers Assignment</NavbarBrand>
        </Container>
      </Navbar>
      <Container>
        <p>
          <a href="https://apply.cloudflareworkers.com/">
            Cloudflare Workers hiring assignment
          </a>
          {" by "}
          <a href="https://camk.co" target={"_blank"} rel="noreferrer">
            Cameron Kleiman
          </a>
        </p>
        <DataTabs />
      </Container>
    </>
  );
}

function DataTabs() {
  return (
    <Tabs id="data-tabs">
      <Tab eventKey={"traffic-change"} title="Traffic Change">
        <TrafficChange />
      </Tab>
      <Tab eventKey={"popular-domains"} title="Popular Domains">
        <PopularDomains />
      </Tab>
      <Tab eventKey={"attack-layer3"} title="Layer 3 DDos Attacks">
        <Layer3Attacks />
      </Tab>
    </Tabs>
  );
}

export default App;
