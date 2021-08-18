import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { Icon } from "../Icon";
import _isString from "lodash/isString";
import _isNumber from "lodash/isNumber";
import _isFunction from "lodash/isFunction";
import _isUndefined from "lodash/isUndefined";

const DEFAULT_PLACEHOLDER_STRING = "Select...";

interface TabOption {
  label: ReactNode;
  value: any;
  // group
  type?: "group";
  name?: string;
  items?: TabOption[];
}

interface SelectDropdownProps {
  options: TabOption[];
  value: any;
  onChange: (selected: TabOption) => void;
  placeholder: ReactNode;
  className: string;
  controlClassName: string;
  placeholderClassName: string;
  menuClassName: string;
  arrowClassName: string;
  arrowClosed: ReactNode;
  arrowOpen: ReactNode;
  onFocus: (isOpen: boolean) => void;
  disabled: boolean;
  baseClassName: string;
  closeOnMouseLeave: boolean;
}

interface SelectDropdownState {
  selected?: TabOption;
  isOpen: boolean;
}
export class SelectDropdown extends React.PureComponent<
  Partial<SelectDropdownProps>,
  SelectDropdownState
> {
  static defaultProps = {
    baseClassName: "cpn-select-dropdown",
    placeholder: DEFAULT_PLACEHOLDER_STRING,
    arrowClosed: <Icon id="angle-down" />,
    arrowOpen: <Icon id="angle-up" />,
    closeOnMouseLeave: false,
  };
  state = {
    selected: this.parseValue(this.props.value, this.props.options) || {
      label: this.props.placeholder,
      value: "",
    },
    isOpen: false,
  };

  mounted = true;

  constructor(props) {
    super(props);

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.fireChangeEvent = this.fireChangeEvent.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.value) {
      var selected = this.parseValue(newProps.value, newProps.options);
      if (selected !== this.state.selected) {
        this.setState({ selected: selected });
      }
    } else {
      this.setState({
        selected: {
          label: newProps.placeholder || DEFAULT_PLACEHOLDER_STRING,
          value: "",
        },
      });
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener("click", this.handleDocumentClick, false);
  }

  handleMouseDown(event) {
    if (this.props.onFocus && _isFunction(this.props.onFocus)) {
      this.props.onFocus(this.state.isOpen);
    }
    if (event.type === "mousedown" && event.button !== 0) return;

    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  }

  parseValue(value, options) {
    let option;

    if (this.isValidValue(value)) {
      for (var i = 0, num = options.length; i < num; i++) {
        if (options[i].type === "group") {
          const match = options[i].items.filter((item) => item.value === value);
          if (match.length) {
            option = match[0];
          }
        } else if (
          !_isUndefined(options[i].value) &&
          options[i].value === value
        ) {
          option = options[i];
        }
      }
    }

    return option || value;
  }

  isValidValue(value) {
    return _isString(value) || _isNumber(value);
  }

  setValue(value, label) {
    let newState = {
      selected: {
        value,
        label,
      },
      isOpen: false,
    };
    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption(option) {
    let value = option.value;
    if (typeof value === "undefined") {
      value = option.label || option;
    }
    let label = option.label || option.value || option;
    let isSelected =
      value === this.state.selected.value || value === this.state.selected;

    const classes = {
      [`${this.props.baseClassName}-option`]: true,
      [option.className]: !!option.className,
      "is-selected": isSelected,
      "is-disabled": !!option.disabled,
    };

    const optionClass = classNames(classes);

    return (
      <div
        key={value}
        className={optionClass}
        onMouseDown={this.setValue.bind(this, value, label)}
        onClick={
          !!option.disabled ? null : this.setValue.bind(this, value, label)
        }
        role="option"
        aria-selected={isSelected ? "true" : "false"}
      >
        {label}
      </div>
    );
  }

  buildMenu() {
    let { options, baseClassName } = this.props;

    let ops = options.map((option) => {
      if (option.type === "group") {
        let groupTitle = (
          <div className={`${baseClassName}-title`}>{option.name}</div>
        );
        let _options = option.items.map((item) => this.renderOption(item));

        return (
          <div
            className={`${baseClassName}-group`}
            key={option.name}
            role="listbox"
          >
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        return this.renderOption(option);
      }
    });

    return ops.length ? (
      ops
    ) : (
      <div className={`${baseClassName}-noresults`}>No options found</div>
    );
  }

  handleDocumentClick(event) {
    // event.stopPropagation();

    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        if (this.state.isOpen) {
          this.setState({ isOpen: false });
        }
      }
    }
  }

  isValueSelected() {
    return (
      this.isValidValue(this.state.selected) || this.state.selected.value !== ""
    );
  }

  render() {
    const {
      baseClassName,
      controlClassName,
      placeholderClassName,
      menuClassName,
      arrowClassName,
      arrowClosed,
      arrowOpen,
      className,
      closeOnMouseLeave,
    } = this.props;

    const disabledClass = this.props.disabled ? "dropdown-disabled" : "";
    const placeHolderValue = this.isValidValue(this.state.selected)
      ? this.state.selected
      : this.state.selected.label;

    const dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      [className]: !!className,
      "is-open": this.state.isOpen,
    });
    const controlClass = classNames({
      [`${baseClassName}-control`]: true,
      [controlClassName]: !!controlClassName,
      [disabledClass]: !!disabledClass,
    });
    const placeholderClass = classNames({
      [`${baseClassName}-placeholder`]: true,
      [placeholderClassName]: !!placeholderClassName,
      "is-selected": this.isValueSelected(),
    });
    const menuClass = classNames({
      [`${baseClassName}-menu`]: true,
      [menuClassName]: !!menuClassName,
    });
    const arrowClass = classNames({
      [`${baseClassName}-arrow`]: true,
      [arrowClassName]: !!arrowClassName,
    });

    const value = <div className={placeholderClass}>{placeHolderValue}</div>;
    const menu = this.state.isOpen ? (
      <div
        className={menuClass}
        aria-expanded="true"
        onMouseLeave={() =>
          closeOnMouseLeave && this.setState({ isOpen: false })
        }
      >
        {this.buildMenu()}
      </div>
    ) : null;

    return (
      <div className={dropdownClass}>
        <div
          className={controlClass}
          onClick={this.handleMouseDown}
          aria-haspopup="listbox"
        >
          {value}
          <div className={`${baseClassName}-arrow-wrapper`}>
            {arrowOpen && arrowClosed ? (
              this.state.isOpen ? (
                arrowOpen
              ) : (
                arrowClosed
              )
            ) : (
              <span className={arrowClass} />
            )}
          </div>
        </div>
        {menu}
      </div>
    );
  }
}
