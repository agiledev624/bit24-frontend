import React, { useState } from 'react';
import { Icon, Button, SelectDropdown, NumberFormat } from '@/ui-components';
import { ChartFavoriteDropdown } from '../chart/Chart.favorite.dropdown';

const defaultOptions = [
  {
    label: 'USD',
    value: 'usd',
  },
  {
    label: 'BTC',
    value: 'btc',
  },
  {
    label: 'ETH',
    value: 'eth',
  },
];

interface Props {
  estimateTotal?: number;
  hidden?: boolean;
  onChangeShowMode?: () => void;
}

export default function AssetsTotal({
  estimateTotal,
  hidden,
  onChangeShowMode,
}: Props) {
  const [coinUnit, setCoinUnit] = useState(defaultOptions[0].value);
  const onChange = ({ value }) => {
    setCoinUnit(value);
  };

  return (
    <div className='e-assets__total'>
      <div className='e-assets__total__title-section' onClick={onChangeShowMode}>
        Est.Total{' '}
        <Button onClick={() => {}}>
          <Icon
            cssmodule='fas'
            id={hidden ? 'eye-slash' : 'eye'}
            classes={['font-size-12']}
          />
        </Button>
      </div>
      <ChartFavoriteDropdown
        options={[]}
        selectedOptions={[]}
        setSelectedOptions={[]}
      />
      <div className='e-assets__total__value-section'>
        {hidden ? (
          <div className='text--cool-grey-50'>●●●●●●●●●●</div>
        ) : (
          <React.Fragment>
            $<NumberFormat number={estimateTotal} decimals={2} />
            <SelectDropdown
              options={defaultOptions}
              value={coinUnit}
              onChange={onChange}
              className={'e-assets__unit-dropdown'}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
