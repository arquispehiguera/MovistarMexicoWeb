import { DireccionFacturacion } from '../entities/direccion-facturacion.entity';

export class DireccionFacturacionMapper {
  static fromDto(data: any): DireccionFacturacion {
    return new DireccionFacturacion(
      data.direccionFacturacionID,
      data.ventaID,
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
