import React, { ReactNode, useCallback } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import Close from "../icons/close";

interface CardProps {
  cardIdentify?: any;
  children: ReactNode;
  title?: ReactNode;
  rightTool?: ReactNode;
  resizable?: boolean;
  closable?: boolean;
  transparent?: boolean;
  draggable?: boolean;
  onClose?: (identiy?: any) => void;
  className?: string;
  contentPadding?: boolean;
}

const iconClass = [];

export const Card = ({
  cardIdentify,
  title = "Title",
  className,
  rightTool,
  children,
  resizable = true,
  draggable = true,
  closable,
  onClose,
  transparent = true,
  contentPadding = true,
}: CardProps) => {
  const cardClass = classNames("card", className, {
    transparent: resizable && transparent,
  });

  const titleClass = classNames("card__title__ctn", {
    draggable: draggable,
  });

  const contentClass = classNames("card__content", {
    card__content__padding: contentPadding,
  });

  const onCloseBtnClick = useCallback(
    (e: any) => {
      onClose(cardIdentify);
    },
    [onClose, cardIdentify]
  );

  return (
    <div className={cardClass}>
      <div className={titleClass}>
        <div className="card__title h-100 d-flex d-align-items-center">
          {title}
        </div>
        <div className="icons-right">
          {rightTool}
          {closable && <Close className="close" onClick={onCloseBtnClick} />}
        </div>
      </div>
      <div className={contentClass}>{children}</div>
    </div>
  );
};
