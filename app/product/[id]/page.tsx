'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CropImage from '@/components/crop';
import { FileWithPreview } from '@/components/crop';
import SvgText from '@/components/svg-text';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import storage from '@/utils/firebase'; // import the storage instance

const ProductPage = ({ params }: { params: { id: string } }) => {
  console.log(params.id);
  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [src, setSrc] = useState<string>('');
  const router = useRouter();

  // Fetch product details
  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${params.id}`);
    const data = await res.json();
    const prod = data.product;
    setProduct(prod);
    setProductName(prod.productName);
    setPrice(prod.price);
    setDepartment(prod.department);
    setImage(prod.image);
    setDescription(prod.productDescription);
    setSrc(prod.image);
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleImageUpload = async (file: FileWithPreview) => {
    console.log("Uploaded file:", file);
  
    try {
      // Create a storage reference
      const storageRef = ref(storage, `products/${params.id}/${file.name}`);
      console.log("Storage reference created:", storageRef);
  
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);
      console.log("Upload task created:", uploadTask);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track the upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle upload errors
          console.error("Upload failed:", error);
          switch (error.code) {
            case "storage/unauthorized":
              console.error("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.error("User canceled the upload");
              break;
            case "storage/unknown":
              console.error("Unknown error occurred, inspect the server response");
              break;
            default:
              console.error("An unknown error occurred while uploading the file.");
          }
        },
        async () => {
          // Handle successful upload
          console.log("File uploaded successfully");
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(url);
          console.log("File uploaded successfully. Download URL:", url);
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/products/review', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id, // Now sending 'id' instead of 'productId'
          changes: {
            productName,
            price,
            department,
            image,
            productDescription: description,
          },
          author: 'current-user-id', // Replace with the actual user ID
        }),
      });
  
      if (response.ok) {
        alert('Review submitted successfully');
        
        router.push('/profile');
      } else {
        alert('Failed to submit review');
        
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting the review');
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border mb-4"
          placeholder="Product Name"
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border mb-4"
          placeholder="Price"
        />
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 border mb-4"
          placeholder="Department"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border mb-4"
          rows={5}
          placeholder="Product Description"
        />

        <div>
          <h1>Upload and Crop Image</h1>
          <CropImage onImageUpload={handleImageUpload} defaultImageUrl={src} />
        </div>
        <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded mt-4">Submit for Review</button>
      </form>
    </div>
  );
};

export default ProductPage;