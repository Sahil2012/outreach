import express from 'express';
import { getCompanies, createCompany, getEmployees, createEmployee, getOrCreateCompany, getOrCreateEmployee } from '../controller/companyController.js';
import { requireAuth } from '@clerk/express';

const companyRouter = express.Router();

companyRouter.get('/', requireAuth(), getCompanies);
companyRouter.post('/', requireAuth(), createCompany);
companyRouter.post('/get-or-create', requireAuth(), getOrCreateCompany);
companyRouter.get('/:companyId/employees', requireAuth(), getEmployees);
companyRouter.post('/:companyId/employees', requireAuth(), createEmployee);
companyRouter.post('/:companyId/employees/get-or-create', requireAuth(), getOrCreateEmployee);

export default companyRouter;
