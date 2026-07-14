export const formatCPFOrCNPJ = (value: string) => {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14)
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18) // max length 14 digits + 4 format chars
}

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14) // (XX) XXXX-XXXX
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15) // (XX) XXXXX-XXXX
}

export const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, "")
  return digits.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9)
}

export const formatCurrencyInput = (value: string) => {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  
  // Convert to decimal
  const amount = parseInt(digits, 10) / 100
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}

export const parseCurrencyToNumber = (value: string) => {
  if (!value) return 0
  const digits = value.replace(/\D/g, "")
  return parseInt(digits, 10) / 100
}
