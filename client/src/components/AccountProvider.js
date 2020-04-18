import React, { Component } from "react";

export const AccountContext = React.createContext();

export class AccountProvider extends Component {
  state = { cid: "", name: "" };

  render() {
    return (
      <AccountContext.Provider
        value={{
          state: this.state,
          setCid: (cid) => this.setState({ cid }),
          setName: (name) => this.setState({ name }),
          setCidAndName: (cid, name) => {
            this.setState({ cid, name });
          },
        }}
      >
        {this.props.children}
      </AccountContext.Provider>
    );
  }
}

export default AccountContext;
