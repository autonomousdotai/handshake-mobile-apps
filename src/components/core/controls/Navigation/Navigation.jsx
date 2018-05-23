import React from "react";
import { Link } from "react-router-dom";
import { URL } from "@/config";
import css from "./Navigation.scss";
import PropTypes from "prop-types";
class Navigation extends React.Component {
  static propTypes = {
    location: PropTypes.object
  };
  renderItem = ({ uri, text, src }) => {
    console.log(this.props);
    const suffixCss = this.props?.location?.pathname?.startsWith(uri)
      ? "selected"
      : "";
    // const suffixCss = "";
    const classNameIcon = `icon${suffixCss}`;
    const classNameText = `text${suffixCss}`;
    const icon = require(`@/assets/images/${src}.svg.raw`);
    return (
      <Link to={uri} style={styles.actionButton}>
        <div
          className={classNameIcon}
          dangerouslySetInnerHTML={{
            __html: icon
          }}
        />
        <label className={classNameText}>{text}</label>
      </Link>
    );
  };
  render() {
    return (
      <footer className="footer" style={styles.container}>
        {this.renderItem({
          uri: URL.HANDSHAKE_ME_INDEX,
          src: "ic_private",
          text: "Me"
        })}
        {this.renderItem({
          uri: URL.HANDSHAKE_DISCOVER_INDEX,
          src: "ic_discover",
          text: "Discover"
        })}

        <div style={styles.actionButton}>
          <img
            className="icon_add"
            src={require("@/assets/images/ic_add.svg")}
          />
        </div>
        {this.renderItem({
          uri: URL.HANDSHAKE_CHAT_INDEX,
          src: "ic_chat",
          text: "Chat"
        })}

        {this.renderItem({
          uri: URL.HANDSHAKE_WALLET_INDEX,
          src: "ic_wallet",
          text: "Wallet"
        })}
      </footer>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    shadowOpacity: 0.5,
    shadowColor: "#E1E1E1",
    shadowRadius: 10,
    borderTop: "1px solid #E1E1E1",
    justifyContent: "space-around"
  },
  actionButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  textActionButton: {},
  textActionButtonSelected: {}
};

export default Navigation;
