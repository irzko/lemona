import { findChildCategories } from "@/lib/findChildCategories";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Category } from "@prisma/client";
import { useCallback } from "react";

const SelectCategoryModal = ({
  categories,
  selectedCategoryIds,
  setSelectedCategoryIds,
}: {
  categories: Category[];

  selectedCategoryIds: string[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChangeCategories = useCallback(
    (categoryId: string, index: number) => {
      if (index === 0) {
        setSelectedCategoryIds([categoryId]);
        return;
      } else if (index === selectedCategoryIds.length) {
        setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
        return;
      } else if (index < selectedCategoryIds.length - 1) {
        const newSelectedCategoryIds = selectedCategoryIds.slice(0, index + 1);
        setSelectedCategoryIds(
          newSelectedCategoryIds.map((id, i) => {
            if (i === index) {
              return categoryId;
            }
            return id;
          })
        );
      }
    },
    [selectedCategoryIds, setSelectedCategoryIds]
  );
  return (
    <>
      <Button
        variant="bordered"
        fullWidth
        className="justify-start"
        onPress={onOpen}
      >
        {selectedCategoryIds.length > 0
          ? categories.find(
              (category) =>
                category.id ===
                selectedCategoryIds[selectedCategoryIds.length - 1]
            )?.name
          : "Chọn danh mục"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Danh mục
              </ModalHeader>
              <ModalBody>
                <Select
                  defaultSelectedKeys={[selectedCategoryIds[0]]}
                  labelPlacement="outside"
                  placeholder="Chọn danh mục"
                  aria-label="Chọn danh mục"
                  onChange={(e) => {
                    handleChangeCategories(e.target.value, 0);
                  }}
                >
                  {findChildCategories(categories, null).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
                {selectedCategoryIds.length > 0 &&
                  selectedCategoryIds.map((selectedCategory, index) => {
                    const childCategories = findChildCategories(
                      categories,
                      selectedCategory
                    );
                    if (childCategories.length === 0) return null;
                    return (
                      <Select
                        defaultSelectedKeys={[selectedCategoryIds[index + 1]]}
                        placeholder="Chọn danh mục phụ"
                        aria-label="Chọn danh mục phụ"
                        key={`child-${selectedCategoryIds[index]}`}
                        onChange={(e) => {
                          handleChangeCategories(e.target.value, index + 1);
                        }}
                      >
                        {childCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  })}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelectCategoryModal;
