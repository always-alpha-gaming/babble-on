import React from 'react';
import {
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      text: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    const { name, text } = this.state;
    const { onSuccess } = this.props;

    // eslint-disable-next-line no-undef
    fetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'upload',
        name,
        data: {
          text,
        },
      }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to create new request');
      }
    }).then(this.resetFields)
      .then(() => onSuccess('Successfully requested text translation'));
  }

  onTextChange(e) {
    this.setState({ text: e.target.value });
  }

  resetFields() {
    this.setState({
      name: '',
      text: '',
    });
  }

  render() {
    const { name, text } = this.state;
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Upload text</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label htmlFor="name">
                  Name:
                  <Input
                    onChange={({ target: { value } }) => this.setState({ name: value })}
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    required
                  />
                  <FormText color="muted">
                    A friendly name for the document
                  </FormText>
                </Label>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="text">
                  Text
                  <Input
                    type="textarea"
                    id="text"
                    onChange={this.onTextChange}
                    value={text}
                  />
                  <FormText color="muted">
                    Add the text that makes up the document
                  </FormText>
                </Label>
              </FormGroup>
              <Input type="submit" value="Upload" />
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}
