import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { VerticalDotsIcon } from "../table/VerticalDotsIcon";

interface ActionButtonProps {
    onEdit?: () => Promise<void>;
    onDelete?: () => Promise<void>;
}


const ActionButton: React.FC<ActionButtonProps> = ({onEdit, onDelete}) => {

  return (
    <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" width={24} height={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={onEdit}>Edit</DropdownItem>
                <DropdownItem onClick={onDelete}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
  )
}

export default ActionButton