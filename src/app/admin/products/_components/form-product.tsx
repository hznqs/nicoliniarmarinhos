"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { useTransition, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/server/actions/product"
import { uploadImage } from "@/server/actions/upload"
import { formatCurrencyInput, parseCurrencyToNumber } from "@/lib/formatters"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"

// ---------------------------------------------------------------------------
// Tipos pré-sugeridos para armarinho de artesanato
// ---------------------------------------------------------------------------
const SUGGESTED_ATTRIBUTE_TYPES = [
  "Cor",
  "Metragem",
  "Material",
  "Espessura",
  "Gramatura",
  "Composição",
  "Tamanho",
  "Acabamento",
  "Tipo de Ponto",
]

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const AttributeSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  order: z.number().int().default(0),
})

// O schema deve espelhar o schema do Server Action
const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  slug: z.string().min(2, {
    message: "O slug deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  details: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  oldPrice: z.string().optional().nullable(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Estoque deve ser maior ou igual a 0"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHandmade: z.boolean().default(false),
  imageUrl: z.string().optional().nullable(),
  attributes: z.array(AttributeSchema).default([]),
})

export type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData?: any | null
  categories: { id: string; name: string }[]
  onSuccess?: () => void
}

// ---------------------------------------------------------------------------
// Sub-componente: painel de um tipo de atributo
// ---------------------------------------------------------------------------
interface AttributeGroupProps {
  label: string
  items: { key: string; value: string; order: number }[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
}

function AttributeGroup({ label, items, onAdd, onRemove }: AttributeGroupProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd() {
    const val = inputRef.current?.value.trim()
    if (!val) return
    onAdd(val)
    if (inputRef.current) inputRef.current.value = ""
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Tags dos valores já adicionados */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {item.value}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remover ${item.value}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + botão adicionar */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder={`Adicionar ${label.toLowerCase()}...`}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[80px] h-9 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="h-9 px-3 gap-1 shrink-0"
          aria-label={`Adicionar ${label}`}
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Formulário principal
// ---------------------------------------------------------------------------
export function ProductForm({ initialData, categories, onSuccess }: ProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [customAttrKey, setCustomAttrKey] = useState("")

  // Normaliza atributos para agrupar por key (para exibição no editor)
  const normalizeInitialAttributes = (attrs: any[]) =>
    Array.isArray(attrs)
      ? attrs.map((a) => ({ key: a.key, value: a.value, order: a.order ?? 0 }))
      : []

  const defaultValues: Partial<ProductFormValues> = initialData
    ? {
        ...initialData,
        price: initialData.price
          ? formatCurrencyInput(
              String(Number(initialData.price).toFixed(2).replace(".", ""))
            )
          : "",
        oldPrice: initialData.oldPrice
          ? formatCurrencyInput(
              String(Number(initialData.oldPrice).toFixed(2).replace(".", ""))
            )
          : "",
        description: initialData.description || undefined,
        details: initialData.details || undefined,
        sku: initialData.sku || undefined,
        imageUrl: initialData.imageUrl || undefined,
        isHandmade: initialData.isHandmade ?? false,
        attributes: normalizeInitialAttributes(initialData.attributes),
      }
    : {
        name: "",
        slug: "",
        description: "",
        details: "",
        price: "",
        oldPrice: "",
        stock: 0,
        categoryId: "",
        isActive: true,
        isFeatured: false,
        isHandmade: false,
        imageUrl: "",
        attributes: [],
      }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  // Agrupa os field-array por key para exibição
  function getGroupItems(key: string) {
    return fields
      .map((f, idx) => ({ ...f, _idx: idx }))
      .filter((f) => f.key === key)
  }

  // Keys que já têm pelo menos um valor registrado
  const activeKeys = Array.from(new Set(fields.map((f) => f.key)))

  // Keys sugeridas + as que o usuário já usou (sem duplicar)
  const displayedKeys = Array.from(
    new Set([...SUGGESTED_ATTRIBUTE_TYPES, ...activeKeys])
  )

  function handleAddValue(key: string, value: string) {
    const existingCount = fields.filter((f) => f.key === key).length
    append({ key, value, order: existingCount })
  }

  function handleRemoveByGroupIndex(key: string, groupIdx: number) {
    const group = fields
      .map((f, idx) => ({ ...f, _idx: idx }))
      .filter((f) => f.key === key)
    const target = group[groupIdx]
    if (target) remove(target._idx)
  }

  function handleAddCustomKey() {
    const key = customAttrKey.trim()
    if (!key || displayedKeys.includes(key)) return
    // Apenas registra o tipo — o usuário adicionará valores depois
    // Forçamos um append temporário para ativar o grupo, depois ele adiciona valores
    setCustomAttrKey("")
    // Adiciona o tipo à lista de exibição via estado local
    setExtraKeys((prev) => (prev.includes(key) ? prev : [...prev, key]))
  }

  const [extraKeys, setExtraKeys] = useState<string[]>([])
  const allKeys = Array.from(new Set([...displayedKeys, ...extraKeys]))

  function onSubmit(data: ProductFormValues) {
    startTransition(async () => {
      let finalImageUrl = data.imageUrl

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        const uploadResult = await uploadImage(formData)
        if (uploadResult.success && uploadResult.url) {
          finalImageUrl = uploadResult.url
        } else {
          toast.error("Erro no upload: " + uploadResult.error)
          return
        }
      }

      const payload = {
        ...data,
        price: parseCurrencyToNumber(data.price),
        oldPrice: data.oldPrice ? parseCurrencyToNumber(data.oldPrice) : null,
        imageUrl: finalImageUrl,
      }

      const result = initialData
        ? await updateProduct(initialData.id, payload)
        : await createProduct(payload)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(
          initialData ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!"
        )
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Imagem ─────────────────────────────────────────────────── */}
        <FormItem>
          <FormLabel>Imagem Principal (Opcional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*,.svg"
              onChange={(e) => {
                const selected = e.target.files?.[0]
                if (selected) {
                  setFile(selected)
                  form.setValue("imageUrl", selected.name)
                }
              }}
            />
          </FormControl>
          {initialData?.imageUrl && !file && (
            <FormDescription>Imagem atual inserida.</FormDescription>
          )}
          <FormDescription>
            Recomendado: 800x800 (proporção 1:1) para melhor visualização.
          </FormDescription>
        </FormItem>

        {/* ── Campos básicos ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Fio de Seda Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="ex: fio-de-seda-premium" {...field} />
                </FormControl>
                <FormDescription>Usado na URL do produto.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => field.onChange(formatCurrencyInput(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oldPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Antigo (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(formatCurrencyInput(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Aparecerá riscado.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU (Código)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: FSP-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria">
                        {field.value
                          ? categories.find((c) => c.id === field.value)?.name ||
                            field.value
                          : "Selecione uma categoria"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Descrição ──────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição completa do produto..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes Técnicos / Informações Adicionais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Material, dimensões, dicas de uso..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Esses detalhes aparecerão em uma seção separada na página do produto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Características dinâmicas ──────────────────────────────── */}
        <div className="flex flex-col gap-5 rounded-lg border border-border p-5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Características do Produto
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Adicione valores para cada característica clicando em &quot;Adicionar&quot; ou
              pressionando Enter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allKeys.map((key) => {
              const groupItems = getGroupItems(key)
              return (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {key}
                  </label>
                  <AttributeGroup
                    label={key}
                    items={groupItems.map((f) => ({
                      key: f.key,
                      value: f.value,
                      order: f.order,
                    }))}
                    onAdd={(value) => handleAddValue(key, value)}
                    onRemove={(groupIdx) => handleRemoveByGroupIndex(key, groupIdx)}
                  />
                </div>
              )
            })}
          </div>

          {/* Adicionar tipo personalizado */}
          <div className="flex gap-2 pt-3 border-t border-border">
            <Input
              placeholder="Nome da característica personalizada..."
              value={customAttrKey}
              onChange={(e) => setCustomAttrKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCustomKey()
                }
              }}
              className="flex-1 min-w-[80px] h-9 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomKey}
              className="h-9 px-3 gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Tipo
            </Button>
          </div>
        </div>

        {/* ── Classificação ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium text-foreground">Classificação do Produto</p>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Produto Ativo</FormLabel>
                  <FormDescription>
                    Produtos inativos ficam ocultos na loja pública.
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-5 w-5 accent-primary cursor-pointer"
                    id="isActive"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Destaque na Vitrine</FormLabel>
                  <FormDescription>
                    Aparecerá na página inicial e no topo das listas.
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-5 w-5 accent-primary cursor-pointer"
                    id="isFeatured"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isHandmade"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Produto Artesanal</FormLabel>
                  <FormDescription>
                    Marque se este produto é produzido pela própria Nicolini Armarinhos (bolsas, cocares, etc.).
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-5 w-5 accent-primary cursor-pointer"
                    id="isHandmade"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* ── Ações ──────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess && onSuccess()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Salvando..."
              : initialData
              ? "Atualizar Produto"
              : "Criar Produto"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
