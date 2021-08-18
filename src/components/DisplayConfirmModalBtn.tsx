// show a confirmation popup after clicking on the button
import { showModal } from "@/actions/app.actions";
import { Button } from "@/ui-components";
import React, { ReactNode } from "react";
import { connect } from "react-redux";

interface Props {
  children: ReactNode;
  showModal: (mid: string, component: ReactNode, props) => void;
  popupComp: any;
  popupId: string;
  popupData: any;
  classes: string;
}

class DisplayConfirmModalBtn extends React.PureComponent<Partial<Props>> {
  static defaultProps = {
    classes: "black-btn",
  };

  constructor(props) {
    super(props);

    this.onBtnClick = this.onBtnClick.bind(this);
  }

  onBtnClick(e) {
    e.stopPropagation();

    const { showModal, popupId, popupComp, popupData } = this.props;

    showModal(popupId, popupComp, popupData);
  }

  render() {
    const { classes } = this.props;
    return (
      <Button onClick={this.onBtnClick} classes={classes}>
        {this.props.children}
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: function (id, component, props) {
    dispatch(showModal(id, component, props));
  },
});

export default connect(null, mapDispatchToProps)(DisplayConfirmModalBtn);
