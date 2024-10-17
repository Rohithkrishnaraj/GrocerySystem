"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

export default function Home() {
 

  const[items,setItems]=useState([])

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error))
  }, [])
  
  function newPro(newItem){
    setItems([...items,newItem])
  }

  function upPro(updateItems){
    setItems(updateItems)
  }
  function ediPro(editItems){
    setItems(editItems)
  }
  return (
   <div>
     <div>
    <h1 className='text-center font-semibold text-2xl p-2 uppercase mt-5'>Welcome Admin</h1>
  </div>
  <div className='flex justify-center p-10 '>
  <img src={"welcome img.jpg"} alt="" className='rounded-3xl' />

  </div>

  <div className='flex space-x-3 justify-center mb-7 mt-2  '>
  <Button asChild className='bg-yellow-200 text-black border-2 border-black hover:bg-yellow-300'>
  <Link href="/product"  >Product Page</Link>
</Button>
<Button asChild className='bg-orange-200 text-black border-2 border-black hover:bg-orange-300'>
  <Link href="/grocery"  >Grocery Page</Link>
</Button>



   
  </div>
  

   </div>
  );
}
