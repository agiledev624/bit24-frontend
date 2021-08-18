import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@/ui-components";

class TickerListFavoriteFilter extends React.PureComponent {
  static defaultProps = {
    showOnlyFavorites: false,
    toggleShowFavoritesOnly: function toggleShowFavoritesOnly() {},
  };

  render() {
    // const { showOnlyFavorites, toggleShowFavoritesOnly } = this.props;

    return (
      <div className="clickable tickerlist__favourite" onClick={() => {}}>
        <IconButton
          tooltip="Only favorites"
          clear={true}
          size="small"
          delayed={true}
          // dim={!showOnlyFavorites}
          // active={showOnlyFavorites}
          id="star"
        />
      </div>
    );
  }
}

export default TickerListFavoriteFilter;
