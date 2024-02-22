interface PaginationHandlerProps {
  page: number;
  onChange: (page: number) => void;
  totalPages: number;
}
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { Button } from "./ui/button";

const PaginationHandler: React.FC<PaginationHandlerProps> = ({
  page,
  onChange,
  totalPages,
}) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={"ghost"}
          onClick={() => onChange(page - 1)}
          className="flex font-semibold items-center gap-1"
          disabled={page === 1}
        >
          <FaAngleDoubleLeft />
          Previous
        </Button>
        {page > 1 && (
          <Button onClick={() => onChange(page - 1)} variant={"ghost"}>
            {page - 1}
          </Button>
        )}
        <Button variant={"outline"}>{page}</Button>
        {page < totalPages && (
          <Button onClick={() => onChange(page + 1)} variant={"ghost"}>
            {page + 1}
          </Button>
        )}
        <Button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          variant={"ghost"}
          className="flex font-semibold items-center gap-1"
        >
          Next
          <FaAngleDoubleRight />
        </Button>
      </div>
    </>
  );
};
export default PaginationHandler;
