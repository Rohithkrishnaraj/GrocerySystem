"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function product() {
  const [data, setData] = useState({
    productname: "",
    category: "",
    sku: "",
    price: "",
    stockqty: "",
    unit: "",
    expdate: "",
    suppliername: "",
    description: "",
  });

  const [items, setItems] = useState(null);
  const [editindex, seteditindex] = useState(null);
  const [gg, setgg] = useState(false);
  const fetchData = async () => {
    try {
      const response = await fetch("./api/productdata");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Try to parse the response as JSON
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [gg]);

  function newPro(newItem) {
    setItems([...items, newItem]);
  }

  function upPro(updateItems) {
    setItems(updateItems);
  }
  function ediPro(editItems) {
    setItems(editItems);
  }

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  // async function save(e) {
  //   e.preventDefault();
  //   setgg((prev) => !prev);
  //   try {
  //     const response = await fetch("./api/productdata", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     console.log("Product saved successfully:");
  //   } catch (error) {
  //     console.error("Error saving the product:", error);
  //   }
  // }

  async function save(e) {
    e.preventDefault();
    setgg((prev) => !prev);

    try {
      const method = editindex !== null ? "PUT" : "POST"; // Determine method
      const response = await fetch("./api/productdata", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          id: editindex !== null ? items[editindex].id : undefined,
        }), // Add ID if editing
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (editindex !== null) {
        // If editing, update the local state
        const updatedItems = [...items];
        updatedItems[editindex] = { ...data, id: items[editindex].id }; // Keep the existing ID
        setItems(updatedItems);
      } else {
        // If creating, fetch new data
        const newItem = await response.json();
        newPro(newItem);
      }

      console.log("Product saved successfully:");
      clear(); // Clear form
      seteditindex(null); // Reset edit index
    } catch (error) {
      console.error("Error saving the product:", error);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(`/api/productdata`, {
        method: "DELETE", // Use the DELETE HTTP method
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
        body: JSON.stringify({ id }), // Send the ID in the body of the request
      });
      await fetchData();

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      const data = await response.json(); // Assuming the server responds with JSON
      console.log("Item deleted successfully:", data);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
  function clear() {
    setData({
      productname: "",
      category: "",
      sku: "",
      price: "",
      stockqty: "",
      unit: "",
      expdate: "",
      suppliername: "",
      description: "",
    });
  }
  function editItem(index) {
    let itemEdit = items[index];
    setData(itemEdit);
    seteditindex(index);
  }
  return (
    <div className="bg-blue-100 p-4">
      <Link href={"/grocery"} className="flex float-end font-semibold hover:text-blue-700 ">
        Go to grocery
      </Link>

      <h1 className="text-center text-3xl font-bold p-2 rounded-lg">
        Product Screen
      </h1>
      <div className="bg-violet-200 p-8 flex space-x-2 ">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="productname">Name</Label>
          <Input
            type="text"
            id="name"
            name="productname"
            placeholder="Name"
            value={data.productname}
            onChange={handleChange}
            className="border-2 rounded-md "
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input
            type="text"
            value={data.category}
            name="category"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="Category"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="sku">SKU </Label>
          <Input
            type="text"
            value={data.sku}
            name="sku"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="SKU"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="price">Price</Label>
          <Input
            type="text"
            value={data.price}
            name="price"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="Price"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="stockqty">Stock-Qty</Label>
          <Input
            type="text"
            value={data.stockqty}
            name="stockqty"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="Stock Qty"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Input
            type="text"
            value={data.unit}
            name="unit"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="Unit"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="expdate">Exp-Date</Label>
          <Input
            type="date"
            value={data.expdate}
            name="expdate"
            onChange={handleChange}
            className="border-2 rounded-md  w-full  "
            placeholder="Exp Date"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="suppliername">Supplier-Name</Label>
          <Input
            type="text"
            value={data.suppliername}
            name="suppliername"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="Supplier Name"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            value={data.description}
            name="description"
            onChange={handleChange}
            className="border-2 rounded-md "
            placeholder="Description"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-5 text-2xl  p-6 ">
        <Button
          onClick={save}
          className=" text-white bg-green-500 hover:bg-green-700 hover:text-black"
        >
          Save
        </Button>
        <Button
          onClick={clear}
          className=" text-white bg-yellow-300 hover:bg-yellow-500 hover:text-black"
        >
          Clear
        </Button>
      </div>

      <div>
        <Table className="">
          <TableCaption>List of products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sku</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock-Qty</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Exp-Date</TableHead>
              <TableHead>Supplier-Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productname}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.stockqty}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.expdate}</TableCell>
                <TableCell>{item.suppliername}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteItem(item.id)}
                    className="border-2 border-black  text-white bg-red-700 hover:bg-red-800 hover:text-black"
                  >
                    Delete
                  </Button>{" "}
                  <Button
                    onClick={() => editItem(index)}
                    className=" border-black  text-white bg-blue-500 hover:bg-blue-700 hover:text-black"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
