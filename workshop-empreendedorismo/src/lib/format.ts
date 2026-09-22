// Datas sempre no fuso de Brasília, igual no servidor e no navegador.
const TZ = "America/Sao_Paulo";

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: TZ,
});

const dateLong = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TZ,
});

export function formatDateTime(value: string | Date) {
  return dateTime.format(new Date(value));
}

export function formatDateLong(value: string | Date) {
  return dateLong.format(new Date(value));
}
