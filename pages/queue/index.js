import React from 'react';
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  Container,
} from 'reactstrap';
import Page from '../../components/page';
import Layout from '../../components/layout';

import RequestList from '../../components/requestList';
import { NextAuth } from 'next-auth/client';
import Router from 'next/dist/lib/router';
import Cookies from 'universal-cookie';

const forms = [
  {
    name: 'Queue Livechat',
    component: RequestList,
    props: {
      babblerId: '',
      claimed: false,
      complete: false,
    },
  },
  {
    name: 'Schedule',
    component: RequestList,
    props: {
      babblerId: '',
      claimed: false,
      complete: false,
    },
  },
  {
    name: 'Queue upload',
    component: RequestList,
    props: {
      babblerId: '',
      claimed: false,
      complete: false,
    },
  },
  {
    name: 'Started',
    component: RequestList,
    props: {
      babblerId: '@me',
      claimed: true,
      complete: false,
    },
  },
  {
    name: 'Completed',
    component: RequestList,
    props: {
      babblerId: '@me',
      claimed: true,
      complete: true,
    },
  },
];
const names = forms.map(({ name }) => name);

export default class Request extends Page {
  constructor(props) {
    super(props);

    this.state = {
      currentForm: 0,
    };

    this.changeForm = this.changeForm.bind(this);
  }

  changeForm(newIndex) {
    return () => this.setState({
      currentForm: newIndex,
    });
  }

  render() {
    const {
      currentForm,
    } = this.state;

    const CurrentForm = forms[currentForm];

    console.log(CurrentForm);

    return (
      <Layout navmenu={false} session={this.props.session}>
        <h1>Work on Request</h1>
        <Row>
          <Col xs={12} md={4} lg={3}>
            <ButtonGroup vertical style={{ width: '100%' }}>
              {names.map((name, i) => (
                <Button
                  key={
                    // we can use an array index here since the names array will not ever change.
                    // eslint-disable-next-line react/no-array-index-key
                    i}
                  size="lg"
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
                babbblerId={CurrentForm.props.babblerId}
                complete={CurrentForm.props.complete}
                claimed={CurrentForm.props.claimed}
              />
            </Container>
          </Col>
        </Row>
      </Layout>
    );
  }
}
