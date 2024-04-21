"use client";

import { Card, Select, SelectItem, Textarea } from "@nextui-org/react";
import StarRating from "../UI/Rating";
import SubmitBtn from "../UI/SubmitBtn";
import { useFormState } from "react-dom";
import { submitReview } from "@/utils/actions/review";
import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ReviewForm = () => {
  const productId = useParams().productId;

  const [state, formAction] = useFormState(submitReview, {
    message: "",
    error: false,
    code: 200,
  });

  return (
    <form action={formAction}>
      <Card className="p-6 w-auto max-w-96 flex flex-col gap-5">
        <input type="hidden" name="productId" value={productId} />
        <Select
          name="rating"
          label="Rating"
          placeholder="Select a rating"
          labelPlacement="outside"
          classNames={{
            trigger: "h-12",
          }}
          renderValue={(items: any[]) => {
            return items.map((num, index) => <StarRating key={index} rating={num.props.value} />);
          }}
        >
          {Array.from({ length: 5 }).map((num, index) => (
            <SelectItem key={index + 1} value={index + 1}>
              <StarRating rating={index + 1} />
            </SelectItem>
          ))}
        </Select>
        <Textarea label="Comment" placeholder="Enter your comment" name="comment" />
        {state.error && (
          <div className="p-3 bg-danger-500 rounded-xl text-white flex gap-3 flex-row">
            <AlertTriangle /> {state.message}
          </div>
        )}
        <SubmitBtn text="Submit Review" />
      </Card>
    </form>
  );
};

export default ReviewForm;
