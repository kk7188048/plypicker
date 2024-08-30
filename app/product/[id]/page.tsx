'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CropImage from '@/components/crop';
import { FileWithPreview } from '@/components/crop';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import storage from '@/utils/firebase';
import axios from 'axios';
import Header from '@/components/mainheader';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [src, setSrc] = useState<string>('');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  // Fetch product details
  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${params.id}`);
    const data = await res.json();
    const prod = data.product;
    setProductName(prod.productName);
    setPrice(prod.price);
    setDepartment(prod.department);
    setImage(prod.image);
    setDescription(prod.productDescription);
    setSrc(prod.image);
  };

  // Fetch user role
  const fetchUserRole = async () => {
    const res = await fetch('/api/auth/profile');
    if (res.ok) {
      const data = await res.json();
      console.log(data.role);
      setUserRole(data.role);
    } else {
      console.error('Failed to fetch user role');
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
    fetchUserRole();
  }, [params.id]);

  const handleImageUpload = async (file: FileWithPreview) => {
    try {
      const storageRef = ref(storage, `products/${params.id}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(url);
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (userRole === 'admin') {
        const response = await fetch('/api/products/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: params.id,
           changes:{ productName,
            price,
            department,
            image,
            productDescription: description,
           }
          }),
        });
        if (response.ok) {
          alert('Changes submitted successfully');
          router.push('/dashboard/admin');
        } else {
          alert('Failed to submit changes');
        }
      } else {
        const endpoint = '/api/products/review';
        const response = await axios.put(endpoint, {
          id: params.id,
          changes: {
            productName,
            price,
            department,
            image,
            productDescription: description,
          },
          author: 'current-user-id',
        });
        if (response.status === 200) {
          alert('Changes submitted successfully');
          router.push('/dashboard/team');
        } else {
          alert('Failed to submit changes');
        }
      }
    } catch (error) {
      console.error('Error submitting changes:', error);
      alert('An error occurred while submitting the changes');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <Header />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Product</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="block mb-2 text-lg font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Product Name"
        />

        <label className="block mb-2 text-lg font-medium text-gray-700">Price</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Price"
        />

        <label className="block mb-2 text-lg font-medium text-gray-700">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Department"
        />

        <label className="block mb-2 text-lg font-medium text-gray-700">Product Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Product Description"
        />

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Upload and Crop Image</h2>
          <CropImage onImageUpload={handleImageUpload} defaultImageUrl={src} />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {userRole === 'admin' ? 'Update Directly' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
};

export default ProductPage;
