export interface Pedido {
  producto: {
    nombre: string;
  };
  cantidad: number;
  trabajador?: {
    nombre: string;
  };
  createdAt?: string;
}
