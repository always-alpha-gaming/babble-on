
import React from 'react';
import {
  Container, Row, Col, Jumbotron, ListGroup, ListGroupItem, Table,
} from 'reactstrap';
import Page from '../components/page';
import Layout from '../components/layout';

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Jumbotron
          className="text-light rounded-0"
          style={{
            backgroundColor: 'rgba(73,155,234,1)',
            background: 'radial-gradient(ellipse at center, rgba(73,155,234,1) 0%, rgba(32,124,229,1) 100%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
          }}
        >
          <Container className="mt-2 mb-2">
            <h1 className="display-2 mb-3" style={{ fontWeight: 300 }}>
              <span style={{ fontWeight: 600 }}>
                <span className="mr-3">▲</span>
                <br className="v-block d-sm-none" />
                Babble-On
              </span>
            </h1>
            <p className="lead mb-5">
              Translation service that actually works
            </p>
            <style jsx>
              {`
              .display-2  {
                text-shadow: 0 5px 10px rgba(0,0,0,0.3);
                color: rgba(255,255,255,0.9);
              }
              .lead {
                font-size: 3em;
                opacity: 0.7;
              }
              @media (max-width: 767px) {
                .display-2 {
                  font-size: 3em;
                  margin-bottom: 1em;
                }
                .lead {
                  font-size: 1.5em;
                }
              }
            `}
            </style>
          </Container>
        </Jumbotron>
        <Container>
          <h2 className="text-center display-4 mt-5 mb-2">Features</h2>
          <Row className="pb-5">
            <Col xs="12" sm="4" className="pt-5">
              <h3 className="text-center mb-4">Services</h3>
              <ListGroup>
                <ListGroupItem><a className="text-dark" href="https://expressjs.com">Meet Up</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="https://www.npmjs.com/package/express-sessions">File Translation</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)">Web Chat</a></ListGroupItem>
              </ListGroup>
            </Col>
            <Col xs="12" sm="4" className="pt-5">
              <h3 className="text-center mb-4">Employment</h3>
              <ListGroup>
                <ListGroupItem><a className="text-dark" href="http://www.passportjs.org">Earn</a></ListGroupItem>
              </ListGroup>
            </Col>
            <Col xs="12" sm="4" className="pt-5">
              <h3 className="text-center mb-4">Collaberate</h3>
            </Col>
          </Row>
          <h2 className="text-center display-4 mt-2 mb-5">Statistics</h2>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Q3 2017</th>
                <th>Q4 2017</th>
                <th>Q1 2018</th>
                <th>Q2 2018</th>
                <th>Q3 2018</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Job vacancies</th>
                <td>467,710</td>
                <td>469,780</td>
                <td>462,235</td>
                <td>547,280</td>
                <td>551,170</td>
              </tr>
              <tr>
                <th scope="row">Proportion of job vacancies</th>
                <td>100</td>
                <td>100</td>
                <td>100</td>
                <td>100</td>
                <td>100</td>
              </tr>
              <tr>
                <th scope="row">Average offered hourly wage </th>
                <td>19.90</td>
                <td>20.10</td>
                <td>21.05</td>
                <td>20.65</td>
                <td>20.95</td>
              </tr>
            </tbody>
          </Table>
          <p>
            The need for translators is on the rise, and has been for quite sometime.
            Taken from Statistics Canada
            <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410032801"> here </a>
             we aim to help close that gap buy providing this excellent service to all,
            while also providing our Babblers some great money,
          </p>
          <h2 className="text-center display-4 mt-2 mb-5">About Us</h2>
          <p>
            Babble-On Aims to bring both the french and English populations
            together with an easy to use service.
          </p>
          <p>
            bridges the gap and allows for collaboration between two parties.
          </p>
          <p>
            Earn money providing services on babble
          </p>
          <p>
            Find Babblers with specific knowledge bases that you require
          </p>
        </Container>
      </Layout>
    );
  }
}
