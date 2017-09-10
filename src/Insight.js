import React, { Component } from "react";

class Insight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreviewOpen: false
    };
  }

  handleMouseOver = (event) => {
    this.setState({ isPreviewOpen: true });
  };

  render() {
    const { isPreviewOpen } = this.state;
    return (
      <div onMouseOver={this.handleMouseOver}>
        {insight}
        {isPreviewOpen && <img src="https://i.imgur.com/QSnupn0.jpg" />}
      </div>
    );
  }
}

export default Insight;
