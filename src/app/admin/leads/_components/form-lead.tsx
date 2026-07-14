"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createLead, updateLead } from "@/server/actions/lead"
import { formatPhone } from "@/lib/formatters"
import { LeadStatus } from "@prisma/client"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
})

export type LeadFormValues = z.infer<typeof formSchema>

interface LeadFormProps {
  initialData?: any | null
  onSuccess?: () => void
}

export function LeadForm({ initialData, onSuccess }: LeadFormProps) {
  const [isPending, startTransition] = useTransition()

  const defaultValues: Partial<LeadFormValues> = initialData
    ? {
        ...initialData,
        phone: initialData.phone || undefined,
        source: initialData.source || undefined,
      }
    : {
        name: "",
        email: "",
        phone: "",
        source: "",
        status: LeadStatus.NEW,
      }

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  function onSubmit(data: LeadFormValues) {
    startTransition(async () => {
      let result
      if (initialData) {
        result = await updateLead(initialData.id, data)
      } else {
        result = await createLead(data)
      }

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(initialData ? "Lead atualizado com sucesso!" : "Lead criado com sucesso!")
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
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Maria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="maria@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (Opcional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    maxLength={15}
                    {...field} 
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NEW">Novo</SelectItem>
                    <SelectItem value="CONTACTED">Contatado</SelectItem>
                    <SelectItem value="CONVERTED">Convertido</SelectItem>
                    <SelectItem value="LOST">Perdido</SelectItem>
                  </SelectContent>
                </Select>
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
            {isPending ? "Salvando..." : (initialData ? "Atualizar Lead" : "Criar Lead")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
