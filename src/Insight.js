import React, { Component } from "react";
import injectSheet from "react-jss";
import wiki from "wikijs";

const styles = {
  image: {
    padding: "10px",
    height: "100px",
    width: "100px"
  },
  text: {
    fontFamily: "Arial",
    textDecoration: "underline",
    fontSize: props => `${props.mentions / 10}em` <= 13 ? 13 : `${props.mentions / 10}em`,
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
    this.setState({ isPreviewOpen: false });
  };

  render() {
    const { isPreviewOpen } = this.state;
    const { insight, classes } = this.props;
    let image;
    wiki().page(insight).then(page => page.images()).then(images => {
      image = images[0];
    });
    return (
      <div>
        <div
          className={classes.text}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          {insight}
        </div>
        {isPreviewOpen && <img className={classes.image} src={image} />}
      </div>
    );
  }
}

export default injectSheet(styles)(Insight);
