import { useState } from "react"
import { useForm } from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"

const createUserFormSchema = z.object({
  name:z.string()
  .transform(name => {
    return name.trim().split(" ").map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(" ")
  })

  ,
  email: z.string()
  .nonempty("O email é obrigatório")
  .email("formato de e-mail inválido")
  .refine(email => {
    return email.endsWith("@suaempresa.com.br")
  },"Somente aceitamos email da '@suaempresa.com.br'")
  ,
  password:z.string()
  .min(6,"A senha precisa de no mínimo 6 caracteres"),
  confirmPassword:z.string(),
  
}).refine((fields) => fields.confirmPassword === fields.password , {
  path:["confirmPassword"],
  message:"As senhas precisam ser iguais"
} )

type createUserFormData = z.infer<typeof createUserFormSchema>

function App() {

  const [output,setOutput] = useState("")
  const { 
    register, 
    handleSubmit ,
    formState:{errors}} = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })

 

  function createUser (data: createUserFormData){
    setOutput(JSON.stringify(data,null,2))
  }

  return (
    <>
      <main className="h-screen bg-zinc-950  justify-center  flex flex-col  gap-10 items-center text-zinc-300">
        <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit(createUser)}>

        <div className="flex flex-col gap-1">
            <label htmlFor="">Nome</label>
            <input type="text" id="name"
            className="border border-zinc-800 bg-zinc-900 shadow-sm rounded h-10 px-3 text-white" 
            {...register("name")}
            />
            {errors.name && <span  className="text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" 
            className="border border-zinc-800 bg-zinc-900 shadow-sm rounded h-10 px-3 text-white"
            {...register("email")} 
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="">Senha</label>
            <input type="password" id="password"
            className="border border-zinc-800 bg-zinc-900 shadow-sm rounded h-10 px-3 text-white" 
            {...register("password")}
            />
            {errors.password && <span  className="text-red-500">{errors.password.message}</span>}

          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Confirmação de Senha</label>
            <input type="password" id="confirmPassword"
            className="border border-zinc-800 bg-zinc-900 shadow-sm rounded h-10 px-3 text-white" 
            {...register("confirmPassword")}
            />
            {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
          </div>  

         

         <button 
         type="submit"
         className=
         "bg-emerald-500 text-white rounded font-semibold hover:bg-emerald-600 h-10"
         >Salvar</button>

       
        </form>
        <pre>
          {output}
        </pre>
      </main>
    </>
  )
}

export default App
