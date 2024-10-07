import moment from "moment";

export default {
  convertDateTime(date, time) {
    return moment(`${date} ${time}`).format("DD MMMM YYYY HH:mm");
  },
  paginationIt(index, pagination) {
    return (pagination.currentPage - 1) * pagination.perPage + index + 1;
  },
  rupiah(price) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },
};
