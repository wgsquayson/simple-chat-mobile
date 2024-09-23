import { format } from "date-fns";

export default function formatDate(dateInS: number) {
  return format(dateInS * 1000, "LL/dd - hh:mm");
}
