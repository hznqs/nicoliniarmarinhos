"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTransition, useState } from "react"
import { uploadImage } from "@/server/actions/upload"

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
import { createCategory, updateCategory } from "@/server/actions/category"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "O slug deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
})

export type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData?: any | null
  parentCategories: { id: string, name: string }[]
  onSuccess?: () => void
}

export function CategoryForm({ initialData, parentCategories, onSuccess }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)

  const defaultValues: Partial<CategoryFormValues> = initialData
    ? {
        ...initialData,
        parentId: initialData.parentId || "none",
        description: initialData.description || undefined,
        imageUrl: initialData.imageUrl || undefined,
      }
    : {
        name: "",
        slug: "",
        description: "",
        parentId: "none",
        imageUrl: "",
      }

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  function onSubmit(data: CategoryFormValues) {
    startTransition(async () => {
      let finalImageUrl = data.imageUrl

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        
        const uploadResult = await uploadImage(formData)
        if (uploadResult.success && uploadResult.url) {
          finalImageUrl = uploadResult.url
        } else {
          toast.error("Erro no upload da Imagem: " + uploadResult.error)
          return
        }
      }

      const payload = { 
        ...data, 
        imageUrl: finalImageUrl,
        parentId: data.parentId
      }

      let result
      if (initialData) {
        result = await updateCategory(initialData.id, payload)
      } else {
        result = await createCategory(payload)
      }

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(initialData ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!")
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Fios" {...field} />
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
                  <Input placeholder="ex: fios" {...field} />
                </FormControl>
                <FormDescription>Usado na URL (ex: /categorias/fios).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria Pai (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhuma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {parentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Usado para criar subcategorias.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Capa da Categoria (Opcional)</FormLabel>
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
              <FormDescription>Imagem atual: {initialData.imageUrl}</FormDescription>
            )}
            <FormDescription>Escolha uma imagem do seu computador. Recomendado: 800x400 para Desktop e Mobile.</FormDescription>
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição da categoria..." 
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : (initialData ? "Atualizar Categoria" : "Criar Categoria")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
