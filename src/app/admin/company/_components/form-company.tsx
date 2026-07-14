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
import { uploadImage } from "@/server/actions/upload"
import { saveCompanySettings } from "@/server/actions/company"
import { formatCPFOrCNPJ, formatPhone, formatCEP } from "@/lib/formatters"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome da empresa é obrigatório"),
  document: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  aboutText: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
})

export type CompanyFormValues = z.infer<typeof formSchema>

interface CompanyFormProps {
  initialData?: any | null
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const [isPending, startTransition] = useTransition()
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)

  const defaultValues: Partial<CompanyFormValues> = initialData
    ? {
        ...initialData,
        document: initialData.document || undefined,
        email: initialData.email || undefined,
        phone: initialData.phone || undefined,
        whatsapp: initialData.whatsapp || undefined,
        address: initialData.address || undefined,
        city: initialData.city || undefined,
        state: initialData.state || undefined,
        zipCode: initialData.zipCode || undefined,
        aboutText: initialData.aboutText || undefined,
        logoUrl: initialData.logoUrl || undefined,
        faviconUrl: initialData.faviconUrl || undefined,
      }
    : {
        name: "",
        document: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        aboutText: "",
        logoUrl: "",
        faviconUrl: "",
      }

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  function onSubmit(data: CompanyFormValues) {
    startTransition(async () => {
      let finalLogoUrl = data.logoUrl
      let finalFaviconUrl = data.faviconUrl

      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)
        const uploadResult = await uploadImage(formData)
        if (uploadResult.success && uploadResult.url) {
          finalLogoUrl = uploadResult.url
        } else {
          toast.error("Erro no upload da Logo: " + uploadResult.error)
          return
        }
      }

      if (faviconFile) {
        const formData = new FormData()
        formData.append("file", faviconFile)
        const uploadResult = await uploadImage(formData)
        if (uploadResult.success && uploadResult.url) {
          finalFaviconUrl = uploadResult.url
        } else {
          toast.error("Erro no upload do Favicon: " + uploadResult.error)
          return
        }
      }

      const payload = { ...data, logoUrl: finalLogoUrl, faviconUrl: finalFaviconUrl }
      const result = await saveCompanySettings(payload)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Configurações da empresa salvas com sucesso!")
        if (!data.id && result.data?.id) {
          form.setValue("id", result.data.id)
        }
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informações Principais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Armarinho Premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ / CPF</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00.000.000/0001-00" 
                        maxLength={18}
                        {...field} 
                        onChange={(e) => field.onChange(formatCPFOrCNPJ(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Logo da Empresa</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setLogoFile(file)
                    }} 
                  />
                </FormControl>
                {initialData?.logoUrl && !logoFile && (
                  <FormDescription>Logo atual: {initialData.logoUrl}</FormDescription>
                )}
                <FormDescription>Recomendado: Fundo transparente, min. 200px de altura (Desktop e Mobile).</FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Favicon</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setFaviconFile(file)
                    }} 
                  />
                </FormControl>
                {initialData?.faviconUrl && !faviconFile && (
                  <FormDescription>Favicon atual: {initialData.faviconUrl}</FormDescription>
                )}
                <FormDescription>Recomendado: Formato quadrado (proporção 1:1), 32x32 ou 64x64.</FormDescription>
              </FormItem>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail de Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="contato@empresa.com" type="email" {...field} />
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
                    <FormLabel>Telefone Fixo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 3333-3333" 
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
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00000-000" 
                        maxLength={9}
                        {...field} 
                        onChange={(e) => field.onChange(formatCEP(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Exemplo, 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (UF)</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Sobre a Empresa</h3>
            <FormField
              control={form.control}
              name="aboutText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto "Sobre Nós"</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nossa história começou em..." 
                      className="resize-none h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Este texto será exibido na página Sobre.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
