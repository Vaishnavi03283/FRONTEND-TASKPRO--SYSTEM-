import React from 'react';
import { cn } from '../../utils';
import styles from './Card.module.css';

const Card = React.forwardRef(({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  shadow = 'md',
  hover = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: 'card-default',
    primary: 'card-primary',
    secondary: 'card-secondary',
    success: 'card-success',
    warning: 'card-warning',
    error: 'card-error'
  };

  const paddingClasses = {
    none: 'card-padding-none',
    sm: 'card-padding-sm',
    md: 'card-padding-md',
    lg: 'card-padding-lg',
    xl: 'card-padding-xl'
  };

  const shadowClasses = {
    none: 'card-shadow-none',
    sm: 'card-shadow-sm',
    md: 'card-shadow-md',
    lg: 'card-shadow-lg',
    xl: 'card-shadow-xl'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    {
      'card-hover': hover
    },
    className
  );

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header Component
const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('card-header', className)} {...props}>
      {children}
    </div>
  );
};

// Card Body Component
const CardBody = ({ children, className, ...props }) => {
  return (
    <div className={cn('card-body', className)} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn('card-footer', className)} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn('card-title', className)} {...props}>
      {children}
    </h3>
  );
};

// Card Description Component
const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn('card-description', className)} {...props}>
      {children}
    </p>
  );
};

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription };
export default Card;