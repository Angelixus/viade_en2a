import React, { Component } from "react";
import data from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { RouteListPageContent } from "./routeList.component";
import { successToaster, errorToaster } from "@utils";
import ldflex from "@solid/query-ldflex";

const defaultProfilePhoto = "/img/icon/empty-profile.svg";

class ListItem extends Component {
  render() {
    return <div className="infinite-list-item">List Item {this.props.num}</div>;
  }
}
/**
 * Container component for the Welcome Page, containing example of how to fetch data from a POD
 */
export class RouteListComponent extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      image: defaultProfilePhoto,
      isLoading: false,
      hasImage: false,
      elements: this.buildElements(0, 100),
      isInfiniteLoading: false
    };
  }
  componentDidMount() {
    const { webId } = this.props;
    if (webId) this.getProfileData();
  }

  componentDidUpdate(prevProps) {
    const { webId } = this.props;
    if (webId && webId !== prevProps.webId) this.getProfileData();
  }

  /**
   * This function retrieves a user's card data and tries to grab both the user's name and profile photo if they exist.
   *
   * This is an example of how to use the LDFlex library to fetch different linked data fields.
   */
  getProfileData = async () => {
    this.setState({ isLoading: true });
    let hasImage;
    const { webId } = this.props;
    /*
     * This is an example of how to use LDFlex. Here, we're loading the webID link into a user variable. This user object
     * will contain all of the data stored in the webID link, such as profile information. Then, we're grabbing the user.name property
     * from the returned user object.
     */
    const user = data[webId];
    const nameLd = await user.vcard_fn;

    const name =
      nameLd && nameLd.value.trim().length > 0
        ? nameLd.value
        : webId.toString();
    const imageLd = await user.vcard_hasPhoto;

    let image;
    if (imageLd && imageLd.value) {
      image = imageLd.value;
      hasImage = true;
    } else {
      hasImage = false;
      image = defaultProfilePhoto;
    }
    /**
     * This is where we set the state with the name and image values. The user[hasPhotoContext] line of code is an example of
     * what to do when LDFlex doesn't have the full context. LDFlex has many data contexts already in place, but in case
     * it's missing, you can manually add it like we're doing here.
     *
     * The hasPhotoContext variable stores a link to the definition of the vcard ontology and, specifically, the #hasPhoto
     * property that we're using to store and link the profile image.
     *
     * For more information please go to: https://github.com/solid/query-ldflex
     */
    this.setState({ name, image, isLoading: false, hasImage });
  };

  /**
   * updatedPhoto will update the photo url on vcard file
   * this function will check if user has image or hasPhoto node if not
   * will just update it, the idea is use image instead of hasPhoto
   * @params{String} uri photo url
   */
  updatePhoto = async (uri: String, message, title = "") => {
    const { hasImage } = this.state;
    try {
      const { user } = data;
      if (hasImage) await user.vcard_hasPhoto.set(namedNode(uri));
      else await user.vcard_hasPhoto.add(namedNode(uri));
      successToaster(message, title);
    } catch (error) {
      errorToaster(error.message, "Error");
    }
  };

  buildElements(start, end) {
    var elements = [];

    for (var i = start; i < end; i++) {
      elements.push(<ListItem key={i} num={i} />);
    }
    return elements;
  }

  handleInfiniteLoad = () => {
    var that = this;
    this.setState({
      isInfiniteLoading: true
    });
    setTimeout(function() {
      var elemLength = that.state.elements.length,
        newElements = that.buildElements(elemLength, elemLength + 10);
      that.setState({
        isInfiniteLoading: false,
        elements: that.state.elements.concat(newElements)
      });
    }, 100);
  };

  elementInfiniteLoad() {
    return <div className="infinite-list-item">Loading...</div>;
  }

  render() {
    const { name, image, isLoading } = this.state;
    const { webId } = this.props;
    return (
      <RouteListPageContent
        {...{
          name,
          image,
          isLoading,
          webId,
          updatePhoto: this.updatePhoto,
          buildElements: this.buildElements,
          handleInfiniteLoad: this.handleInfiniteLoad,
          elementInfiniteLoad: this.elementInfiniteLoad,
          elements: this.state.elements,
          isInfiniteLoading: this.state.isInfiniteLoading
        }}
      />
    );
  }
}
