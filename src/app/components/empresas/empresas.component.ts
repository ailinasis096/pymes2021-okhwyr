import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresas } from '../../models/empresas';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  Titulo = 'Empresas';
  TituloAccionABMC = {
    A: '(Agregar)',
    L: '(Listado)',
    C: '(Cancelar)'
  };
  AccionABMC = 'L';

  Items: Empresas[] = [];

  Mostrar: boolean = true;
  FormRegistro: FormGroup;
  submitted = false;
  modalDialogService: any;
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };
  RegistrosTotal: number;
  Pagina = 1;

  constructor(
    private empresasService: EmpresasService, //private articulosFamiliasService:  MockArticulosFamiliasService
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      IdEmpresa: [0],
      RazonSocial: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      CantidadEmpleados: [
        null,
        [Validators.required, Validators.pattern('[0-9]{1,7}')]
      ],
      FechaFundacion: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
    this.GetEmpresas();
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.empresasService.get(this.Pagina).subscribe((res: any) => {
      this.Items = res.Items;
      this.RegistrosTotal = res.RegistrosTotal;
    });
  }
  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, IdEmpresa: 0 });
    this.submitted = false;
  }
  Volver() {
    this.AccionABMC = 'L';
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaFundacion = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
      });
    }
  }

  GetEmpresas() {
    this.empresasService.get(this.Pagina).subscribe((res: Empresas[]) => {
      this.Items = res;
    });
  }
}
