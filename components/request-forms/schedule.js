import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onStartDateChange(e) {
    this.setState({
      start: e.getMilliseconds(),
    });
  }

  onEndDateChange(e) {
    this.setState({
      end: e.getMilliseconds(),
    });
  }

  render() {
    const { start, end } = this.state;
    return (
      <>
        <h2>Schedule a Babbler</h2>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label htmlFor="start">
              Start time:
              <DatePicker
                id="start"
                selected={start}
                onChange={this.onStartDateChange}
                showTimeSelect
              />
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="end">
              End time:
              <DatePicker
                id="end"
                selected={end}
                onChange={this.onEndDateChange}
                showTimeSelect
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
