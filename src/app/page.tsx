'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUser } from "@/providers/user-provider"

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Preencha a senha" }),
})

export default function LoginPage() {
  const {status} = useSession();
  const {user, handleRefreshUser} = useUser();
  const [isShaking, setIsShaking] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isShaking])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonDisabled(true)

    if (form.formState.errors.email || form.formState.errors.password) {
      toast.dismiss();
      toast.error("Por favor, corrija os erros no formulário")
      setIsShaking(true)
      setButtonDisabled(false)
      return
    }

    try {
      toast.dismiss()
      toast.loading('Entrando...')
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (response?.error) {
        toast.dismiss();
        toast.error("Email ou senha inválidos")
        setIsShaking(true)
        setButtonDisabled(false);
      } else {
        handleRefreshUser();
        toast.dismiss();
        toast.success("Autenticado com sucesso!")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.dismiss();
      toast.error("Ocorreu um erro ao fazer login")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={buttonDisabled} type="submit" className="w-full">
                  {buttonDisabled ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link">Esqueceu sua senha?</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
