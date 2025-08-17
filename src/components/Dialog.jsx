import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const DialogComponent = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  className = '' 
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className={`DialogContent ${className}`}>
          <Dialog.Title className="DialogTitle">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="DialogDescription">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogComponent;
