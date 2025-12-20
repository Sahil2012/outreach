import { EmployeeDTO } from "../dto/reponse/EmployeeDTO.js";

export const toEmployeeDTO = (employee: any): EmployeeDTO => {
    return {
        id: employee.id,
        name: employee.name,
        email: employee.email ?? null,
        company: employee.company ?? null,
        position: employee.position ?? null,
    };
}