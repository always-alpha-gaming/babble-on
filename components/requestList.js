import React from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';

export default class RequestList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: [],
    };

    console.log('Request List Init');

    this.loadRequests = this.loadRequests.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  componentDidMount() {
    this.loadRequests();
  }

  loadRequests() {
    console.log('loading requests from server');
    // eslint-disable-next-line no-undef
    fetch('/requests?claimed=false', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create new request');
        }
        return res;
      })
      .then(res => res.json())
      .then((result) => {
        this.setState({
          requests: result.requests,
        });
      });
  }

  acceptRequest(request) {
    // eslint-disable-next-line no-underscore-dangle,no-undef
    fetch(`/request/${request._id}/start`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create new request');
        }
      })
      .then(this.loadRequests);
  }

  render() {
    const { requests } = this.state;
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Accept a request for translation</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={4}>
            <h3>Requests</h3>
            <ListGroup flush>
              {requests.map((request, i) => (
                <ListGroupItem>
                  {request.name}
                  <Button
                    onClick={() => this.acceptRequest(request)}
                    style={{ float: 'right' }}
                  >
                    Accept
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </>
    );
  }
}
