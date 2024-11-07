/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor
} from "@nextui-org/react";

import { useDeleteUserMutation, useGetAllUserQuery } from '@/redux/features/user/userApi';
import { VerticalDotsIcon } from '@/components/table/VerticalDotsIcon';
import { ChevronDownIcon } from '@/components/table/ChevronDownIcon';
import { PlusIcon } from '@/components/table/PlusIcon';
import { capitalize } from '@/components/table/utils';
import {SearchIcon} from '@/components/table/SearchIcon'
import Author from '@/components/shared/Author';
import { IUser } from '@/type';
import { toast } from 'sonner';


const columns = [
  {name: "AUTHOR", uid: "name", sortable: true},
  {name: "EMAIL", uid: "email", sortable: true},
  {name: "FOLLOWERS", uid: "followers", sortable: true},
  {name: "FOLLOWING", uid: "following", sortable: true},
  {name: "VERIFIED", uid: "isVerified", sortable: true},
  {name: "ROLE", uid: "role", sortable: true},
  {name: "PAYMENT STATUS", uid: "paymentStatus", sortable: true},
  {name: "TRANSACTION ID", uid: "transactionId", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

  const roleOptions = [
    {name: "Admin", uid: "admin"},
    {name: "User", uid: "user"},
    
  ]

  const roleColorMap: Record<string, ChipProps["color"]> = {
    admin: "success",
    // paused: "danger",
    user: "warning",
  };
  // const verifiedColorMap: Record<string, ChipProps["color"]> = {
  //   isVerifiled: "success",
  //   // paused: "danger",
  //   // user: "warning",
  // };
  
  const INITIAL_VISIBLE_COLUMNS = ["name", "role", "followers", "following", "isVerified", "paymentStatus", "actions"];

const UserManagementPage = () => {
  const { data: allUser, refetch } = useGetAllUserQuery('');
  const [users, setUsers] = useState<IUser[]>(allUser?.data || []);


  // Update users state when allUser data changes
  useEffect(() => {
    if (allUser?.data) {
      setUsers(allUser.data);
    }
  }, [allUser?.data, refetch]);
  const [deleteUser] = useDeleteUserMutation()
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [roleFilter, setRoleFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "followers",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(users.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (roleFilter !== "all" && Array.from(roleFilter).length !== roleOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(roleFilter).includes(user?.role),
      );
    }

    return filteredUsers;
  }, [users, filterValue, roleFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IUser, b: IUser) => {
      // Extract the values based on the sort descriptor
      const firstValue = a[sortDescriptor.column as keyof IUser];
      const secondValue = b[sortDescriptor.column as keyof IUser];
  
      // Determine comparison logic based on the type of the value
      let cmp = 0;
  
      if (Array.isArray(firstValue) && Array.isArray(secondValue)) {
        cmp = firstValue.length - secondValue.length; // Compare array lengths
      } else if (typeof firstValue === 'string' && typeof secondValue === 'string') {
        cmp = firstValue.localeCompare(secondValue); // String comparison
      } else if (typeof firstValue === 'boolean' && typeof secondValue === 'boolean') {
        cmp = Number(firstValue) - Number(secondValue); // Convert booleans to numbers for comparison
      } else if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        cmp = firstValue - secondValue; // Numeric comparison
      }
  
      // Determine sorting direction
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: IUser, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof IUser];

    switch (columnKey) {
      case "name":
        return <Author author={user}/>
      case "role":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={roleColorMap[user?.role]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
         case "followers":
        return <p> {user?.followers?.length} </p>
      case "following":
        return <p> {user?.following?.length} </p>
      case "isVerified":
        return (
          <p> {(cellValue as boolean) && <span className=' border rounded-md px-2 py-0 text-blue-400'>{'Verified'}</span>} </p>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" width={24} height={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem onClick={() => handleDeleteUser(user?._id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
              >
                {roleOptions.map((role) => (
                  <DropdownItem key={role.uid} className="capitalize">
                    {capitalize(role.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon width={24} height={24} />}
              size="sm"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    roleFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  const handleDeleteUser = async(id:string) => {
    const toastId = toast.loading("loading...")
    
  try {
    const res = await deleteUser(id).unwrap()
    if(res) {
      toast.success(res?.message, {id: toastId})
    }
  } catch (error:any) {
    toast.error(error?.data?.message, {id: toastId})
  }
  }

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No data found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item?._id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default UserManagementPage;


