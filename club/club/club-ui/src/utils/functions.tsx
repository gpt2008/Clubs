import dayjs from "dayjs";
import i18n from "../i18n/i18n";

export default {
  formatDateDayAndMonth(date: dayjs.Dayjs) {
    var today = date.format("LL");
    return today
      .replace(date.format("YYYY"), "") // remove year
      .replace(/\s\s+/g, " ") // remove double spaces, if any
      .trim() // remove spaces from the start and the end
      .replace(/[рг]\./, "") // remove year letter from RU/UK locales
      .replace(/de$/, "") // remove year prefix from PT
      .replace(/b\.$/, "") // remove year prefix from SE
      .trim() // remove spaces from the start and the end
      .replace(/,$/g, ""); // remove comma from the end
  },

  formatAmount(n: number, currency?: string) {
    const formatter = new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: currency || "EUR",
    });
    return formatter.format(n);
  },

  dateToString(date?: Date) {
    return date && date.toLocaleDateString();
  },

  getTime(mins: number) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    const time =
      (hours < 10 ? "0" : "") +
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes;
    return dayjs(time, "HH:mm");
  },

  formatPorcentage(value: number) {
    return (
      typeof value !== "undefined" &&
      value.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " %"
    );
  },

  roundFormatPorcentage(value: number) {
    return (
      typeof value !== "undefined" &&
      Math.sign(value) * Math.floor(Math.abs(value) + 0.5) + " %"
    );
  },
};
