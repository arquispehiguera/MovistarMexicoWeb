import { DireccionEntrega } from '../entities/direccion-entrega.entity';

export class DireccionEntregaMapper {
  static fromDto(data: any): DireccionEntrega {
    return new DireccionEntrega(
      data.direccionEntregaID,
      data.ventaID,
      data.mismaDireccion,
      data.calle,
      data.numeroExterior,
      data.numeroInterior,
      data.entreCalles,
      data.referencias,
      data.codigoPostal,
      data.colonia,
      data.delegacionMunicipio,
      data.estado,
      data.direccionCompleta
    );
  }
}
