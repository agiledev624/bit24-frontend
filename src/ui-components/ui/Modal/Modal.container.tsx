import React from "react";
import { getModals } from "@/selectors/app.selectors";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import { closeModal, closeAllModals } from "@/actions/app.actions";

function createModalPortal(component) {
  // const node = document.querySelector('.ui-modal__container');

  // if (node) {
  //   return ReactDOM.createPortal(component, node);
  // } else {
  return ReactDOM.createPortal(component, document.body);
  // }
}

interface Props {
  modals: any[];
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContainer = React.memo(
  ({ modals, closeModal, closeAllModals }: Partial<Props>) =>
    createModalPortal(
      modals.map((data) => {
        const { component, id, modalProps } = data;

        return React.createElement(component, {
          key: id,
          mId: id,
          isOpen: true,
          closeModal,
          closeAllModals,
          ...modalProps,
        });
      })
    )
);

const mapStateToProps = (state) => ({
  modals: getModals(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: function (id) {
    dispatch(closeModal(id));
  },
  closeAllModals: function () {
    dispatch(closeAllModals());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
