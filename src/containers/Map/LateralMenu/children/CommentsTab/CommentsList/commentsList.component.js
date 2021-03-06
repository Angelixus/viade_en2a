import React from "react";
import Media from "react-bootstrap/Media";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";

class CommentsList extends React.Component {
  constructor(props) {
    super(props);
    const { comments } = props;
    this.state = { comments: comments };
  }

  render() {
    return (
      <Modal.Dialog
        className="commentsList"
        scrollable
        centered
        style={{ "max-width": "100%" }}
      >
        <Modal.Body
          style={{
            "max-height": "calc(100vh - 220px)",
            "overflow-y": "auto",
            width: "100%",
            "scrollbar-width": "thin",
          }}
        >
          <Container>
            {this.props.comments.map((comment) => {
              return (
                <Media>
                  <Media.Body>
                    <p style={{ "font-size": "15px", "font-weight": "bold" }}>
                      {comment.author
                        .replace("https://", "")
                        .replace("/profile/card#me", "")}{" "}
                      - {comment.dateCreated}
                    </p>
                    <p> {comment.text} </p>
                  </Media.Body>
                </Media>
              );
            })}
          </Container>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
}
export default CommentsList;
