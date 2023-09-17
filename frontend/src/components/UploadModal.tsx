"use client";

import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from 'axios';
import useUploadModal from '@/hooks/useUploadModal';
import useUserAddress from "@/hooks/useUserAddress";
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

// Function to upload file to IPFS and return its CID
async function uploadToIPFS(file:any) {
  if(file){
    try{
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_API_SECRET,
            "Content-Type": "multipart/form-data"
        },
    });
    const cid = `ipfs://${res.data.IpfsHash}`;
    return cid;
    }catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
  }
  }
}


const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const router = useRouter();
  const {state} = useUserAddress();
  const { contract } = state;

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      music: null,
      image: null,
      price: 0.0
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const musicFile = values.music?.[0];

      if (!imageFile || !musicFile ) {
        toast.error('Missing fields')
        return;
      }
      if (contract){
        // Step 1: Upload the image and audio files to IPFS
        const imageCID = await uploadToIPFS(imageFile);
        const audioCID = await uploadToIPFS(musicFile);
        const etherPrice = values.price * 10**18

        // Step 2: Call the `uploadMusic` contract function with the CIDs
        const upload = await contract.uploadMusic(values.title,imageCID, audioCID,etherPrice.toString());
        await upload.wait();

        router.refresh();
        setIsLoading(false);
        toast.success('Song created!');
        reset();
        uploadModal.onClose();
        window.location.reload();
      } 
    } catch (error) {
      console.log("error:",error)
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a music"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      Upload Content
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input
          id="Music Tite"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Music title"
        />
        
        <div>
          <div className="pb-1">
            Select a music file
          </div>
          <Input
            placeholder="music.mp3" 
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="music"
            {...register('music', { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            placeholder="image.jpg" 
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register('image', { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">
            Price
          </div>
          <Input
            placeholder="1 ETH" 
            disabled={isLoading}
            type="number"
            step="any"
            id="price"
            {...register('price', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? 'Uploading...' : 'Create'}
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;