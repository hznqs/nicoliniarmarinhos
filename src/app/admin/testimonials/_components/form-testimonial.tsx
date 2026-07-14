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
import { Switch } from "@/components/ui/switch"
import { createTestimonial, updateTestimonial } from "@/server/actions/testimonial"
import { uploadImage } from "@/server/actions/upload"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  role: z.string().optional(),
  content: z.string().min(10, "Depoimento muito curto"),
  rating: z.coerce.number().min(1).max(5),
  avatarUrl: z.string().optional(),
  isApproved: z.boolean().default(false),
})

export type TestimonialFormValues = z.infer<typeof formSchema>

interface TestimonialFormProps {
  initialData?: any | null
  onSuccess?: () => void
}

export function TestimonialForm({ initialData, onSuccess }: TestimonialFormProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)

  const defaultValues: Partial<TestimonialFormValues> = initialData
    ? {
        ...initialData,
        role: initialData.role || undefined,
        avatarUrl: initialData.avatarUrl || undefined,
      }
    : {
        name: "",
        role: "",
        content: "",
        rating: 5,
        avatarUrl: "",
        isApproved: true,
      }

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  function onSubmit(data: TestimonialFormValues) {
    startTransition(async () => {
      let finalAvatarUrl = data.avatarUrl

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        
        const uploadResult = await uploadImage(formData)
        if (uploadResult.success && uploadResult.url) {
          finalAvatarUrl = uploadResult.url
        } else {
          toast.error("Erro no upload do Avatar: " + uploadResult.error)
          return
        }
      }

      const payload = { ...data, avatarUrl: finalAvatarUrl }

      let result
      if (initialData) {
        result = await updateTestimonial(initialData.id, payload)
      } else {
        result = await createTestimonial(payload)
      }

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(initialData ? "Depoimento atualizado com sucesso!" : "Depoimento criado com sucesso!")
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Maria Antonieta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo/Profissão (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Estilista, Artesã..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avaliação (1 a 5)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Foto (Avatar) (Opcional)</FormLabel>
            <FormControl>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files?.[0]
                  if (selected) {
                    setFile(selected)
                  }
                }} 
              />
            </FormControl>
            {initialData?.avatarUrl && !file && (
              <FormDescription>Avatar atual: {initialData.avatarUrl}</FormDescription>
            )}
            <FormDescription>Escolha uma imagem do seu computador. Recomendado: Formato quadrado, 200x200 (Desktop e Mobile).</FormDescription>
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depoimento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Excelente qualidade dos fios..." 
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
          name="isApproved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aprovado para exibição</FormLabel>
                <FormDescription>
                  Se desativado, o depoimento não aparecerá no site.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : (initialData ? "Atualizar Depoimento" : "Criar Depoimento")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
