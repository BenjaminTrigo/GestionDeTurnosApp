import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import  { api }  from '../api/axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '../hooks/use-toast';

const servicioSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duracion: z.coerce.number().min(15, 'La duración mínima es 15 minutos'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo'),
});

type ServicioFormData = z.infer<typeof servicioSchema>;

export default function CrearServicio() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      duracion: 30,
      precio: 0,
    },
  });

  const onSubmit = async (data: ServicioFormData) => {
    setIsLoading(true);
    try {
      await api.post('/services', {
        nombre: data.nombre,
        descripcion: data.descripcion,
        duracion: data.duracion,
        precio: data.precio,
      });
      
      toast({
        title: 'Éxito',
        description: 'Servicio creado correctamente',
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el servicio',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Crear Nuevo Servicio</CardTitle>
        <CardDescription>Añade un nuevo servicio a tu negocio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Servicio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Corte de cabello" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe el servicio en detalle"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duracion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input type="number" min="15" step="15" {...field} />
                    </FormControl>
                    <FormDescription>Mínimo 15 minutos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Creando...' : 'Crear Servicio'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}