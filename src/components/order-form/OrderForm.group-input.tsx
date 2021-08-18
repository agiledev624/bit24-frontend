import React from 'react';
import classNames from 'classnames';
import { InputTextInline } from '@/ui-components';

const GroupInput = (props) => {
  const inputGroupWrapperClasses = classNames('form-input__group__container', {
    'form-input__group__container--disabled': props.disabled,
  });

  // const inputProps = _pick(props, ['pattern', 'value', 'onChange', 'disabled'])
  return (
    <div className='form-input'>
      <span className={inputGroupWrapperClasses}>
        <span className='form-input__wrapper'>
          {props.addonBefore && (
            <span className='form-input__addonBefore'>{props.addonBefore}</span>
          )}
          <div className="d-flex d-align-items-center">
            <InputTextInline type='text' useHandlers={false} {...props} />
            {props.addonAfter && (
              <span className='form-input__addonAfter'>{props.addonAfter}</span>
            )}
          </div>
        </span>
      </span>
    </div>
  );
};

export default GroupInput;
