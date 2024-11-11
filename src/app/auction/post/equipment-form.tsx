'use client'

import React, { useState } from 'react';
import { DatePickerDemo } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createUploadUrlAction, postAuctionAction } from './actions';


const equipmentTypes = [
    'General',
    'Earthmoving',
    'Material Handling',
    'Compaction',
    'Road Construction',
    'Concrete Equipment',
];

const specsByType: { [key: string]: string[] } = {
    General: ['Engine Power', 'Weight', 'Dimensions'],
    Earthmoving: ['Digging Depth', 'Bucket Capacity', 'Dump Height', 'Reach'],
    'Material Handling': ['Lift Capacity', 'Lift Height', 'Mast Type'],
    Compaction: ['Operating Weight', 'Vibration Frequency', 'Plate Size'],
    'Road Construction': ['Paving Width', 'Hopper Capacity', 'Engine Speed'],
    'Concrete Equipment': ['Drum Capacity', 'Mixing Speed', 'Pump Capacity'],
};

interface FormData {
    name: string;
    startingPrice: number;
    currentBid: number;
    location: string;
    model: string;
    description: string;
    file: FileList,
    endDate: string;
    equipmentType: string;
    specs: { [key: string]: string };
  }
  
  
  
const EquipmentForm = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
    const [selectedType, setSelectedType] = useState('');
    const [date, setDate] = useState<Date | undefined>()

    
    const onHandleSelectedEquipment = (value: string) => {
        setValue('equipmentType', value);
        setSelectedType(value)
    }


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const file = data.file[0];
        const uploadUrl = await createUploadUrlAction(file.name, file.type);
        await fetch( uploadUrl, {
            method:"PUT",
            headers: {
                "Content-Type": file.type
            },
            body: file
        });
        await postAuctionAction({
            name: data.name,
            type: data.equipmentType,
            startingPrice: data.startingPrice,
            location: data.location,
            model: data.model,
            description: data.description,
            fileName: file.name,
            endDate: date,
            specs: JSON.stringify(data.specs),
        });
      };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col border p-8 rounded-xl space-y-4 w-5/12">
          <div>
            <label>Type of Equipment</label>
            <Select {...register('equipmentType', { required: true })} onValueChange={(value) => onHandleSelectedEquipment(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                  {equipmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                          {type}
                      </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.equipmentType && <span className="text-red-500">This field is required</span>}
          </div>
          <div>
            <label>Item Name</label>
            <Input {...register('name', { required: false })} placeholder="Enter Item Name"/>
            {errors.name && <span className="text-red-500">Item Name is required</span>}
          </div>
    
          <div>
            <label>Bid Price</label>
            <Input type="number" {...register('startingPrice', { required: false })} placeholder="Enter Bid Price" />
            {errors.startingPrice && <span className="text-red-500">Bid Price is required</span>}
          </div>
    
          <div>
            <label>Location</label>
            <Input {...register('location', { required: false })} placeholder="Enter Location" />
            {errors.location && <span className="text-red-500">Location is required</span>}
          </div>
    
          <div>
            <label>Model</label>
            <Input {...register('model', { required: false })} placeholder="Enter Model" />
            {errors.model && <span className="text-red-500">Model is required</span>}
          </div>
    
          <div>
            <label>Description</label>
            <Textarea {...register('description', { required: false })} placeholder="Enter Description" />
            {errors.description && <span className="text-red-500">Description is required</span>}
          </div>
    
          <div className='flex flex-col'>
            <label>Date to End Auction</label>
            <DatePickerDemo
              date={date}
              setDate={setDate} {...register('endDate', { required: false })} />
            {errors.endDate && <span className="text-red-500">Date to end auction is required</span>}
          </div>

          <Input type='file' {...register('file', {required: true})} name="file" accept="image/*"/>
    
          {selectedType && (
            <div>
              {specsByType[selectedType]?.map((spec) => (
                <div key={spec}>
                  <label>{spec}</label>
                  <Input {...register(`specs.${spec}`, { required: false })} placeholder={`Enter ${spec}`} />
                  {errors.specs && errors.specs[spec] && <span className="text-red-500">{spec} is required</span>}
                </div>
              ))}
            </div>
          )}
  
        <Button type="submit">Submit</Button>
      </form>
      );
    }
    
    export default EquipmentForm