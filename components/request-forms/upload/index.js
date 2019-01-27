// wrap image and text in some tabs
import React from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import Image from './image';
import Text from './text';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.setIndexTo = this.setIndexTo.bind(this);
  }

  setIndexTo(index) {
    return () => this.setState({ index });
  }

  render() {
    const { index } = this.state;
    return (
      <>
        <Nav tabs>
          <NavItem>
            <NavLink
              onClick={this.setIndexTo(0)}
              active={index === 0}
            >
              Image
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={this.setIndexTo(1)}
              active={index === 1}
            >
              Text
            </NavLink>
          </NavItem>
        </Nav>
        <br />
        <TabContent activeTab={index}>
          <TabPane tabId={0}>
            <Image />
          </TabPane>
          <TabPane tabId={1}>
            <Text />
          </TabPane>
        </TabContent>
      </>
    );
  }
}
