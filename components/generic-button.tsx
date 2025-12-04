import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

type GenericButtonProps = {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  loadingIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit' | undefined;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  className?: string;
};

export const GenericButton = ({
  label,
  loadingLabel,
  isLoading,
  loadingIcon,
  size = 'sm',
  icon,
  onClick,
  disabled,
  type,
  variant,
  className,
}: GenericButtonProps) => {
  const calculateSize =
    size === 'sm' ? 'size-5' : size === 'md' ? 'size-7' : 'size-10';
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      type={type}
      variant={variant}
      className={`transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      <p>{isLoading ? loadingLabel : label}</p>
      {!isLoading && icon}
      {isLoading && (loadingIcon || <Spinner className={calculateSize} />)}
    </Button>
  );
};
