"use client";

import {
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import { ChevronDown, Package, ShoppingBasket, Users } from "lucide-react";
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
        {/* <DropdownItem
          key="usage_metrics"
          description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
          startContent={icons.activity}
        >
          Usage Metrics
        </DropdownItem>
        <DropdownItem
          key="production_ready"
          description="ACME runs on ACME, join us and others serving requests at web scale."
          startContent={icons.flash}
        >
          Production Ready
        </DropdownItem>
        <DropdownItem
          key="99_uptime"
          description="Applications stay on the grid with high availability and high uptime guarantees."
          startContent={icons.server}
        >
          +99% Uptime
        </DropdownItem>
        <DropdownItem
          key="supreme_support"
          description="Overcome any challenge with a supporting team ready to respond."
          startContent={icons.user}
        >
          +Supreme Support
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default AdminDropdown;
