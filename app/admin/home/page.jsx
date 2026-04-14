'use client'

import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import { VscArrowCircleRight } from "react-icons/vsc";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function LandingPage() {
    const profile = useProfile();
    const [addCar, setAddCar] = useState(false);
    const [image, setImage] = useState(null);
    const [carType, setCarType] = useState("");
    const supabase = createClient();
    const [allCar, setAllCar] = useState([]);
    const [actionComplete, setActionComplete] = useState(false);
    const [page, setPage] = useState(1);
    const [showDetail, setShowDetail] = useState(false);
    const [showDataDetail, setShowDataDetail] = useState(null)
    const itemPerPage = 8;
    const [editCar, setEditCar] = useState(false);
    const [editImage, setEditImage] = useState(null);
    const [editForm, setEditForm] = useState({
        brand: "",
        car_name: "",
        type: "",
        price: "",
        stock: "",
    });
    const setCar = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const filename = uuidv4();

        if (image) {
            const { data: imagedata, error: imageError } = await supabase.storage
                .from('attachment')
                .upload(filename, image);
            if (imageError) {
                console.log(imageError);
                return false;
            }
            if (imagedata) {
                const { data: { publicUrl } } = supabase.storage
                    .from('attachment')
                    .getPublicUrl(filename);
                insertCar(formData, publicUrl);
            }
        } else {
            insertCar(formData, null);
        }
    }

    async function insertCar(formData, publicUrl) {
        const { data, error } = await supabase.from('cars').insert({
            brand: formData.get("brand"),
            car_name: formData.get("name"),
            price: formData.get("price"),
            stock: formData.get("stock"),
            type: carType,
            img_url: publicUrl,
        })

        if (error) {
            console.log(error);
            return false;
        }
        console.log("insert complete", data);
        setActionComplete(true)
        setAddCar(false);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setImage(acceptedFiles[0]);
        },
        multiple: false,
        noClick: true,
    })
    const fetchCarData = async () => {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .range((page - 1) * itemPerPage, page * itemPerPage - 1)
            .eq('status', '1');
        if (error) {
            console.log(error);
            return;
        }
        console.log("data : ", data);
        console.log("length : ", data.length);
        await setAllCar(data);

    }
    const deleteCar = async (id) => {
        console.log("start change status")
        const { data, error } = await supabase
            .from('cars')
            .update({ status: '0' })
            .eq('id', id)
        if (error) {
            console.log(error)
            return;
        }
        console.log("update data : ", data);
        setActionComplete(true)
    }
    const closeDetail = () => {
        setShowDetail(false);
        setShowDataDetail(null);
        setEditCar(false);
        setEditImage(null);
    }
    const showDetailByid = (id) => {
        setShowDetail(true)
        setEditCar(false);
        // const { data, error } = await supabase
        //     .from('cars')
        //     .select('*')
        //     .eq('id', id)
        //     .eq('status', '1');
        // if (error) {
        //     console.log(error);
        //     return;
        // }
        // console.log("data : ", data);
        const data = allCar.find(item => item.id === id);
        console.log("data detail by id : ", data);
        setShowDataDetail(data);
        console.log("show data detail : ", showDataDetail)

    }
    const startEditCar = () => {
        if (!showDataDetail) return;
        setEditForm({
            brand: showDataDetail.brand ?? "",
            car_name: showDataDetail.car_name ?? "",
            type: String(showDataDetail.type ?? ""),
            price: showDataDetail.price ?? "",
            stock: showDataDetail.stock ?? "",
        });
        setEditImage(null);
        setEditCar(true);
    }
    const cancelEditCar = () => {
        setEditCar(false);
        setEditImage(null);
    }
    const updateEditField = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    }
    const updateCar = async () => {
        if (!showDataDetail?.id) return;

        let finalImgUrl = showDataDetail.img_url ?? null;

        if (editImage && (editImage instanceof File || editImage instanceof Blob)) {
            const filename = uuidv4();
            const { error: imageError } = await supabase.storage
                .from("attachment")
                .upload(filename, editImage);

            if (imageError) {
                console.log(imageError);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from("attachment")
                .getPublicUrl(filename);
            finalImgUrl = publicUrl;
        }

        const payload = {
            brand: editForm.brand,
            car_name: editForm.car_name,
            type: editForm.type,
            price: Number(editForm.price),
            stock: Number(editForm.stock),
            img_url: finalImgUrl,
        };

        const { error } = await supabase
            .from("cars")
            .update(payload)
            .eq("id", showDataDetail.id);

        if (error) {
            console.log(error);
            return;
        }

        setShowDataDetail((prev) => ({ ...prev, ...payload }));
        setAllCar((prev) => prev.map((item) => item.id === showDataDetail.id ? { ...item, ...payload } : item));
        setEditCar(false);
        setEditImage(null);
    }
    useEffect(() => {
        console.log("start fetching data")
        fetchCarData();
        console.log("all car data :  : ", allCar);
    }, [])

    useEffect(() => {
        console.log("action complete")
        fetchCarData();
        setActionComplete(false);
    }, [actionComplete, page])

    useEffect(() => {
        // console.log('carType : ', carType);
    }, [carType])

    useEffect(() => {
        setCarType("");
        setImage(null);
    }, [addCar])
    console.log("all car length : ", allCar.length)
    return (
        <div className="w-screen h-auto relative px-3 pt-3 sm:px-8 sm:pt-5 bg-blue-200/0">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-light">
                    Hi {profile?.name}
                </h1>
                <Button
                    onClick={() => setAddCar(!addCar)}
                    className="bg-green-500 hover:bg-green-600 hover:cursor-pointer transition-all duration-300 ease-in-out"
                >
                    Add Car
                </Button>
            </div>

            {/* ✅ Modal Add Car */}
            {addCar && (
                <div className="  flex justify-center items-center w-full h-full bg-gray-300/80 z-50 absolute inset-0">
                    <Card {...getRootProps()} className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/4 relative overflow-y-auto max-h-[80vh]">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Add Car</CardTitle>
                            <IoClose
                                className="text-lg hover:cursor-pointer"
                                onClick={() => setAddCar(false)}
                            />
                        </CardHeader>
                        <CardContent className="h-full">
                            <form onSubmit={setCar} className="flex flex-col gap-y-3">
                                <Label htmlFor="brand">Car brand</Label>
                                <Input name="brand" id="brand" type="text" placeholder="Enter car brand" className="w-full" />

                                <Label htmlFor="name">Car Name</Label>
                                <Input name="name" id="name" type="text" placeholder="Enter car name" className="w-full" />


                                <Label>Car Type</Label>

                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        className="w-full flex items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:cursor-pointer"
                                    >
                                        {carType == 1 ? "Sedan" : carType == 2 ? "SUV" : carType == 3 ? "Pickup" : carType == 4 ? "EV" : 'Select type...'}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setCarType("1")}>Sedan</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setCarType("2")}>SUV</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setCarType("3")}>Pickup</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setCarType("4")}>EV</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Label htmlFor="price">Car Price</Label>
                                <Input name="price" id="price" type="number" placeholder="Car Price" className="w-full" />

                                <Label htmlFor="stock">Car Stock</Label>
                                <Input name="stock" id="stock" type="number" placeholder="Car Stock" className="w-full" />

                                <Label htmlFor="image">Car Image</Label>

                                {/* Drag overlay */}
                                {isDragActive && (
                                    <div className="absolute inset-0 bg-blue-100/80 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center z-10 pointer-events-none">
                                        <p className="text-blue-600 font-semibold text-lg">วางไฟล์ที่นี่...</p>
                                    </div>
                                )}

                                <input {...getInputProps()} />
                                {image && (image instanceof File || image instanceof Blob) ? (
                                    <div className="flex flex-col gap-y-1">
                                        <img src={URL.createObjectURL(image)} alt="preview" className="rounded-md" />
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="hover:cursor-pointer"
                                            onClick={() => setImage(null)}
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                ) : (
                                    <Input
                                        onChange={(e) => setImage(e.target.files[0])}
                                        name="image" id="image" type="file"
                                        className="w-full hover:cursor-pointer"
                                    />
                                )}

                                <Button type="submit" className="hover:cursor-pointer">Add Car</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ✅ Car Grid */}
            <h1 className="text-xl font-semibold w-full text-center mt-4">All Cars</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 lg:gap-x-10 lg:gap-y-5 w-full py-3 ">
                {allCar.length !== 0 ?
                    allCar.map((item, index) => (
                        <Card onClick={() => { showDetailByid(item.id) }} key={index} className="w-full h-64 flex flex-col hover:shadow-md hover:cursor-pointer gap-y-0 pt-0">
                            <CardHeader className="h-1/4 flex items-center bg-gray-100">
                                <CardTitle className="text-lg font-bold">{item.car_name}</CardTitle>
                            </CardHeader>
                            <CardContent className="h-2/3 border-y p-0 overflow-hidden">
                                {item.img_url ? (
                                    <img className="w-full h-full object-cover" src={item.img_url} alt={item.car_name} />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <p className="text-gray-400">No Image</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="h-auto flex justify-between">
                                <p>฿{item.price?.toLocaleString()}</p>
                                <MdDeleteForever className="text-2xl hover:cursor-pointer hover:text-red-500" onClick={() => deleteCar(item.id)} />
                            </CardFooter>
                        </Card>
                    )) : <div className="col-start-2 col-end-4 text-center text-lg font-semibold align-center">no data found!</div>}

            </div>
            {showDetail &&
                <div className="flex justify-center items-center w-screen h-full 
                bg-gray-300/80 z-50 absolute inset-0 overflow-y-auto ">
                    <Card className="w-2/3 sm:w-1/3 ">
                        <CardHeader className="flex-col  items-center w-full border-b bg-amber-700/0">
                            <div className="flex justify-between items-center w-full bg-amber-100/0">
                                <CardTitle>Car Detail</CardTitle>
                                <div className="flex gap-x-2">
                                    <FaRegEdit onClick={startEditCar} className="hover:cursor-pointer text-lg" />
                                    <IoCloseSharp className="hover:cursor-pointer text-xl" onClick={closeDetail} />

                                </div>
                            </div>
                            {editCar ? (
                                <div className="w-full space-y-2">
                                    <Label htmlFor="brand">Car brand</Label>
                                    <Input
                                        value={editForm.brand}
                                        onChange={(e) => updateEditField("brand", e.target.value)}
                                        placeholder="Brand"
                                    />
                                    <Label htmlFor="name">Car Name</Label>
                                    <Input
                                        value={editForm.car_name}
                                        onChange={(e) => updateEditField("car_name", e.target.value)}
                                        placeholder="Car name"
                                    />
                                </div>
                            ) : (
                                <CardDescription>{showDataDetail?.brand} <span>{showDataDetail?.car_name}</span></CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {editCar ? (
                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="edit-image">Car Image</Label>
                                    {editImage && (editImage instanceof File || editImage instanceof Blob) ? (
                                        <img src={URL.createObjectURL(editImage)} alt="new preview" className="rounded-md" />
                                    ) : showDataDetail?.img_url ? (
                                        <img src={showDataDetail.img_url} alt="preview" className="rounded-md" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <p className="text-gray-400">No Image</p>
                                        </div>
                                    )}
                                    <Input
                                        id="edit-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditImage(e.target.files?.[0] ?? null)}
                                        className="w-full hover:cursor-pointer"
                                    />  
                                </div>
                            ) : showDataDetail?.img_url ? (
                                <img src={showDataDetail.img_url} alt="preview" className="rounded-md" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <p className="text-gray-400">No Image</p>
                                </div>
                            )}

                        </CardContent>
                        <CardFooter className="flex flex-col gap-y-2 ">
                            {editCar ? (
                                <div className="w-full flex flex-col gap-y-2">
                                    <Label htmlFor="type">Car Type</Label>
                                    <Input
                                        value={editForm.type}
                                        onChange={(e) => updateEditField("type", e.target.value)}
                                        placeholder="Type (1: Sedan, 2: SUV, 3: Pickup, 4: EV)"
                                    />
                                    <Label htmlFor="price">Car Price</Label>
                                    <Input
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e) => updateEditField("price", e.target.value)}
                                        placeholder="Price"
                                    />
                                    <Label htmlFor="stock">Car Stock</Label>
                                    <Input
                                        type="number"
                                        value={editForm.stock}
                                        onChange={(e) => updateEditField("stock", e.target.value)}
                                        placeholder="Stock"
                                    />
                                    <div className="flex w-full gap-x-2">
                                        <Button type="button" className="w-full" onClick={updateCar}>Save</Button>
                                        <Button type="button" variant="outline" className="w-full" onClick={cancelEditCar}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between w-full">
                                        <p className="bg-gray-200/80 px-1 rounded-full border border-gray-800 text-black">Type: {showDataDetail?.type == 1 ? "Sedan" : showDataDetail?.type == 2 ? "SUV" : showDataDetail?.type == 3 ? "Pickup" : showDataDetail?.type == 4 ? "EV" : 'Unknown'}</p>
                                        <p className="bg-gray-200/80 px-1 rounded-full border border-gray-800 text-black">Price: ฿{showDataDetail?.price?.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-start w-full">
                                        <p className="bg-gray-200/80 px-1 rounded-full border border-gray-800 text-black">Stock: {showDataDetail?.stock}</p>
                                    </div>
                                </>
                            )}
                        </CardFooter>
                    </Card>

                </div>
            }

            <div className="bg-amber-200/0 flex justify-center w-full py-4 items-center flex-col">
                <p>page {page}</p>
                <div className="flex gap-x-2">
                    <button disabled={page === 1}>
                        <VscArrowCircleLeft className={`text-4xl  rounded-full
                         ${page === 1 ? "hover:cursor-not-allowed text-gray-400/20" : "hover:cursor-pointer hover:bg-gray-100"}`} onClick={() => setPage(page - 1)} />
                    </button>
                    <button disabled={allCar.length < 8}>
                        <VscArrowCircleRight className={`text-4xl  rounded-full
                         ${allCar.length < 8 ? "hover:cursor-not-allowed text-gray-400/20" : "hover:cursor-pointer hover:bg-gray-100"}`} onClick={() => setPage(page + 1)} />
                    </button>

                </div>

            </div>
        </div>
    );
}