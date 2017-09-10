import React, { Component } from "react";

class Insight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreviewOpen: false
    };
  }

  handleMouseOver = () => {
    console.log("HOVERED")
    this.setState({ isPreviewOpen: true });
  };

  render() {
    const { isPreviewOpen, insight } = this.state;
    return (
      <div onMouseOver={this.handleMouseOver}>
        {insight}
        {isPreviewOpen && <img src="https://i.imgur.com/QSnupn0.jpg" />}
      </div>
    );
  }
}

export default Insight;
