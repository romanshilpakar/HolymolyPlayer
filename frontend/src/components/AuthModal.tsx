"use client";

import React, { useEffect } from 'react';
import useAuthModal from "@/hooks/useAuthModal";

import Modal from './Modal';

const AuthModal = () => {
  const { onClose, isOpen } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  }

  return (
    <Modal 
      title="Oops !!!!!" 
      description="Please connect to Sepolia testnet." 
      isOpen={isOpen} 
      onChange={onChange} 
    >   
    </Modal>
  
  );
}

export default AuthModal;