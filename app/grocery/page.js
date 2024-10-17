"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Grocery = () => {
  const [products, setproduct] = useState(null);
  const [data, setData] = useState({
    productname: "",
    category: "",
    qty: "",
    price: "",
    unit: "",
    amount: "",
  });
  const [inpValue, setInpValue] = useState("");
  const [sug, setSug] = useState([]);
  const [item, setItem] = useState([]);
  const [editIndex, seteditindex] = useState(null);
  const [tot, setTot] = useState(item.amount);
  console.log(products);

  const fetchData = async () => {
    try {
      const response = await fetch("./api/productdata");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Try to parse the response as JSON
      setproduct(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  function amtCal() {
    let qty = data.qty;
    let price = data.price;
    return qty * price;
  }

  function handleChange(e) {
    let { name, value } = e.target;
    let updatedata = { ...data, [name]: value };

    if (name === "qty" || name === "price") {
      updatedata.amount = updatedata.qty * updatedata.price;
    }

    setData(updatedata);
  }

  function save(e) {
    e.preventDefault();
    let updatedata = { ...data, amount: amtCal() };
    const duplicate = item.some(
      (existingItem) => existingItem.productname === updatedata.productname
    );
    if (duplicate) {
      // Handle duplicate if necessary, e.g., show a message
     
    }
    if (editIndex !== null) {
      let upItem = [...item];
      upItem[editIndex] = updatedata;
      setItem(upItem);
      seteditindex(null);
    } else {
      setItem([...item, updatedata]);
      setSug([]);
      setData({
        productname: "",
        category: "",
        qty: "",
        price: "",
        unit: "",
        amount: "",
      });
      setInpValue("");
    }
  }


  function deleteItem(index) {
    let delItem = item.filter((_, i) => i !== index);
    setItem(delItem);
  }

  // function inpChange(e){
  //     let value = e.target.value
  //    setInpValue(value)
  //    const f=products.map((r)=>r.productname)
  //    console.log("HH",f)
  //     if (value.length > 0) {
  //       let filt = products.filter(product =>
  //         product.productname.toLowerCase().includes(value.toLowerCase())
  //       )
  //       console.log(filt)
  //       setSug(filt)
  //       setData({ ...data, [e.target.name]: e.target.value })
  //     } else {
  //       setSug([])
  //     }

  // }
  function inpChange(e) {
    let value = e.target.value;
    setInpValue(value);

    // Assuming 'products' is your array of product objects from the fetched data
    const f = products.map((r) => r.productName); // Use the correct property name
    console.log("Available Products:", f); // Debugging log to see available products

    if (value.length > 0) {
      // Filter products based on user input
      let filt = products.filter(
        (product) =>
          product.productname.toLowerCase().includes(value.toLowerCase()) // Correct property name
      );
      console.log("Filtered Suggestions:", filt); // Log the filtered results
      setSug(filt);
    } else {
      setSug([]); // Clear suggestions if input is empty
    }

    // Update the data state with the current input value
    setData({ ...data, [e.target.name]: value }); // Make sure to update the right field
  }

  function autofill(product) {
    setData({
      productname: product.productname,
      category: product.category,
      price: product.price,
      unit: product.unit,
      qty: data.qty,
      amount: data.amount,
    });
    setInpValue(product.productname);
    setSug([])
  }

  function editBillItems(index) {
    let editItem = item[index];
    setData(editItem);
    seteditindex(index);
    setInpValue(editItem.productName);
  }

  const calculateTotalAmount = () => {
    return item.reduce(
      (total, currentItem) => total + Number(currentItem.amount),
      0
    );
  };

  return (
    <div className="bg-orange-100 pt-20">
      <header className="">
        <div className="flex justify-between fixed top-0 right-0 left-0 h-20 bg-orange-200">
          <Link
            href={"/product"}
            className="p-2 pt-6 font-semibold hover:text-orange-300 "
          >
            Go to product
          </Link>
          <h1 className="text-center text-3xl font-semibold p-5">Grocery</h1>
          <div className="flex justify-end p-5">
            <div className="w-44 h-12 bg-red-300 text-center pt-2 font-semibold text-2xl rounded-sm">
              TOTAL: <span className="font-bold">{calculateTotalAmount()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className=" border border-gray-400 rounded-lg shadow-sm shadow-slate-400 p-6 bg-gray-100">
        <form onSubmit={save} className="flex justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="font-semibold">
              Address:
            </Label>
            <Input
              type="text"
              name="address"
            
              
              placeholder="Address"
              className="w-80"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold" htmlFor="email">
              Email:
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold" htmlFor="phoneno">
              Phone No:
            </Label>
            <Input
              type="text"
              name="phoneno"
              placeholder="Phone number"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Home Delivery</h3>
            <RadioGroup
            
            >
              <div className="flex items-center space-x-6 py-2">
                <div className="flex items-center">
                  <RadioGroupItem value="yes" id="home-delivery-yes" />
                  <Label htmlFor="home-delivery-yes" className="px-2">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="no" id="home-delivery-no" />
                  <Label htmlFor="home-delivery-no" className="px-2">
                    No
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Payment Method</h3>
            <RadioGroup
            
            >
              <div className="flex items-center space-x-3 py-2">
                <div className="flex items-center">
                  <RadioGroupItem value="cash" id="payment-cash" />
                  <Label htmlFor="payment-cash" className="px-2">
                    Cash
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card" className="px-2">
                    Card
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </form>
      </div>

      <div className="relative ">
        <div className="p-4 shadow-lg shadow-orange-200 rounded-sm ">
          <h1 className="text-3xl font-semibold p-3 text-center bg-orange-200 rounded-md">
            Billed Items
          </h1>
          <div className="p-3 flex justify-around gap-4 ">
            {/* Product Name Input with Suggestions */}
            <div className="relative  text-center space-y-2">
              <Label htmlFor="productname" className="font-semibold ">
                Product Name
              </Label>
              <Input
                type="text"
                value={data.productname}
                name="productname"
                onChange={inpChange}
                className="w-full"
                autoComplete="off"
              />
              {sug.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto w-full">
                  {sug.map((product, index) => (
                    <li
                      key={index}
                      onClick={() => autofill(product)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {product.productname}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Category Select */}
            <div className=" text-center space-y-2">
              <Label htmlFor="category" className="font-semibold text-center">
                Category
              </Label>
              <Select
                name="category"
                value={data.category}
                onValueChange={(value) =>
                  setData({ ...data, category: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essentials">Essentials</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="PersonalCare">Personal Care</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Poultry">Poultry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Input */}
            <div className=" text-center space-y-2">
              <Label htmlFor="qty" className="font-semibold text-center">
                Quantity
              </Label>
              <Input
                type="number"
                value={data.qty}
                name="qty"
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* Price Input */}
            <div className=" text-center space-y-2">
              <Label htmlFor="price" className="font-semibold text-center">
                Price
              </Label>
              <Input
                type="number"
                value={data.price}
                name="price"
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* Unit Select */}
            <div className=" text-center space-y-2">
              <Label htmlFor="unit" className="font-semibold text-center">
                Unit
              </Label>
              <Select
                name="unit"
                value={data.unit}
                onValueChange={(value) =>
                  setData({ ...data, unit: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kg">KG</SelectItem>
                  <SelectItem value="Piece">Piece</SelectItem>
                  <SelectItem value="Litre">Litre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input (Read-Only) */}
            <div className=" text-center space-y-2">
              <Label htmlFor="amount" className="font-semibold text-center">
                Amount
              </Label>
              <Input
                type="number"
                value={data.amount}
                name="amount"
                readOnly
                className=""
              />
            </div>

            {/* Save Button */}
            <div className=" text-center pt-1">
              <Button
                onClick={save}
                type="button"
                className="text-white bg-sky-400 hover:bg-sky-600 hover:text-black mt-7"
              >
                      save   
              </Button>
            </div>
          </div>

          {/* Billed Items Table */}
          <div className="h-[365px] mt-6 relative overflow-auto text-center">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold ">Product Name</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold text-center">Quantity</TableHead>
                  <TableHead className="font-bold text-end">Price</TableHead>
                  <TableHead className="font-bold text-center">Unit</TableHead>
                  <TableHead className="font-bold text-end">Amount</TableHead>
                  <TableHead className="font-bold text-end">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.map((billItem, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-start">{billItem.productname}</TableCell>
                    <TableCell className="text-start">{billItem.category}</TableCell>
                    <TableCell className="text-center">{billItem.qty}</TableCell>
                    <TableCell className="text-end">{billItem.price}</TableCell>
                    <TableCell className="text-center">{billItem.unit}</TableCell>
                    <TableCell className="text-end">{billItem.amount}</TableCell>
                    <TableCell className="text-end space-x-2">
                      <Button
                        onClick={() => deleteItem(index)}
                        className="text-white bg-red-400 hover:bg-red-700 hover:text-black"
                      >
                        {/* Delete Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                      <Button
                        onClick={() => editBillItems(index)}
                        className="text-white bg-purple-400 hover:bg-purple-500 hover:text-black"
                      >
                        {/* Edit Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grocery;
