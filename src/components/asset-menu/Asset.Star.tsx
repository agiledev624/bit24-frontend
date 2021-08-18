import React, { useCallback } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { isFavorite } from "@/selectors/ui-setting.selectors";
import { IconButton } from "@/ui-components";
import { toggleFavoriteSymbol } from "@/actions/ticker.actions";

interface AssetStarProps {
  symbol: string;
  isFavorite: boolean;
  toggleFavorite: (ccy: string) => void;
}

const AssetStar = React.memo(
  ({ symbol, isFavorite = false, toggleFavorite }: Partial<AssetStarProps>) => {
    const onClick = useCallback(
      (e) => {
        e.stopPropagation();
        toggleFavorite(symbol);
      },
      [symbol, toggleFavorite]
    );

    const starClasses = classNames("asset__row__cell__star", {
      "asset__row__cell__star--fav": isFavorite,
    });

    return (
      <div className={starClasses}>
        <IconButton
          cssmodule="fa"
          clear={true}
          delayed={true}
          id="star"
          dim={!isFavorite}
          active={isFavorite}
          onClick={onClick}
        />
      </div>
    );
  }
);

const mapStateToProps = (state, props) => ({
  isFavorite: isFavorite(state, props.symbol),
});

const mapDispatchToProps = (dispatch, props) => ({
  toggleFavorite(symbol: string) {
    dispatch(toggleFavoriteSymbol(symbol));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetStar);
