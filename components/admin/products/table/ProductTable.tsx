"use client";

import { ProductDoc } from "@/types/mongoModels";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Eye, EyeOff, Trash } from "lucide-react";
import Link from "next/link";
import Dialog from "../add-product/Dialog";
import { swtichIsDeletedProduct } from "@/utils/actions/product";

interface Props {
  products: ProductDoc[];
}

const ProductTable: React.FC<Props> = ({ products }) => {
  return (
    <Table isStriped aria-label="Example static collection table" selectionMode="single">
      <TableHeader>
        <TableColumn className="text-center">Title</TableColumn>
        <TableColumn className="text-center">Price</TableColumn>
        <TableColumn className="text-center">Shipping Price</TableColumn>
        <TableColumn className="text-center">Quantity</TableColumn>
        <TableColumn className="text-center">Options</TableColumn>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product._id.toString()}>
            <TableCell className="text-center">
              <span className="text-center">{product.title.substring(0, 30)}...</span>
            </TableCell>
            <TableCell className="text-center">
              <span>${product.price}</span>
            </TableCell>
            <TableCell className="text-center">
              <span>${product.shippingPrice}</span>
            </TableCell>
            <TableCell
              className={`${
                product.qty <= 3
                  ? "text-danger"
                  : product.qty < 10
                  ? "text-warning"
                  : "text-success"
              } text-center`}
            >
              {product.qty}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 justify-center">
                <Dialog
                  mode="edit"
                  productId={product._id.toString()}
                  initialTitle={product.title}
                  initialDescription={product.description}
                  initialPrice={product.price}
                  initialShippingPrice={product.shippingPrice}
                  initialQty={product.qty}
                  initialFiles={product.images}
                />
                {!product.isDeleted ? (
                  <Trash
                    className="text-danger cursor-pointer"
                    onClick={async () => {
                      await swtichIsDeletedProduct({ productId: product._id });
                    }}
                  />
                ) : (
                  <EyeOff
                    className="text-success cursor-pointer"
                    onClick={async () => {
                      await swtichIsDeletedProduct({ productId: product._id });
                    }}
                  />
                )}
                {!product.isDeleted && (
                  <Link href={`/products/${product._id}`}>
                    <Eye className="text-warning cursor-pointer" />
                  </Link>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
