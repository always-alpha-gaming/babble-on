import React from 'react';
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  Container,
  UncontrolledAlert,
} from 'reactstrap';
import RequestList from '../components/requestList';
import Page from '../components/page';
import Layout from '../components/layout';

import Upload from '../components/request-forms/upload';
import LiveChat from '../components/request-forms/live-chat';
import Schedule from '../components/request-forms/schedule';

const forms = [
  {
    name: 'Upload',
    component: Upload,
    props: {
      userId: '@me',
      claimed: true,
      complete: true,
    },
  },
  {
    name: 'Completed',
    component: RequestList,
    props: {
      userId: '@me',
      claimed: true,
      complete: true,
      renderContent: true,
    },
  },
  {
    name: 'Live Chat',
    component: LiveChat,
  },
  {
    name: 'Schedule',
    component: Schedule,
  },
];
const names = forms.map(({ name }) => name);

export default class Request extends Page {
  constructor(props) {
    super(props);

    this.state = {
      currentForm: 0,
      successMessage: '',
    };

    this.changeForm = this.changeForm.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  changeForm(newIndex) {
    return () => this.setState({
      currentForm: newIndex,
      successMessage: '',
    });
  }

  onSuccess(message) {
    this.setState({
      successMessage: message,
    });
  }

  render() {
    const {
      currentForm,
      successMessage,
    } = this.state;

    const CurrentForm = forms[currentForm];

    return (
      <Layout navmenu={false} session={this.props.session}>
        {successMessage && (
          <UncontrolledAlert color="success">
            {successMessage}
          </UncontrolledAlert>
        )}
        <h1>Request a Babbler</h1>
        <Row>
          <Col xs={12} md={4} lg={3}>
            <ButtonGroup vertical style={{ width: '100%' }}>
              {names.map((name, i) => (
                <Button
                  key={name}
                  size="lg"
                  block
                  onClick={this.changeForm(i)}
                  active={i === currentForm}
                >
                  {name}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
          <Col xs={12} md={8} lg={9}>
            <Container>
              <CurrentForm.component
                onSuccess={this.onSuccess}
                userId={CurrentForm.props.userId}
                claimed={CurrentForm.props.claimed}
                complete={CurrentForm.props.complete}
                renderContent={CurrentForm.props.renderContent}
              />
            </Container>
          </Col>
        </Row>
      </Layout>
    );
  }
}
