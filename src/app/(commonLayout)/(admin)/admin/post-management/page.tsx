/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React,{ useEffect, useState } from 'react';
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
  Pagination,
  Selection,
  SortDescriptor
} from "@nextui-org/react";
import { useGetAllPostQuery } from '@/redux/features/post/postApi';
import { categoryOptions } from '@/components/post/constant';
import { SearchIcon } from '@/components/table/SearchIcon';
import { ChevronDownIcon } from '@/components/table/ChevronDownIcon';
import { capitalize } from '@/components/table/utils';
import { PlusIcon } from '@/components/table/PlusIcon';
import { VerticalDotsIcon } from '@/components/table/VerticalDotsIcon';
import Author from '@/components/shared/Author';
import { IPost } from '@/type';


const columns = [
  {name: "AUTHOR", uid: "name", sortable: true},
  {name: "EMAIL", uid: "email", sortable: true},
  {name: "TITLE", uid: "title", sortable: true},
  {name: "CATEGORY", uid: "category", sortable: true},
  {name: "RREMIUM", uid: "isPremium", sortable: true},
  {name: "UPVOTES", uid: "upvotes", sortable: true},
  {name: "DOWNVOTES", uid: "downvotes", sortable: true},
  {name: "COMMENTS", uid: "comments", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

  // const roleOptions = [
  //   {name: "Admin", uid: "admin"},
  //   {name: "User", uid: "user"},
    
  // ]



  const INITIAL_VISIBLE_COLUMNS = ["name", "category", "upvotes", "downvotes", "comments", "isPremium", "role", "actions"];


const PostManagement: React.FC = () => {
  const { data: allPosts, refetch } = useGetAllPostQuery({isPremium:true});
  const [posts, setPosts] = useState<IPost[]>(allPosts?.data || []);

  useEffect(() => {
    if (allPosts?.data) {
      setPosts(allPosts.data);
    }
  }, [allPosts?.data, refetch]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [categoryFilter, setCategoryFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "upvotes",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(posts.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...posts];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user?.author?.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (categoryFilter !== "all" && Array.from(categoryFilter).length !== categoryOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(categoryFilter).includes(user?.category),
      );
    }

    return filteredUsers;
  }, [posts, filterValue, categoryFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IPost, b: IPost) => {
      // Extract the values based on the sort descriptor
      const firstValue = a[sortDescriptor.column as keyof IPost];
      const secondValue = b[sortDescriptor.column as keyof IPost];
  
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

  const renderCell = React.useCallback((post: IPost, columnKey: React.Key) => {
    const cellValue = post[columnKey as keyof IPost];

  
    switch (columnKey) {
      case "name":
        // Render the 'author' object with name and email
        return  <Author author={post?.author} />
      case "email":
        // Safely render the title
        return <p className="text-bold">{post?.author?.email}</p>;
      case "title":
        // Safely render the title
        return <p className="text-bold">{cellValue as string}</p>;
  
      case "category":
        // Safely render the category
        return <p className="text-muted">{cellValue as string}</p>;
  
      case "isPremium":
        // Safely render the premium status as 'Premium' or 'Standard'
        return <p>{(cellValue as boolean) && <span className=' border rounded-md px-2 py-0 text-blue-400'>{'Premium'}</span>}</p>;
  
      case "upvotes":
        return <p> {post?.upvotes?.length} </p>
      case "downvotes":
        return <p> {post?.downvotes?.length} </p>
      case "comments":
        return <p> {post?.comments?.length} </p>
        // Render counts, defaulting to 0 if undefined
        // return <p>{cellValue !== undefined ? cellValue as number : 0}</p>;
  
      case "actions":
        // Render action buttons (e.g., View, Edit, Delete)
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
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
  
      default:
        // Handle fallback cases for other fields
        if (typeof cellValue === "object" && cellValue !== null) {
          // If it's an object, render a JSON representation or custom handling
          return <p>{JSON.stringify(cellValue)}</p>;
        } else {
          // Render any other value, or 'N/A' if undefined
          return <p>{cellValue !== undefined ? cellValue : 'N/A'}</p>;
        }
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
                  Category
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={categoryFilter}
                selectionMode="multiple"
                onSelectionChange={setCategoryFilter}
              >
                {categoryOptions.map((category) => (
                  <DropdownItem key={category} className="capitalize">
                    {capitalize(category)}
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
          <span className="text-default-400 text-small">Total {posts.length} posts</span>
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
    categoryFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    posts.length,
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

export default PostManagement;
