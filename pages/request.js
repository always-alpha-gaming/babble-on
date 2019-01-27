import React from 'react';
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  Container,
} from 'reactstrap';
import Page from '../components/page';
import Layout from '../components/layout';

import Upload from '../components/request-forms/upload/image';

const forms = [
  {
    name: 'Upload',
    component: Upload,
  },
  {
    name: 'Upload',
    component: Upload,
  },
  {
    name: 'Upload',
    component: Upload,
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

    return (
      <Layout session={this.props.session}>
        <h1>Request a Babbler</h1>
        <Row>
          <Col xs={12} md={4} lg={3}>
            <ButtonGroup block vertical style={{ width: '100%' }}>
              {names.map((name, i) => (
                <Button size="lg" block onClick={this.changeForm(i)} active={i === currentForm}>
                  {name}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
          <Col xs={12} md={8} lg={9}>
            <Container>
              <CurrentForm.component />
            </Container>
          </Col>
        </Row>
      </Layout>
    );
  }
}
