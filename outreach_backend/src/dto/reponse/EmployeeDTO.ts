
export interface EmployeeDTO {
  id: number;
  name: string;
  email?: string | null;
  company?: string | null;
  position?: string | null;
}