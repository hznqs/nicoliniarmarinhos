"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTransition, useState } from "react"

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
  imageUrl: z.string().optional().nullable(),
})

export type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData?: any | null
  categories: { id: string, name: string }[]
  onSuccess?: () => void
}

export function ProductForm({ initialData, categories, onSuccess }: ProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)

  // Define os valores padrões
  const defaultValues: Partial<ProductFormValues> = initialData
    ? {
        ...initialData,
        price: initialData.price ? formatCurrencyInput(String(Number(initialData.price).toFixed(2).replace('.', ''))) : "",
        oldPrice: initialData.oldPrice ? formatCurrencyInput(String(Number(initialData.oldPrice).toFixed(2).replace('.', ''))) : "",
        description: initialData.description || undefined,
        details: initialData.details || undefined,
        sku: initialData.sku || undefined,
        imageUrl: initialData.imageUrl || undefined,
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
        imageUrl: "",
      }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  function onSubmit(data: ProductFormValues) {
    startTransition(async () => {
      let finalImageUrl = data.imageUrl

      // Se houver um arquivo novo selecionado, fazer upload
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
        imageUrl: finalImageUrl 
      }

      let result
      if (initialData) {
        result = await updateProduct(initialData.id, payload)
      } else {
        result = await createProduct(payload)
      }

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(initialData ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!")
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
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
          <FormDescription>Recomendado: 800x800 (proporção 1:1) para melhor visualização em Mobile e Desktop.</FormDescription>
        </FormItem>

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
                          ? categories.find((c) => c.id === field.value)?.name || field.value 
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
              <FormDescription>Esses detalhes aparecerão em uma seção separada na página do produto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : (initialData ? "Atualizar Produto" : "Criar Produto")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
