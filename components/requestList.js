import React from 'react';
import PropTypes from 'prop-types';
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
  static get propTypes() {
    return {
      userId: PropTypes.string,
      babblerId: PropTypes.string,
      complete: PropTypes.bool,
      claimed: PropTypes.bool,
      renderContent: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      complete: false,
      claimed: false,
      renderContent: false,
      babblerId: '',
      userId: '',
    };
  }

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.babblerId !== this.props.babblerId) {
      this.loadRequests();
    }
    if (prevProps.userId !== this.props.userId) {
      this.loadRequests();
    }
    if (prevProps.claimed !== this.props.claimed) {
      this.loadRequests();
    }
    if (prevProps.complete !== this.props.complete) {
      this.loadRequests();
    }
    if (prevProps.renderContent !== this.props.renderContent) {
      this.loadRequests();
    }
  }

  loadRequests() {
    let url = this.props.userId
      ? `/requests?claimed=${this.props.claimed}&complete=${this.props.complete}`
      : `/requests?claimed=${this.props.claimed}&complete=${this.props.complete}`;

    if (this.props.userId) {
      url += `&user_id=${this.props.userId}`;
    }

    if (this.props.babblerId) {
      url += `&babbler_id=${this.props.babblerId}`;
    }

    console.log(url);
    console.log('loading requests from server');
    // eslint-disable-next-line no-undef
    fetch(url, {
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

  completeRequest(request) {
    // eslint-disable-next-line no-undef
    const text = document.getElementById(`text_${request._id}`).value;
    // eslint-disable-next-line no-underscore-dangle,no-undef
    fetch(`/request/${request._id}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: {
          text,
        },
      }),
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
                  {(this.props.claimed && !this.props.complete)
                    ? (
                      <div>
                        <p>{request.data && request.data.text ? request.data.text : ''}</p>
                        <div>
                          {request.data && request.data.images
                            ? request.data.images.map(image => (
                              <img
                                style={{
                                  height: '300px',
                                  width: '300px',
                                }}
                                key={image.url}
                                src={image.url}
                                alt={image.name}
                              />))
                            : ''}
                        </div>
                      </div>)
                    : ''}
                  {(this.props.claimed && !this.props.complete)
                    ? <Input type="text" id={`text_${request._id}`} />
                    : ''}
                  {(this.props.renderContent)
                    ? <p>{request.response ? request.response.text : ''}</p>
                    : ''}
                  {!this.props.complete
                    ? (
                      <Button
                        onClick={() => this.props.claimed && !this.props.complete
                          ? this.completeRequest(request)
                          : this.acceptRequest(request)}
                        style={{ float: 'right' }}
                      >
                        {this.props.claimed && !this.props.complete ? 'Complete' : 'Accept'}
                      </Button>) : ''}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </>
    );
  }
}
