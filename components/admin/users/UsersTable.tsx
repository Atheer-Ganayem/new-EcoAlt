"use client";

import { UserDoc } from "@/types/mongoModels";
import {
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye } from "lucide-react";
import Link from "next/link";

interface Props {
  users: UserDoc[];
}

const UsersTable: React.FC<Props> = ({ users }) => {
  return (
    <Table isStriped aria-label="Example static collection table" selectionMode="single">
      <TableHeader>
        <TableColumn className="text-center">Name</TableColumn>
        <TableColumn className="text-center">Email</TableColumn>
        <TableColumn className="text-center">User Type</TableColumn>
        <TableColumn className="text-center">Options</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user._id.toString()}>
            <TableCell>
              <span className="flex items-center gap-3 justify-center">
                <Avatar src={process.env.AWS + user.avatar} size="md" /> {user.name}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span>{user.email}</span>
            </TableCell>
            <TableCell className="text-center">
              <Chip color={user.isAdmin ? "danger" : "primary"} variant="flat">
                {user.isAdmin ? "Admin" : "User"}
              </Chip>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Link href={`/users/${user._id}`}>
                  <Eye className="text-warning cursor-pointer" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
