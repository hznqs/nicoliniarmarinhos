"use client"

interface SortSelectProps {
  value: string
  options: { value: string; label: string }[]
  baseUrl: string
}

/**
 * Componente client para o dropdown de ordenação.
 * Navega via window.location mantendo todos os outros
 * query params intactos através da URL já construída pelo servidor.
 */
export function SortSelect({ value, options, baseUrl }: SortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.delete("page") // Ao mudar ordenação, volta para página 1
    if (e.target.value !== options[0].value) {
      url.searchParams.set("sort", e.target.value)
    } else {
      url.searchParams.delete("sort")
    }
    window.location.href = url.toString()
  }

  return (
    <select
      id="sort-select"
      defaultValue={value}
      onChange={handleChange}
      className="font-sans text-sm text-on-surface bg-surface border border-outline-variant rounded-md px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
