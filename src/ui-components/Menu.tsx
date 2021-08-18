import React, { ReactNode } from "react";
import className from "classnames";

export type MenuItemProps = {
  content: ReactNode;
  divider?: boolean;
  spaceBottom?: boolean;
  isActive?: boolean;
  classes?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export const MenuItem = ({
  content,
  divider,
  spaceBottom,
  isActive,
  classes,
  onClick,
}: MenuItemProps) => {
  const liClasses = className(classes, {
    "cpn-menu__line__divider": divider,
    "pb-10": spaceBottom,
    "cpn-menu__item--active": isActive,
  });

  return (
    <li className={liClasses} onClick={onClick}>
      {content}
    </li>
  );
};

export type MenuProps = {
  header?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  items?: MenuItemProps[];
  children?: ReactNode;
};

export const Menu = ({
  hoverable = false,
  header,
  footer,
  items = [],
  children,
}: MenuProps) => {
  const classes = className("cpn-menu", {
    "cpn-menu--hoverable": hoverable,
  });
  return (
    <ul className={classes}>
      {header && (
        <li className="cpn-menu__header cpn-menu__margin-bottom-10">
          {header}
        </li>
      )}
      {items.map((item: MenuItemProps, index: number) => (
        <MenuItem key={index} {...item} />
      ))}
      {children}
      {footer && <li className="mt-10">{footer}</li>}
    </ul>
  );
};
