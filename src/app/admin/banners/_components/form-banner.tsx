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
import { createBanner, updateBanner } from "@/server/actions/banner"
import { uploadImage } from "@/server/actions/upload"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "A imagem é obrigatória"),
  linkUrl: z.string().optional(),
  order: z.coerce.number().int(),
  isActive: z.boolean().default(true),
})

export type BannerFormValues = z.infer<typeof formSchema>

interface BannerFormProps {
  initialData?: any | null
  onSuccess?: () => void
}

export function BannerForm({ initialData, onSuccess }: BannerFormProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)

  const defaultValues: Partial<BannerFormValues> = initialData
    ? {
        ...initialData,
        title: initialData.title || undefined,
        subtitle: initialData.subtitle || undefined,
        linkUrl: initialData.linkUrl || undefined,
      }
    : {
        title: "",
        subtitle: "",
        imageUrl: "", // Starts empty, will be filled by upload
        linkUrl: "",
        order: 0,
        isActive: true,
      }

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  function onSubmit(data: BannerFormValues) {
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
      } else if (!initialData && !finalImageUrl) {
        toast.error("Por favor, selecione uma imagem.")
        return
      }

      const payload = { ...data, imageUrl: finalImageUrl }

      let result
      if (initialData) {
        result = await updateBanner(initialData.id, payload)
      } else {
        result = await createBanner(payload)
      }

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(initialData ? "Banner atualizado com sucesso!" : "Banner criado com sucesso!")
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <FormItem>
          <FormLabel>Imagem do Banner</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const selected = e.target.files?.[0]
                if (selected) {
                  setFile(selected)
                  form.setValue("imageUrl", selected.name) // just to pass validation
                }
              }} 
            />
          </FormControl>
          {initialData?.imageUrl && !file && (
            <FormDescription>Imagem atual: {initialData.imageUrl}</FormDescription>
          )}
          <FormDescription>Escolha uma imagem do seu computador. Tamanho recomendado: 1920x600 (Desktop) ou 800x600 (Mobile).</FormDescription>
        </FormItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Oferta de Verão" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Descontos de até 50%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link de Destino (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="/produtos/oferta" {...field} />
                </FormControl>
                <FormDescription>Para onde o usuário vai ao clicar.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordem de Exibição</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Menores números aparecem primeiro.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : (initialData ? "Atualizar Banner" : "Criar Banner")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
