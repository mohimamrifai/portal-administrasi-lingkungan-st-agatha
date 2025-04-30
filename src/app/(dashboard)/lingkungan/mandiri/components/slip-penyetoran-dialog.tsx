"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SlipPenyetoranViewer from './slip-penyetoran-viewer';

interface SlipPenyetoranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SlipPenyetoranDialog: React.FC<SlipPenyetoranDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Template Slip Penyetoran Dana Mandiri</DialogTitle>
        </DialogHeader>
        <SlipPenyetoranViewer />
      </DialogContent>
    </Dialog>
  );
};

export default SlipPenyetoranDialog; 