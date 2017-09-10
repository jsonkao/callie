import React, { Component } from "react";
import injectSheet from "react-jss";

const styles = {
  image: {
    padding: "10px",
    height: "100px",
    width: "100px"
  },
  text: {
    fontSize: "1.5em"
  }
};

class Insight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreviewOpen: false
    };
  }

  handleMouseOver = () => {
    this.setState({ isPreviewOpen: true });
  };

  handleMouseOut = () => {
    console.log("LEAVE");
    this.setState({ isPreviewOpen: false });
  };

  render() {
    const { isPreviewOpen } = this.state;
    const { insight, classes } = this.props;
    return (
      <div>
        <div
          className={classes.text}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          {insight}
        </div>
        {isPreviewOpen &&
          <img
            className={classes.image}
            src="https://i.imgur.com/QSnupn0.jpg"
          />}
      </div>
    );
  }
}

export default injectSheet(styles)(Insight);
