import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { AiFillDelete } from "react-icons/ai";
import { ICategory } from "../../../types";
import { Skeleton } from "../../../components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { deleteCategory } from "../../../services/bookCategoryApis";
import { toast } from "../../../components/ui/use-toast";
import { useState } from "react";
interface ICategoriesTableProps {
  categories: ICategory[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
const BookCategoriesTable: React.FC<ICategoriesTableProps> = ({
  error,
  isLoading,
  categories,
  refetch,
}) => {
  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-red-500">
                {error.message}
              </TableCell>
            </TableRow>
          )}
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={"skeleton" + i}>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading &&
            categories.map((category) => (
              <CategoryRow
                refetch={refetch}
                key={category._id}
                category={category}
              />
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default BookCategoriesTable;

const CategoryRow: React.FC<{ category: ICategory; refetch: () => void }> = ({
  category,
  refetch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteHandler = async () => {
    setIsLoading(true);
    try {
      await deleteCategory(category._id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Failed",
        description: "Something went wrong",
      });
    } finally {
      setIsOpen(false);
      setIsLoading(false);
      refetch();
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{category.title}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant="outline">
                <BsThreeDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel asChild>
                <Link
                  to={`/dashboard/bookCategories/${category._id}`}
                  className="flex items-center gap-2"
                >
                  <CiEdit size={18} />
                  Edit
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <AiFillDelete size={18} />
                  Delete
                </button>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={isOpen}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  category and remove data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isLoading}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction disabled={isLoading} onClick={deleteHandler}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    </>
  );
};
