import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

export default class Schedule extends React.Component {
  static get propTypes() {
    return {
      onSuccess: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      start: null,
      end: null,
      date: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  async onSubmit(e) {
    e.preventDefault();

    const { start, end, date } = this.state;
    const { onSuccess } = this.props;

    // eslint-disable-next-line no-undef
    const res = await fetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'schedule',
        data: {
          date: new Date(date),
          start,
          end,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to make scheduled request: ${res.statusText}`);
    }

    onSuccess('Successfully requested scheduled translation');
  }

  onDateChange(e) {
    this.setState({
      date: e.target.value,
    });
  }

  onStartChange(e) {
    this.setState({
      start: e.target.value,
    });
  }

  onEndChange(e) {
    this.setState({
      end: e.target.value,
    });
  }

  render() {
    const { start, end, date } = this.state;
    return (
      <>
        <h2>Schedule a Babbler</h2>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label htmlFor="date">
              Date:
              <Input
                required
                type="date"
                id="date"
                value={date}
                onChange={this.onDateChange}
              />
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="start">
              Start time:
              <Input
                required
                type="time"
                id="start"
                value={start}
                onChange={this.onStartChange}
              />
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="end">
              End time:
              <Input
                required
                type="time"
                id="end"
                min={start}
                value={end}
                onChange={this.onEndDateChange}
              />
            </Label>
          </FormGroup>
          <FormGroup>
            <Input type="submit" value="Schedule" />
          </FormGroup>
        </Form>
      </>
    );
  }
}
