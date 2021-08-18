import React, { ReactNode } from 'react';
import { Icon } from '@/ui-components';
import classNames from 'classnames';

interface OrderFormCollapseProps {
  children: ReactNode;
  title: string;
  expandedTitle?: string;
}

interface OrderFormCollapseState {
  expanded: boolean;
}

class OrderFormCollapseArea extends React.Component<
  OrderFormCollapseProps,
  OrderFormCollapseState
> {
  state = {
    expanded: false,
  };

  constructor(props) {
    super(props);

    this.onToggleBtnClick = this.onToggleBtnClick.bind(this);
  }

  onToggleBtnClick() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { expanded } = this.state;
    const { title, expandedTitle } = this.props;
    const cntClasses = classNames('order-form__advanced-btn');

    const btnTitle = expanded ? expandedTitle || title : title;
    const expandIcon = expanded ? (
      <Icon classes={['']} cssmodule='fas' id='minus-circle' />
    ) : (
      <Icon cssmodule='fas' id='plus-circle' />
    );

    return (
      <div className={cntClasses}>
        <div
          className='order-form__advanced-btn__title_ctn clickable'
          onClick={this.onToggleBtnClick}
        >
          <span className='order-form__advanced-btn__title'>
            <div className='expand-icon'>{expandIcon}</div>
            {'  '}
            {btnTitle}
          </span>
        </div>
        {expanded && (
          <div className='order-form__advanced-btn__body'>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default OrderFormCollapseArea;
