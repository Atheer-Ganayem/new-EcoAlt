"use client";

import { countryList } from "@/utils/conutries";
import { Input, Select, SelectItem } from "@nextui-org/react";

const AddressForm = () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <Select label="country" placeholder="Select a country" className="max-w-96" name="country">
        {countryList.map(country => (
          <SelectItem key={country} value={country}>
            {country}
          </SelectItem>
        ))}
      </Select>
      <Input
        name="city"
        label="City"
        placeholder="Enter your city name"
        variant="bordered"
        className="max-w-96"
      />
      <Input
        name="street"
        label="Street"
        placeholder="Enter your street address"
        variant="bordered"
        className="max-w-96"
      />
      <Input
        name="phone"
        label="Phone Number"
        placeholder="Enter your phone number"
        variant="bordered"
        type="number"
        className="max-w-96"
      />
    </div>
  );
};

export default AddressForm;
