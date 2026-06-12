import { RegistroVenta } from '../entities/registro-venta.entity';

export class RegistroVentaMapper {
  static fromDto(data: any): RegistroVenta {
    return new RegistroVenta(
      data.ventaID,
      data.usuarioID,
      data.producto,
      data.numeroPortar,
      data.dn,
      data.nombres,
      data.apellidoPaterno,
      data.apellidoMaterno,
      data.fechaNacimiento,
      data.telfContacto1,
      data.telfContacto2,
      data.companiaDonante,
      data.tipoLinea,
      data.correoElectronico,
      data.numero,
      data.ine,
      data.curp,
      data.rfc,
      data.nip,
      data.metodoEntrega,
      data.ciclosFacturacion,
      data.plan,
      data.planOriginal,
      data.planDcto,
      data.observaciones,
      data.fechaInicioGestion,
      data.fechaFinGestion,
      data.fechaRegistro
    );
  }
}
