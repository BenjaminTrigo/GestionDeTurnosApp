import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import  { api }  from '../api/axios';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

const reservaSchema = z.object({
  servicioId: z.string().min(1, 'Selecciona un servicio'),
  fecha: z.string().min(1, 'Selecciona una fecha'),
  hora: z.string().min(1, 'Selecciona una hora'),
});

type ReservaFormData = z.infer<typeof reservaSchema>;

export default function ReservarTurno() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoadingServicios, setIsLoadingServicios] = useState(true);
  const [isLoadingReserva, setIsLoadingReserva] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReservaFormData>({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      servicioId: '',
      fecha: '',
      hora: '',
    },
  });

  // Cargar servicios disponibles
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await api.get('/services');
        setServicios(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los servicios',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setIsLoadingServicios(false);
      }
    };

    fetchServicios();
  }, []);

  // Generar horas disponibles
  const generarHoras = () => {
    const horas = [];
    for (let i = 8; i < 18; i++) {
      horas.push(`${String(i).padStart(2, '0')}:00`);
      horas.push(`${String(i).padStart(2, '0')}:30`);
    }
    return horas;
  };

  // Generar fechas disponibles (próximos 30 días)
  const generarFechas = () => {
    const fechas = [];
    const hoy = new Date();
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + i);
      
      // Excluir domingos (0)
      if (fecha.getDay() !== 0) {
        fechas.push(fecha.toISOString().split('T')[0]);
      }
    }
    return fechas;
  };

  const onSubmit = async (data: ReservaFormData) => {
    setIsLoadingReserva(true);
    try {
      await api.post('/appointments', {
        servicioId: parseInt(data.servicioId),
        fecha: data.fecha,
        hora: data.hora,
      });

      toast({
        title: 'Éxito',
        description: 'Tu turno ha sido reservado correctamente',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo reservar el turno. Intenta con otra fecha u hora.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoadingReserva(false);
    }
  };

  if (isLoadingServicios) {
    return <div>Cargando servicios...</div>;
  }

  if (servicios.length === 0) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Reservar Turno</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay servicios disponibles en este momento.</p>
        </CardContent>
      </Card>
    );
  }

  const horas = generarHoras();
  const fechas = generarFechas();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Reservar un Turno</CardTitle>
        <CardDescription>Selecciona un servicio, fecha y hora disponible</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="servicioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servicios.map((servicio) => (
                        <SelectItem key={servicio.id} value={servicio.id.toString()}>
                          {servicio.nombre} - ${servicio.precio.toFixed(2)} ({servicio.duracion} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una fecha" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fechas.map((fecha) => (
                        <SelectItem key={fecha} value={fecha}>
                          {new Date(fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una hora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {horas.map((hora) => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoadingReserva} className="w-full">
              {isLoadingReserva ? 'Reservando...' : 'Reservar Turno'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}