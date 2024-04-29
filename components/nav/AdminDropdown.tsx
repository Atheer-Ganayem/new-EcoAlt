"use client";

import {
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import { Activity, ChevronDown, Package, ShoppingBasket, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminDropdown = () => {
  const router = useRouter();

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-md"
            endContent={<ChevronDown />}
          >
            Admin
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="ACME features"
        itemClasses={{
          base: "gap-4",
        }}
      >
        <DropdownItem
          key="autoscaling"
          startContent={<Activity className="text-primary" />}
          onClick={() => router.push("/admin/overview")}
        >
          Overview
        </DropdownItem>
        <DropdownItem
          key="autoscaling"
          startContent={<ShoppingBasket className="text-success" />}
          onClick={() => router.push("/admin/products")}
        >
          Products
        </DropdownItem>
        <DropdownItem
          key="autoscaling"
          startContent={<Users className="text-secondary" />}
          onClick={() => router.push("/admin/users")}
        >
          Users
        </DropdownItem>
        <DropdownItem
          key="autoscaling"
          startContent={<Package className="text-warning" />}
          onClick={() => router.push("/admin/orders")}
        >
          Orders
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AdminDropdown;
