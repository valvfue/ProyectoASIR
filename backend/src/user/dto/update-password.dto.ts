// DTO para cambiar la contraseña: pido la actual y la nueva

export class UpdatePasswordDto {
  currentPassword: string; // Contraseña actual para verificar
  newPassword: string;     // Nueva contraseña que se quiere guardar
}


