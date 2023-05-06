export interface IHelperStringService {
  checkPasswordStrong(password: string, length?: number): boolean;
}
