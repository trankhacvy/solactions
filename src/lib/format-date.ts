import dayjs from "dayjs";

type Options = { smart: boolean };

export const formatDate = (date: Date, options?: Options) => {
  const dateToFormat = dayjs(date);

  if (options?.smart === true)
    return dateToFormat.isToday()
      ? dateToFormat.format("HH:mm")
      : dateToFormat.format("DD/MM/YYYY");

  return dateToFormat.fromNow();
};

export const formatDateByPattern = (
  date: Date,
  pattern: "DD/MM/YYYY" | "hh:mm:A DD MMM YYYY" = "DD/MM/YYYY",
) => {
  const dateToFormat = dayjs(date);

  return dateToFormat.format(pattern);
};
